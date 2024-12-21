import React, { useState, useCallback, useEffect} from 'react';
import { FaUserLock, FaRegUser, FaAddressBook, FaPhone, FaKey, FaRegistered } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import { CiMail } from 'react-icons/ci';
import {Input , Button, Loading, LoginGoogle} from '../../components/Index';
import { apiLogin, apiRegister} from '../../apis';
import Swal from 'sweetalert2';
import {validate} from '../../utils/helper'
import {login} from '../../store/user/userSlice';
import {showModal} from '../../store/app/appSlice'
import { useDispatch } from 'react-redux';
import path from '../../utils/path';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const Login = () => {
  const navigate =useNavigate(false)
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);
  const [payload, setPayLoad] =useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''

  });
  const [invalidFields, setInValidFields] = useState('');
  const [isRegister, setIsRegister] =useState(false);
  const resetPayload = () => {
    setPayLoad({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      address: ''
    })
  }
  useEffect(() => {
    // Lắng nghe sự kiện connect
    socket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off('connect');
    };
  }, []);



  useEffect(() => {
    resetPayload();
  }, [isRegister])
  const handleSubmit = useCallback( async() => {
    const { confirmPassword, ...data } = payload; 
    const { name, phone, address, ...loginData } = data; 

    const invalids = isRegister ? validate(payload, setInValidFields) : validate(data, setInValidFields);
    try{
      if(isRegister){
        if (payload.password !== payload.confirmPassword) {
          Swal.fire(
            'Vui lòng nhập lại mật khẩu',
            'Mật khẩu bạn nhập lại không đúng', 
            'error'
          );
          resetPayload();
        }else{
          try{
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            console.log(payload);
          const response = await apiRegister(payload);
          if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            Swal.fire( 'Congratulations' , response.message, 'success' ).then(() => {
              setIsRegister(false);
              resetPayload();
          })}
        }catch(response){
          dispatch(showModal({ isShowModal: false, modalChildren: null }));
          Swal.fire( 'Oop!' , response.message, 'error' );
          resetPayload();
          
        }
      }
      }else{
        try{
          const response = await apiLogin(loginData);
          if(response.success){
            if (socketConnected) {
              socket.emit('user_connected', {
                userId: response.userData._id,
                role: response.userData.role,
                name: response.userData.name
              });
            }
    
            dispatch(login({ isLogin: true, token: response.accessToken, userData: response.userData }));
            if (response?.userData?.role === '2002' || response?.userData?.role === '2006') {
              navigate(`/${path.ADMIN}`)
            } else if(response?.userData?.role === '2004') {
              navigate(`/${path.HOME}`)
            }
          }else{
            Swal.fire('Oop!', response.message, 'error');
            resetPayload();
          }
        } catch(response) {
          Swal.fire('Oop!', response.message, 'error');
          resetPayload();
        }
    }
    } catch(e){
      console.log("Lỗi:",e)
      resetPayload();
    }
    setTimeout(() => {
      setInValidFields([]);
    }, 3000)
   },[isRegister, payload]);
   
  return (
    <section class='track-area pb-10'>
        <div class='row justify-content-center'>
       <div class='col-lg-6 col-sm-12 '>
          <div class='tptrack__product py-5 '>
             <div class='tptrack__content bg-light'>
                <div class='tptrack__item d-flex mb-20'>
                   <div class='tptrack__item-icon'>
                      {!isRegister ? <FaUserLock/> : <FaRegistered/>}
                   </div>
                   <div class='tptrack__item-content'>
                      <h4 class='tptrack__item-title'>{isRegister ? 'Đăng kí' : 'Đăng nhập' }</h4>
                      <p>{isRegister ? 'Điền đầy đủ các thông tin để đăng lý tài khoản ' : 'Vui lòng đăng nhập tài khoản và mật khẩu' }</p>
                   </div>
                </div>
                   <Input
                        iconClass={<CiMail/>}
                        value={payload.email}
                        setValue={setPayLoad}
                        nameKey='email'
                        placeholder='Email'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}/>
               
                   <Input
                        iconClass={<FaKey/>}
                        value={payload.password}
                        setValue={setPayLoad}
                        nameKey='password'
                        type='password'
                        placeholder='Mật khẩu'
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}/>
              
                {isRegister && (
                    <>
                            <Input
                              iconClass={<FaKey/>}
                              value={payload.confirmPassword}
                              setValue={setPayLoad}
                              nameKey='confirmPassword'
                              type='password'
                              secureTextEntry={true}
                              placeholder='Nhập lại mật khẩu'
                              invalidFields={invalidFields}
                              setInValidFields={setInValidFields}
                            />
                            <Input
                                iconClass={<FaRegUser/>}
                                value={payload.name}
                                setValue={setPayLoad}
                                nameKey='name'
                                placeholder='Tên người dùng'
                                invalidFields={invalidFields}
                                setInValidFields={setInValidFields}
                            />
                            <Input
                                iconClass={<FaPhone/>}
                                value={payload.phone}
                                setValue={setPayLoad}
                                nameKey='phone'
                                placeholder='Số điện thoại'
                                invalidFields={invalidFields}
                                setInValidFields={setInValidFields}
                            />
                            <Input
                                iconClass={<FaAddressBook/>}
                                value={payload.address}
                                setValue={setPayLoad}
                                nameKey='address'
                                placeholder='Địa chỉ nhà'
                                invalidFields={invalidFields}
                                setInValidFields={setInValidFields}
                            />
                    </>
                )}

               
                {!isRegister &&
                <div class='tpsign__remember d-flex align-items-center justify-content-between'>
                    <div class='tpsign__pass'>
                      <span style={{cursor: 'pointer'}} onClick={() => setIsRegister(true)}>Tạo tài khoản</span>
                   </div>
                   <div class='tpsign__pass'>
                      <a href={`/${path.FORGOT_PASSWORD}`} >Quên mật khẩu?</a>
                   </div>
                </div>
                }
                
                <Button
                    name={isRegister ? 'Đăng kí' : 'Đăng nhập'}
                    handleOnClick={handleSubmit}
                    />
                {isRegister &&
                      <div class='text-center pt-2'>
                        <span style={{cursor: 'pointer'}} onClick={() => setIsRegister(false)}>Đăng nhập</span>
                      </div>
                }
                {!isRegister &&
                <div className='login-google'>
                    <span className='p-2'>Hoặc</span>
                    <LoginGoogle/>
                </div>
                }
                </div>
             </div>
          </div>
       </div>
    </section>
  );
}

export default Login;
