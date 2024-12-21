import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { logout } from '../../store/user/userSlice';
import withBaseComponents from '../../hocs/withBaseComponents';
import { FaMessage } from 'react-icons/fa6';
import { IoIosLogOut } from "react-icons/io";

const HeaderAdmin = ({dispatch, navigate}) => {
  const handleLogout = () => {
    dispatch(logout());  
    navigate('/'); 
  };
  return (
   
      <nav>
      <i className='bx bx-menu'></i>
      <form action='#'>
        <div className='form-input'>
          <input type='search' placeholder='Search...' />
          <button className='search-btn' type='submit'><FaSearch/></button>
        </div>
      </form>
      <a href={'/admin/message'} style={{cursor: 'pointer', color: 'blue'}} ><FaMessage/></a>
      <span style={{cursor: 'pointer'}} onClick={() => handleLogout()}><IoIosLogOut /></span>
    </nav>
    
  );
}

export default withBaseComponents(HeaderAdmin);
