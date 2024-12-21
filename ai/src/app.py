import random
import json
import torch
from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.config.config import settings
from sklearn.preprocessing import LabelEncoder
import tempfile
from PIL import Image
import io
import os
from tensorflow.keras.models import load_model
import pandas as pd
from src.utils import price



# Nhập các mô-đun từ thư mục ai
from chatbox.model import NeuralNet
from chatbox.nltk_utils import bag_of_words, tokenize

app = FastAPI()


# Setting CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.CLIENT_URL,
    ],  # Allow URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"], 
)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Đọc intents từ tệp intents.json
with open('chatbox/intents.json', 'r', encoding='utf-8') as json_data:
    intents = json.load(json_data)

# Tải mô hình từ tệp data.pth
FILE = "chatbox/data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

# Khởi tạo mô hình và tải trạng thái
model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()  # Chuyển mô hình vào chế độ đánh giá (evaluation mode)

@app.get("/")
async def run_server():
    try:
        return JSONResponse(content={"status": "run server"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"status": "server is failed", "error": str(e)}, status_code=500)

@app.post("/chat")
async def chat(message: dict):
    message = message.get('message', '')
    # Tách câu thành các từ
    sentence = tokenize(message)
    # Chuyển đổi danh sách các từ thành mảng nhị phân 0, 1
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    # Gọi mô hình với X là đầu vào
    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return JSONResponse(content={"response": random.choice(intent['responses'])})

    return JSONResponse(content={"response": "I không hiểu bạn nói gì..."})


# Tải mô hình TensorFlow đã huấn luyện
model_path = "identify/model_seafood.keras"
loaded_model = load_model(model_path)

# Tải LabelEncoder để chuyển đổi nhãn từ mô hình
data_csv_path = 'A:/LV/ai/identify/dataset/dataset.csv'
data_csv = pd.read_csv(data_csv_path)
labels = [str(word).strip() for word in data_csv['name'].to_numpy()]
label_encoder = LabelEncoder()
label_encoder.fit(labels)

def get_price_range_for_label(label: str) -> dict:
    """Lấy khoảng giá cho nhãn"""
    price_info = price.PRICE_MAPPING.get(label, {'min': 0, 'max': 0})
    
    # Trả về giá cơ bản nếu không có khoảng giá
    if isinstance(price_info, (int, float)):
        return {'min': price_info, 'max': price_info}
    
    return price_info


SUPPORTED_FORMATS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
    'image/tiff': '.tiff'
}

def convert_to_rgb(image_bytes):
    """Chuyển đổi ảnh sang RGB format"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        # Chuyển đổi sang RGB nếu cần
        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')
        # Nếu là ảnh grayscale, chuyển sang RGB
        if img.mode == 'L':
            img = img.convert('RGB')
        # Lưu ảnh vào buffer
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        return img_buffer.getvalue()
    except Exception as e:
        raise ValueError(f"Lỗi khi chuyển đổi ảnh: {str(e)}")

def load_single_image(img_path: str):
    """Tải và xử lý ảnh từ đường dẫn"""
    try:
        # Đọc file ảnh
        image = tf.io.read_file(img_path)
        
        # Decode ảnh
        try:
            image = tf.image.decode_image(image, channels=3)
        except:
            raise ValueError("Không thể decode ảnh")

        # Xử lý ảnh
        image = tf.image.resize(image, [250, 250])
        image = tf.cast(image, tf.float32) / 255.0
        image = tf.expand_dims(image, axis=0)
        
        # Data augmentation
        image = tf.image.random_flip_left_right(image)
        image = tf.image.random_brightness(image, max_delta=0.2)
        image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
        image = tf.image.random_hue(image, max_delta=0.2)
        image = tf.image.random_saturation(image, lower=0.8, upper=1.2)
        
        return image

    except Exception as e:
        raise ValueError(f"Lỗi khi xử lý ảnh: {str(e)}")

def predict_single_image(model, img_path, label_encoder):
    """Thực hiện dự đoán trên một ảnh"""
    try:
        # Tải và xử lý ảnh
        image = load_single_image(img_path)

        # Dự đoán
        predictions = model.predict(image)
        
        # Xử lý kết quả
        predicted_idx = np.argmax(predictions[0])
        predicted_label = label_encoder.inverse_transform([predicted_idx])[0]
        confidence = float(predictions[0][predicted_idx])
        predicted_price_range = get_price_range_for_label(predicted_label)

        # Lấy top 3 predictions
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = [
            {
                "label": label_encoder.inverse_transform([idx])[0],
                "confidence": float(predictions[0][idx]),
                "price": get_price_range_for_label(label_encoder.inverse_transform([idx])[0])
            }
            for idx in top_3_idx
        ]

        return predicted_label, confidence, top_3_predictions, predicted_price_range

    except Exception as e:
        raise ValueError(f"Lỗi khi dự đoán: {str(e)}")

@app.post("/image")
async def predict_image(file: UploadFile = File(...)):
    """API endpoint cho dự đoán ảnh"""
    
    # Kiểm tra định dạng file
    if file.content_type not in SUPPORTED_FORMATS:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Định dạng không được hỗ trợ",
                "supported_formats": list(SUPPORTED_FORMATS.keys())
            }
        )
    
    try:
        # Đọc nội dung file
        contents = await file.read()
        
        # Chuyển đổi ảnh sang RGB nếu cần
        contents = convert_to_rgb(contents)
        
        # Tạo file tạm
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name

        # Thực hiện dự đoán
        predicted_label, confidence, top_3_predictions, predicted_price_range = predict_single_image(
            loaded_model,  # Sử dụng mô hình TensorFlow
            temp_file_path,
            label_encoder
        )

        # Xóa file tạm
        os.unlink(temp_file_path)

        # Lấy thông tin về file ảnh
        with Image.open(io.BytesIO(contents)) as img:
            image_info = {
                "format": img.format,
                "mode": img.mode,
                "size": img.size,
            }

        return JSONResponse(content={
            "status": "success",
            "predicted_class": predicted_label,
            "confidence": confidence,
            "predicted_price_range": predicted_price_range,
            "top_3_predictions": top_3_predictions,
            "file_type": file.content_type,
            "image_info": image_info
        })

    except Exception as e:
        # Đảm bảo xóa file tạm nếu có lỗi
        if 'temp_file_path' in locals():
            os.unlink(temp_file_path)
            
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": str(e)
            }
        )
@app.get("/supported-formats")
async def get_supported_formats():
    """Trả về danh sách các định dạng được hỗ trợ"""
    return {
        "supported_formats": list(SUPPORTED_FORMATS.keys()),
        "status": "success"
    }