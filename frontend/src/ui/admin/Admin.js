import React from 'react'
import  {Navigate, Outlet} from 'react-router-dom';
import {SidebarAdmin, HeaderAdmin} from '../Index';
import HeaderList from './HeaderList';
import { useSelector } from 'react-redux';

const Admin = () => {
  const {current} = useSelector(state => state.user);
  if (!current) {
    return <Navigate to="/login" replace />;
  }else if(current && current?.role === 2004){
    return <Navigate to="/login" replace />;
  }
  return (
    <div className='admin-layout'>
        <HeaderList />
        <SidebarAdmin />
        <div className='content'>
          <HeaderAdmin />
          <main>
            <Outlet/>
          </main>
        </div>
    </div>
  )
}

export default Admin