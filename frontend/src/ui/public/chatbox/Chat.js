import React, { useState, useEffect, useRef } from 'react';
import { MdCancel } from 'react-icons/md';
import { FaArrowCircleRight } from "react-icons/fa";
import userAvatar from '../../../assets/img/logo/9187604.png'; 
import botAvatar from '../../../assets/img/logo/images.png';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';

const socket = io.connect("http://localhost:3001");

const Chat = ({ setShowChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { current , message} = useSelector(state => state.user);
  const fileInputRef = useRef(null);
  
  // Khởi tạo userId và userName cố định
  const [userId, setUserId] = useState(current ? current._id : nanoid(6));
  const [userName, setUserName] = useState(current ? current.name : `User-${nanoid(6)}`);
  const userRole = current ? current.role : '2004';

  useEffect(() => {
    console.log(message);
    // Gửi thông tin kết nối người dùng
    socket.emit('user_connected', {
      userId,
      role: userRole,
      name: userName
    });

    // Nhận tin nhắn từ server
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Nhận lịch sử tin nhắn
    socket.on('message_history', (history) => {
      setMessages((prevMessages) => {
        if (prevMessages.length === 0) {
          return history;
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off('user_connected');
      socket.off('receive_message');
      socket.off('message_history');
    };
  }, [userId, userRole, userName]); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const messageData = {
          role: userRole,
          type: 'user',
          userId: userId,
          content: inputMessage,
          img: reader.result,
          timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setInputMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          const messageData = {
            role: userRole,
            type: 'user',
            userId: userId,
            content: inputMessage,
            img: reader.result,
            timestamp: new Date().toISOString()
          };

          socket.emit('send_message', messageData);
          setMessages((prevMessages) => [...prevMessages, messageData]);
          setInputMessage('');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: nanoid(),
      role: userRole,
      type: 'user',
      userId: userId,
      content: inputMessage,
      name: userName,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span className='message-header-icon'>Trực tuyến</span>
        <span className='chatbot-header-icon' onClick={setShowChat}>
          <MdCancel />
        </span>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}-message`}>
            <img 
              src={msg.type === 'user' ? userAvatar : botAvatar} 
              alt="Avatar" 
              className="avatar"
            />
            {msg.content && <p className='message-text'>{msg.content}</p>}
            {msg.img && (
              <img 
                src={msg.img} 
                alt="Uploaded" 
                className="message-image"
                style={{ maxWidth: '5vw', maxHeight: '5vw', borderRadius: '8px' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="chatbot-body">
        <div className='chatbot-input-container'>
          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhắn tin..."
            className="chatbot-input"
            onPaste={handlePaste} 
          />
          <button onClick={handleSendMessage} className="send-button">
            <FaArrowCircleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
