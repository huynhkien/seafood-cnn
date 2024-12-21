import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os
from IPython.display import clear_output as cls




import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import callbacks
from tensorflow.keras import layers
from model import seafood_model
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder



# Thiết lập thông số
IMG_WIDTH = 200
IMG_HEIGHT = 200
IMG_SIZE = ( IMG_HEIGHT, IMG_WIDTH)
BATCH_SIZE = 10  # Số lượng mẫu xử lý trong cùng 1 lúc -> 10 mẫu
EPOCHS = 50 # Số lần lặp của toàn bộ dữ liệu huấn luyện

# Đường dẫn
data_csv_path = 'A:/LV/ai/identify/dataset/dataset.csv'
data_img_dir = 'A:/LV/ai/identify/dataset/seafood'


# Đọc file CSV 
data_csv = pd.read_csv(data_csv_path)


# # Hiển thị
# print(data_csv.head())

# Lấy đường dẫn ảnh
data_csv['filename'] = [data_img_dir + f"/{filename}" for filename in data_csv['filename']]

# # Hiển thị
# print(data_csv.head())


# Chuyển đổi nhãn thành các giá trị chuỗi
labels = [str(word) for word in data_csv['name'].to_numpy()]

# Tìm các nhãn duy nhất
unique_labels = sorted(set(labels))  # Sắp xếp để đảm bảo thứ tự nhất quán
print(unique_labels)
# Chuyển đổi nhãn thành các giá trị số
label_encoder = LabelEncoder()
data_csv['name_encoded'] = label_encoder.fit_transform(data_csv['name'])
encoded_labels = data_csv['name_encoded'].to_numpy()

# In ra 10 hàng đầu tiên
print(encoded_labels[:10])


# Mã hóa nhãn
encoded_labels = label_encoder.transform(labels)

# Số lượng lớp
num_classes = len(unique_labels)

print(f"Số lượng lớp: {num_classes}")



# # Xử lý hình ảnh 
# def load_and_preprocess_image(img_path: str, augment: bool = False):
#     # Đọc ảnh
#     image = tf.io.read_file(img_path)
#     image = tf.image.decode_jpeg(image, channels=3)
    
#     # Thay đổi kích thước
#     image = tf.image.resize(image, [IMG_HEIGHT, IMG_WIDTH])
    
#     # Chuẩn hóa
#     image = tf.cast(image, tf.float32) / 255.0
#     # Nếu có augment thực hiện các phép biến đổi tăng cường
#     if augment:
#         # lật ngẫu nhiên
#         image = tf.image.random_flip_left_right(image)
        
#         # Độ sáng ngẫu nhiên
#         image = tf.image.random_brightness(image, max_delta=0.2)
        
#         # Độ tương phản ngẫu nhiên
#         image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
        
#         # Màu sắc ngẫu nhiên
#         image = tf.image.random_hue(image, max_delta=0.2)
        
#         # Độ bão hòa ngẫu nhiên
#         image = tf.image.random_saturation(image, lower=0.8, upper=1.2)
        
#         # Đảm bảo các giá trị hình ảnh vẫn ở [0, 1]
#         image = tf.clip_by_value(image, 0.0, 1.0)
    
#     return image

def load_and_preprocess_image(img_path: str, augment: bool = False):
    # Đọc ảnh
    image = tf.io.read_file(img_path)
    image = tf.image.decode_jpeg(image, channels=3)
    
    # Thay đổi kích thước
    image = tf.image.resize(image, [IMG_HEIGHT, IMG_WIDTH])
    
    # Chuẩn hóa
    image = tf.cast(image, tf.float32) / 255.0
    
    if augment:
        # Các augmentation hiện tại của bạn
        image = tf.image.random_flip_left_right(image)
        image = tf.image.random_brightness(image, max_delta=0.2)
        image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
        image = tf.image.random_hue(image, max_delta=0.2)
        image = tf.image.random_saturation(image, lower=0.8, upper=1.2)
        
        # Thêm các augmentation mới
     
        
        # Zoom ngẫu nhiên
        image = tf.image.random_crop(
            tf.image.resize(image, [int(IMG_HEIGHT*1.1), int(IMG_WIDTH*1.1)]),
            [IMG_HEIGHT, IMG_WIDTH, 3]
        )
        
        # Thêm noise
        noise = tf.random.normal(shape=tf.shape(image), mean=0.0, stddev=0.01)
        image = image + noise
        
        # Đảm bảo các giá trị hình ảnh vẫn ở [0, 1]
        image = tf.clip_by_value(image, 0.0, 1.0)
    
    return image



