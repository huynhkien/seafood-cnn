import React from 'react'
import { FaSearch } from 'react-icons/fa';
export default function Chat({showChat, setShowChat}) {
  return (
    <div className='chats'>
        <div className='chats-wrapper'>
            <div className='chats-top'>
                <div className='chats-title'>
                    <h4>Tin nhắn</h4>
                </div>
                <div className='chats-search'>
                    <FaSearch className='chats-search__icon'/>
                    <input className='chats-search__input' placeholder='Search on message'/>
                </div>
            </div>
            <div className='chats-center'>
                <div className='chats-img'>
                    <img src='/assets/person/1.jpeg' alt='person'/>
                </div>
                <div className='chats-body'>
                    <span className='chats-name'>
                        <p>Kien</p>
                        <span>5 days ago</span>
                    </span>
                    <span className='chats-text'>Information</span>
                </div>
            </div>
            <div className='chats-center'>
                <div className='chats-img'>
                    <img src='/assets/person/1.jpeg' alt='person'/>
                </div>
                <div className='chats-body'>
                    <span className='chats-name'>
                        <p>Kien</p>
                        <span>5 days ago</span>
                    </span>
                    <span className='chats-text'>Information</span>
                </div>
            </div>
            <div className='chats-center'>
                <div className='chats-img'>
                    <img src='/assets/person/1.jpeg' alt='person'/>
                </div>
                <div className='chats-body'>
                    <span className='chats-name'>
                        <p>Kien</p>
                        <span>5 days ago</span>
                    </span>
                    <span className='chats-text'>Information</span>
                </div>
            </div>
            <hr/>
            <div className='chats-bottom text-center'>
                <a href={'/admin/message'} onClick={() => setShowChat(false)} className='chats-bottom__link'>Hiển thị tin nhắn</a>
            </div>
        </div>
    </div>
  )
}
