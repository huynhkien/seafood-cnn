import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer, ChatBoxTemplate, Chat } from '../Index';
import { IoMdChatbubbles } from "react-icons/io";
import { FaRobot } from 'react-icons/fa';

const Public = () => {
  const [showChat, setShowChat] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const handleChatToggle = () => {
    setShowChat(prev => !prev); 
  };
  const handleChatBotToggle = () => {
    setShowChatBot(prev => !prev); 
  };

  return (
    <div>
      <Header />
      <div className='position-relative'>
        <Outlet />
      </div>
      <div className='chat--item'>
        <FaRobot
          onClick={handleChatToggle} 
          className='icon' 
          size={50} 
        />
      </div>
      <div className='chatbot--item'>
        <IoMdChatbubbles
          onClick={handleChatBotToggle} 
          className='icon' 
          size={50} 
        />
      </div>
      {showChat && (
        <div className='chatBox-template'>
          <ChatBoxTemplate
            setShowOption={handleChatToggle}
          />
        </div>
      )}
      {showChatBot && (
        <div className='chatBox-template'>
          <Chat
            setShowChat={handleChatBotToggle}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Public;