# # Tạo dữ liệu để chuẩn bị cho việc huấn luyện
def create_dataset(file_paths, labels, batch_size, augment=False):
    def map_func(x, label):
        return load_and_preprocess_image(x, augment), label

    dataset = tf.data.Dataset.from_tensor_slices((file_paths, labels))
    dataset = dataset.map(map_func, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.shuffle(1000).batch(batch_size).prefetch(tf.data.AUTOTUNE)
    return dataset





# Tạo dataset
train_file_paths = data_csv['filename']
train_labels = encoded_labels
train_dataset = create_dataset(train_file_paths, train_labels, BATCH_SIZE, augment=True)

# Hiển thị ảnh
def show_images(dataset, num_images=4, figsize=(25, 25), model=None, label_encoder=None):
    plt.figure(figsize=figsize)
    
    for i, (image, label) in enumerate(dataset.take(num_images)):
        ax = plt.subplot(2, 2, i + 1)
        
        plt.imshow(image[0].numpy())
        
        # Giải mã nhãn thực từ chỉ số thành tên
        true_name_idx = label[0].numpy()  # Lấy chỉ số nhãn từ tensor
        true_name = label_encoder.inverse_transform([true_name_idx])[0] if label_encoder else str(true_name_idx)
        
        true_label = f"Name: {true_name}\n"
      
        # Nếu có mô hình, thực hiện dự đoán và hiển thị kết quả
        if model:
            predictions = model.predict(tf.expand_dims(image[0], axis=0))  # Thêm chiều để phù hợp với batch đầu vào
            pred_name_idx = np.argmax(predictions[0])
            
            # Giải mã nhãn dự đoán thành tên
            pred_name = label_encoder.inverse_transform([pred_name_idx])[0] if label_encoder else str(pred_name_idx)
            
            pred_label = f"Pred Name: {pred_name}\n"
    
            plt.title(f"{true_label}\n{pred_label}", fontsize=10)
        else:
            plt.title(true_label, fontsize=10)
        
        plt.axis('off')
    
    plt.subplots_adjust(top=0.9, bottom=0.1) 
    plt.show()

    
# Hiển thị ảnh
show_images(train_dataset, label_encoder=label_encoder)


# Khởi tạo mô hình

# model = OCRModel(IMG_WIDTH, IMG_HEIGHT, num_classes)
input_shape = (IMG_HEIGHT, IMG_WIDTH, 3)
model = seafood_model(input_shape, num_classes)
model.summary()  


model.compile(optimizer=keras.optimizers.Adam(learning_rate=1e-4), 
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

history = model.fit(
    train_dataset,
    epochs=EPOCHS,
    callbacks=[tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)]
)


model_save_path = 'A:/LV/ai/identify/model_seafood_improve.keras'  
model.save(model_save_path)  # Lưu mô hình




# Tải mô hình
loaded_model = keras.models.load_model('model_seafood.keras')


# show_images(dataset=val_dataset, model=loaded_model, label_encoder=label_encoder)

def load_single_image(img_path: str):
    # Tải và xử lý hình ảnh đơn lẻ
    image = tf.io.read_file(img_path)
    image = tf.image.decode_jpeg(image, channels=3)
    image = tf.image.resize(image, [200, 200])  # Đặt lại kích thước ảnh về 200x200
    image = tf.cast(image, tf.float32) / 255.0  # Chuẩn hóa giá trị pixel về khoảng [0, 1]
    image = tf.expand_dims(image, axis=0)  # Thêm chiều batch
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_brightness(image, max_delta=0.2)
    image = tf.image.random_contrast(image, lower=0.8, upper=1.2)
    image = tf.image.random_hue(image, max_delta=0.2)
    image = tf.image.random_saturation(image, lower=0.8, upper=1.2)
    return image


def predict_single_image(model, img_path, label_encoder):
    # Tải hình ảnh
    image = load_single_image(img_path)

    # Dự đoán
    predictions = model.predict(image)
    
    # Lấy chỉ số dự đoán và giải mã thành nhãn
    predicted_idx = np.argmax(predictions[0])
    predicted_label = label_encoder.inverse_transform([predicted_idx])[0]

    return predicted_label


img_path = 'A:/LV/ai/identify/test/images/131.png'  
# print(load_single_image(img_path))
predicted_label = predict_single_image(loaded_model, img_path, label_encoder)
print(predicted_label)

