import numpy as np
import random
import json

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from nltk_utils import bag_of_words, tokenize, stem
from model import NeuralNet

# Mở và đọc tệp intents.json
with open('intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

all_words = []  # Danh sách chứa tất cả các từ
tags = []       # Danh sách chứa tất cả các thẻ (tags)
xy = []         # Danh sách chứa các cặp (câu, thẻ)

# Lặp qua từng câu trong các mẫu của intents
for intent in intents['intents']:
    tag = intent['tag']
    # Thêm thẻ vào danh sách tags
    tags.append(tag)
    for pattern in intent['patterns']:
        # Phân tách từng từ trong câu
        w = tokenize(pattern)
        # Thêm vào danh sách all_words
        all_words.extend(w)
        # Thêm vào cặp xy
        xy.append((w, tag))

# Thực hiện stemming và chuyển thành chữ thường cho mỗi từ
ignore_words = ['?', '.', '!']  # Các ký tự không cần thiết
all_words = [stem(w) for w in all_words if w not in ignore_words]
# Loại bỏ các từ trùng lặp và sắp xếp
all_words = sorted(set(all_words))
tags = sorted(set(tags))

# In ra số lượng mẫu và thẻ
print(len(xy), "patterns")
print(len(tags), "tags:", tags)
print(len(all_words), "unique stemmed words:", all_words)

# Tạo dữ liệu huấn luyện
X_train = []  # Dữ liệu đầu vào
y_train = []  # Nhãn đầu ra
for (pattern_sentence, tag) in xy:
    # X: bag of words cho mỗi pattern_sentence
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    # y: CrossEntropyLoss của PyTorch chỉ cần nhãn lớp, không cần one-hot
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)  # Chuyển đổi thành mảng NumPy
y_train = np.array(y_train)

# Các tham số 
num_epochs = 1000         # Số lượng epoch
batch_size = 8            # Kích thước lô
learning_rate = 0.001     # Tỷ lệ học
input_size = len(X_train[0])  # Kích thước đầu vào
hidden_size = 8           # Kích thước lớp ẩn
output_size = len(tags)   # Kích thước đầu ra
print(input_size, output_size)

# Định nghĩa lớp ChatDataset
class ChatDataset(Dataset):
    
    def __init__(self):
        self.n_samples = len(X_train)  # Số mẫu
        self.x_data = X_train           # Dữ liệu đầu vào
        self.y_data = y_train           # Nhãn đầu ra

    # Hỗ trợ lập chỉ mục để có thể sử dụng dataset[i] để lấy mẫu thứ i
    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    # Gọi len(dataset) để trả về kích thước
    def __len__(self):
        return self.n_samples

dataset = ChatDataset()  # Tạo đối tượng dataset
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)  # Tạo DataLoader để tải dữ liệu

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')  # Chọn thiết bị (GPU hoặc CPU)

model = NeuralNet(input_size, hidden_size, output_size).to(device)  # Khởi tạo mô hình

# Định nghĩa hàm mất mát và bộ tối ưu hóa
criterion = nn.CrossEntropyLoss()  # Hàm mất mát
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)  # Bộ tối ưu hóa Adam

# Huấn luyện mô hình
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        words = words.to(device)  # Chuyển dữ liệu đầu vào sang thiết bị
        labels = labels.to(dtype=torch.long).to(device)  # Chuyển nhãn sang kiểu long và thiết bị
        
        # Truyền qua mô hình
        outputs = model(words)
        loss = criterion(outputs, labels)  # Tính toán hàm mất mát
        
        # Quá trình lan truyền ngược và tối ưu hóa
        optimizer.zero_grad()  # Đặt gradient về 0
        loss.backward()  # Tính gradient
        optimizer.step()  # Cập nhật tham số
        
    if (epoch+1) % 100 == 0:  # In ra thông tin sau mỗi 100 epoch
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

# In ra thông tin cuối cùng về hàm mất mát
print(f'final loss: {loss.item():.4f}')

# Lưu trạng thái mô hình và các thông số vào tệp
data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)  # Lưu tệp

print(f'training complete. file saved to {FILE}')  
