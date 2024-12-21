// index.js
const app = require('./app');
require('dotenv').config();
const connect = require('./app/config/index');
const db = require('./app/utils/mongodb.util');
const http = require('http'); // Thêm mô-đun http
const socketIo = require('socket.io');
const PORT = connect.app.port;

// Tạo một server HTTP từ ứng dụng Express
const server = http.createServer(app);

// Cấu hình `socket.io` với server HTTP
const io = socketIo(server, {
    cors: {
        origin: process.env.URL_CLIENT,  // Đảm bảo URL client khớp với origin
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e7
});

app.set('io', io);


const connectedUsers = new Map();
const messageHistory = new Map();
let onlineCount = 0;

io.on('connection', (socket) => {
  socket.on('user_connected', (data) => {
    const { userId, role, name } = data;
    connectedUsers.set(socket.id, {
        userId,
        role,
        name,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        lastActive: new Date().toISOString()
    });
    const allUserIds = new Set(
      Array.from(connectedUsers.values()).map(user => user.userId)
    );
    const onlineCount = allUserIds.size;
    
    io.emit('update_online_count', { 
        onlineCount,
        users: Array.from(allUserIds)  
    });
    if (messageHistory.has(userId)) {
      const userMessageHistory = messageHistory.get(userId);
      socket.emit('message_history', userMessageHistory);
    } else {
      socket.emit('message_history', [
        { 
          type: 'admin', 
          content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
    console.log(`User connected: ${name} (ID: ${userId}, Role: ${role})`);
    console.log(connectedUsers);
  });


  socket.on('send_message', (data) => {
    const { userId, name, type, content, img } = data;
    console.log(userId);
    const messageData = {
      ...data,
      timestamp: new Date().toISOString()
    };
    console.log(connectedUsers);

    // Lưu tin nhắn vào history
    if (!messageHistory.has(userId)) {
      messageHistory.set(userId, []);
    }
    messageHistory.get(userId).push(messageData);

    // admin gửi tin nhắn đến user
    if (type === 'admin') {
      // Tìm socket của user
      const userSocket = Array.from(connectedUsers.values())
        .find(user => user.userId === userId && user.role === '2004');
      
      if (userSocket) {
        io.to(userSocket.socketId).emit('receive_message', messageData);
      }
    } else {
      // Tin nhắn từ user đến admin
      const adminSockets = Array.from(connectedUsers.values())
        .filter(user => user.role === '2002');
      
      adminSockets.forEach(admin => {
        io.to(admin.socketId).emit('receive_message', {
          ...messageData, 
          userId: userId  
        });
      });
    }
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      if (user.role === '2004') {
        // Cập nhật số người online
        onlineCount = Math.max(0, onlineCount - 1);
        io.emit('update_online_count', { 
          onlineCount,
          users: Array.from(connectedUsers.values())
            .filter(u => u.role === '2004' && u.socketId !== socket.id)
            .map(u => u.userId)
        });

        // Thông báo cho admin về user disconnect
        const adminSockets = Array.from(connectedUsers.values())
          .filter(u => u.role === '2002');
        
        adminSockets.forEach(admin => {
          io.to(admin.socketId).emit('user_disconnected', user.userId);
        });
      }
      connectedUsers.delete(socket.id);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Kết nối với MongoDB
db.connect();

// Khởi động server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
