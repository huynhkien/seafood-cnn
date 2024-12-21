import React, { useState, useEffect } from 'react';
import { MdCancel } from 'react-icons/md';
import { FaArrowCircleRight } from "react-icons/fa";
import { identify, sendMessage } from '../../../apis/chatbox';
import userAvatar from '../../../assets/img/logo/9187604.png'; 
import botAvatar from '../../../assets/img/logo/images.png'

const ChatBoxTemplate = ({ setShowOption }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pastedImage, setPastedImage] = useState(null);

  useEffect(() => {
    setMessages([{ type: 'bot', content: 'Xin chào! Tôi có thể giúp gì cho bạn?' }]);
  }, []);

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        
        reader.onload = () => {
          setPastedImage({
            preview: reader.result,
            file: blob
          });
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  const handleRemoveImage = () => {
    setPastedImage(null);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' && !pastedImage) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      image: pastedImage?.preview
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      let response;
      if (pastedImage) {
        response = await identify(pastedImage.file);
        setMessages(prevMessages => [...prevMessages, { 
          type: 'bot', 
          content: `Theo dự đoán của tôi đây là ${response.predicted_class}. Giá tiền: ${response.predicted_price_range.min} - ${response.predicted_price_range.max}`
        }]);
      } else {
        response = await sendMessage(inputMessage);
        setMessages(prevMessages => [...prevMessages, { 
          type: 'bot', 
          content: response.response 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { 
        type: 'error', 
        content: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.' 
      }]);
    }

    setInputMessage('');
    setPastedImage(null);
  };

  return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <span className='message-header-icon'>
            <span>ChatBot</span>
          </span>
          <span className='chatbot-header-icon' onClick={setShowOption}>
            <MdCancel/>
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
              <div>
                {msg.content}
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Pasted content" 
                    className="chat-image"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chatbot-body">
          {pastedImage && (
            <div className="image-preview-container">
              <img 
                src={pastedImage.preview} 
                alt="Preview" 
                className="image-preview"
              />
              <button
                onClick={handleRemoveImage}
                className="remove-image-button"
              >
                <MdCancel/>
              </button>
            </div>
          )}
          <div className='chatbot-input-container'>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPaste={handlePaste}
            placeholder="Câu hỏi... (Paste ảnh Ctrl+V)"
            className="chatbot-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            <FaArrowCircleRight/>
          </button>
          </div>
        </div>
    </div>
  );
};

export default ChatBoxTemplate;
