import torch
import torch.nn as nn


class NeuralNet(nn.Module):
    """
    Khởi tạo mô hình với các tham số đặc trưng như:
    -input_size: Số lượng đặc trưng đầu vào
    -hidden_size: Số lượng các lớp ẩn
    -num_classes: Số lượng lớp đầu ra của mô hình dự án
    """
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        """
        l1, l2, l3 thực hiện các phép biến đổi tuyến tính
        để cải thiện độ chính xác của dự đoán trong mô hình huấn luyện
        """
        self.l1 = nn.Linear(input_size, hidden_size) 
        self.l2 = nn.Linear(hidden_size, hidden_size) 
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
       
        return out