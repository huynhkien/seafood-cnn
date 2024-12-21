import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { MdOutlinePhotoLibrary } from 'react-icons/md'
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import userAvatar from '../../../assets/img/logo/9187604.png'; 


const socket = io.connect("http://localhost:3001");

const ChatTemplate = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const {current} = useSelector(state => state.user);
  const fileInputRef = useRef(null);


  useEffect(() => {
    socket.emit('user_connected', {
      userId: current._id,
      role: current.role,
      name: current.name
    });
    socket.on('update_online_count', (data) => {
      setOnlineCount(data.onlineCount);
    });
    // Lắng nghe tin nhắn mới
    socket.on('receive_message', (data) => {
      // Nếu là tin nhắn từ user
      if (data.type !== 'admin') {
        setConversations(prev => ({
          ...prev,
          [data.userId]: [...(prev[data.userId] || []), data]
        }));
  
        // Kiểm tra xem user đã có trong activeUsers chưa
        setActiveUsers(prev => {
          const userExists = prev.some(user => user.id === data.userId);
          if (!userExists) {
            return [...prev, {
              id: data.userId,
              name: data.name, 
              role: data.role,
              avatar: userAvatar,
              lastSeen: 'Online',
              lastMessage: data.content
            }];
          }
          return prev;
        });
      }
    });
    return () => {
      socket.off('update_online_count');
      socket.off('user_connected');
      socket.off('receive_message');
      socket.off('user_disconnected');
    };
  }, []);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const messageData = {
          userId: selectedUser.id,
          role: selectedUser.role,
          type: 'admin',
          content: inputMessage,
          img: reader.result, 
          timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setConversations(prev => ({
          ...prev,
          [selectedUser.id]: [...(prev[selectedUser.id] || []), messageData]
        }));
        setInputMessage('');
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSendMessage = () => {
    if (!selectedUser || !inputMessage.trim()) return;
    

    const messageData = {
      userId: selectedUser.id,
      role:selectedUser.role,
      type: 'admin',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', messageData);
    setConversations(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), messageData]
    }));
    setInputMessage('');
  };

  const filteredUsers = activeUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  useEffect(() => {
    console.log(activeUsers)
  },[activeUsers])

  return (
    <div className='message-template'>
      <div className='message-template__item'>
        <div className='message-template-wrapper'>
          <div className='template-wrapper__top'>
            <div className='template-wrapper__top-title'>
              <h4>Tin nhắn ({onlineCount} người online)</h4>
            </div>
            <div className='template-wrapper__top-search'>
              <FaSearch className='icon'/>
              <input 
                className='top-search__input' 
                placeholder='Tìm kiếm...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>          
          {filteredUsers.map((user) => (
            <div 
              key={user.id}
              className='template-wrapper__center'
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <div className='wrapper__center--img'>
                <img src={user.avatar} alt='person'/>
              </div>
              <div className='wrapper__center--body'>
                <span className='wrapper__center--body-name'>
                  <p>{user.name}</p>
                  <span>{user.lastSeen}</span>
                </span>
                <span className='wrapper__center--body-text'>
                  {conversations[user.id]?.[conversations[user.id].length - 1]?.content || user.lastMessage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='message-template__body'>
        {selectedUser ? (
          <div className='message-template-wrapper'>
            <div className='message-top'>
              <div className='message-top-left'>
                <div className='message-name'>
                  <img src={selectedUser.avatar} alt='person'/>
                  <span>
                    <h4>{selectedUser.name}</h4>
                    <span>Online</span>
                  </span>
                </div>
              </div>
            </div>

            <div className='message-center'>
              {conversations[selectedUser.id]?.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message-body message-body-${msg.type}`}
                >
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

            <div className='message-bottom'>
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <MdOutlinePhotoLibrary 
                className='message-bottom-icon' 
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: 'pointer' }}
              />
              <input 
                className='message-bottom-input'
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhắn tin..."
              />
              <span>
                <IoSend 
                  onClick={handleSendMessage} 
                  className='message-bottom-icon mx-2'
                  style={{ cursor: 'pointer' }}
                />
              </span>
          </div>
          </div>
        ) : (
          <div className='message-template-wrapper'>
            <div className='message-center'>
              <p style={{ textAlign: 'center', padding: '20px' }}>
                Chọn một người dùng để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatTemplate