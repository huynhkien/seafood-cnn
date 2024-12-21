import React from 'react'
import { memo, useEffect, useState} from 'react';
import { logout } from '../../store/user/userSlice';
import { FaSearch, FaRegUser, FaHeart, FaList } from 'react-icons/fa';
import { CiShoppingCart } from 'react-icons/ci';
import { IoIosLogOut } from 'react-icons/io';
import {useSelector} from 'react-redux';
import {showCart} from '../../store/app/appSlice';
import {Logo} from '../../assets/img/Index'
import {CartItem, Notification} from '../../ui/Index';
import withBaseComponents from '../../hocs/withBaseComponents';
import { apiCreateNotification, apiGetCategory, apiGetNotifications } from '../../apis';
import { Search } from '../../components/Index';
import { FaImage } from "react-icons/fa";
import io from 'socket.io-client';

const socket = io('http://localhost:3001');


const Header = ({dispatch, navigate}) => {

   const { isShowCart} = useSelector((state) => state.app);
   const [name, setName] = useState(false);
   const [category, setCategory] = useState(null);
   const [info, setInfo] = useState(null);
   const [notifications, setNotifications] = useState(null);
   const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
   const [notification, setNotification] = useState(null);
   const [showList, setShowList] = useState(false);
   const { isLogin, currentCart, current} = useSelector(state => state.user); 
   console.log(current)
   const fetchCategory = async () => {
      const response = await apiGetCategory();
      setCategory(response?.data)
   } 
   const fetchNotification = async () => {
      const response = await apiGetNotifications();
      if(response.success) {
         const userSpecificNotifications = response.data.filter(
            noti => !noti.status_order || noti.status_order.uid.toString() === current?._id.toString()
         );
         
         setNotification(response.data);
         setUnreadNotificationsCount(userSpecificNotifications.length);
      }
   }
   useEffect(() => {
      fetchCategory();
      fetchNotification();
   }, [])
   const handleLogout = () => {
      dispatch(logout());  
      navigate('/'); 
    };
    useEffect(() => {
      const handleNewVoucher = async (data) => {
        if (data) {
          await apiCreateNotification({
            voucher: {
              voucher: data?.voucher?._id,
              code: data?.voucher?.code,
              startDate: data?.voucher?.startDate,
              endDate: data?.voucher?.endDate,
              discountType: data?.voucher?.discountType,
              discountValue: data?.voucher?.discountValue,
            },
          });
          fetchNotification();
        }
      };
    
      const handleNewProduct = async (data) => {
        if (data) {
          await apiCreateNotification({
            product: { product: data?.product?._id, name: data?.product?.name },
          });
          fetchNotification();
        }
      };
    
      const handleStatusOrder = async (data) => {
        if (data) {
          await apiCreateNotification({
            status_order: { status: data?.order?.status, order: data?.order?.oid, uid: data?.order?.uid },
          });
          fetchNotification();
        }
      };
      const handleCreateOrder = async (data) => {
        if (data) {
          await apiCreateNotification({
            status_order: { status: data?.order?.status,  uid: data?.order?.uid },
          });
          fetchNotification();
        }
      };
    
      socket.on('new_voucher_created', handleNewVoucher);
      socket.on('new_product_created', handleNewProduct);
      socket.on('order_status_update', handleStatusOrder);
      socket.on('order_status_create', handleCreateOrder);
    
      return () => {
        socket.off('new_voucher_created', handleNewVoucher);
        socket.off('new_product_created', handleNewProduct);
        socket.off('order_status_update', handleStatusOrder);
        socket.off('order_status_create', handleCreateOrder);
      };
    }, []);
    
  return (
   
    <header>
      <div className='header-icon-list' onClick={() => setShowList(prev => !prev)}><FaList className='icon-FaList'/></div>
      {showList && (
         <div className='header__top--responsive shadow'>
            <div className='header__info d-flex align-items-center'>
               <div className='header__info-search mx-2' onClick={() => setName(true)} >
                  <button className='tp-search-toggle' ><i><FaSearch/></i></button>
               </div>
               <div className='header__info-search mx-2'>
                  <a href={'/identify'} className='tp-search-toggle' ><i><FaImage/></i></a>
               </div>
               {isLogin && current &&
                  <>
                  <div className='header__info-user tpcolor__yellow mx-2 '>
                     <a href={'/wishlist'}><i><FaHeart/></i></a>
                  </div>
                  <div className='header__info-user tpcolor__yellow mx-2 '>
                     <button onClick={() => handleLogout()} ><i><IoIosLogOut/></i></button>
                  </div>
                  </>
               }
                  <div className='header__info-user mx-2'>
                  {current 
                  ? (<button onClick={() => setInfo(prev => !prev)}><i><FaRegUser/></i></button>)  :
                     <a href={'/login'}><i><FaRegUser/></i></a>
                  }
                  </div>
               <div className='header__info-cart tp-cart-toggle mx-2'>
                  <button onClick={() => dispatch(showCart())}><i><CiShoppingCart/></i>
                     <span>{currentCart.length}</span>
                  </button>
               </div>
            </div>
            <div className='header__res--nav'>
            <nav className='nav-menu'>
                  <ul>
                     <li className='has-dropdown has-homemenu'>
                        <a href={'/'}>Trang chủ</a>
                     </li>
                     <li className='has-dropdown has-megamenu' >
                        <a href='/'>Danh mục</a>
                        <ul className='sub-menu'>
                           {category?.map((el) => (
                              <li className='py-1'>
                                 <a href={`/${el?.name}`}>
                                    {el?.name}
                                 </a>
                              </li>
                           ))}
                        </ul>
                     </li>
                     <li><a href={'/about'}>Giới thiệu</a></li>
                     <li><a href={'/contact'}>Liên hệ</a></li>
                  </ul>
               </nav>
            </div>
         </div>
      )}
         <div className='header__top theme-bg-1 d-none d-md-block'>
            <div className='container'>
               <div className='row align-items-center'>
                  <div className='col-lg-6 col-md-12'>
                     <div className='header__top-left'>
                        <span>Sản phẩm tại <strong>Cửa Hàng</strong> luôn được nhập mới mỗi ngày.</span>
                     </div>
                  </div>
                  <div className='col-lg-6 col-md-12'>
                     <div className='header__top-right d-flex align-items-center'>
                        <div className='header__top-link'>
                        <span 
                           style={{color: 'white', cursor: 'pointer'}} 
                           onClick={() => setNotifications(prev => !prev)}
                        >
                           Thông báo
                           {unreadNotificationsCount > 0 ? ( 
                              <span className='top-link__icon'>{unreadNotificationsCount}</span>
                           ) : (
                              <span className='top-link__icon'>0</span>
                           )}
                        </span>
                           {notifications && (
                              <div className='notification-template shadow'>
                                 <Notification
                                 fetchNotifications={fetchNotification}
                                 notification={notification}
                                 />
                              </div>
                           )}
                           {isLogin && current && <a href={'/order'}>Đơn hàng</a>}
                           {isLogin && current && <a href={'/voucher'}>Ưu đãi</a>}
                        </div>
                        <div className='header__lang'>
                          <span className='header__lang-select'>Xin chào, 
                            {isLogin && current ? ` ${current?.name}` : ' khách hàng'}
                          </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div id='header-sticky' className='header__main-area d-none d-xl-block'>
            <div className='container'>
               <div className='header__for-megamenu p-relative'>
                  <div className='row align-items-center'>
                     <div className='col-xl-3'>
                        <div className='header__logo'>
                        <a href={'/'}><img src={Logo} alt="Payment Methods" width={200}/></a>
                        </div>
                     </div>
                     <div className='col-xl-6'>
                        <div className='header__menu main-menu text-center'>
                           <nav id='mobile-menu'>
                              <ul>
                                 <li className='has-dropdown has-homemenu'>
                                    <a href={'/'}>Trang chủ</a>
                                 </li>
                                 <li className='has-dropdown has-megamenu' >
                                    <a href='/'>Danh mục</a>
                                    <ul className='sub-menu mega-menu d-flex flex-wrap'>
                                       {category?.map((el) => (
                                          <li className='py-1'>
                                             <a href={`category/${el?.name}`}>
                                                {el?.name}
                                             </a>
                                          </li>
                                       ))}
                                    </ul>
                                 </li>
                                 <li><a href={'/about'}>Giới thiệu</a></li>
                                 <li><a href={'/contact'}>Liên hệ</a></li>
                              </ul>
                           </nav>
                        </div>
                     </div>
                     <div className='col-xl-3'>
                        <div className='header__info d-flex align-items-center'>
                           <div className='header__info-search mx-2' onClick={() => setName(true)} >
                              <button className='tp-search-toggle' ><i><FaSearch/></i></button>
                           </div>
                           <div className='header__info-search mx-2'>
                              <a href={'/identify'} className='tp-search-toggle' ><i><FaImage/></i></a>
                           </div>
                           {isLogin && current &&
                              <>
                              <div className='header__info-user tpcolor__yellow mx-2 '>
                                 <a href={'/wishlist'}><i><FaHeart/></i></a>
                              </div>
                              <div className='header__info-user tpcolor__yellow mx-2 '>
                                 <button onClick={() => handleLogout()} ><i><IoIosLogOut/></i></button>
                              </div>
                              </>
                           }
                              <div className='header__info-user mx-2'>
                              {current 
                              ? (<button onClick={() => setInfo(prev => !prev)}><i><FaRegUser/></i></button>)  :
                                 <a href={'/login'}><i><FaRegUser/></i></a>
                              }
                              </div>
                           <div className='header__info-cart tp-cart-toggle mx-2'>
                              <button onClick={() => dispatch(showCart())}><i><CiShoppingCart/></i>
                                 <span>{currentCart.length}</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {isShowCart && <div className='cart-page position-fixed top-0 end-0 bg-light w-25 h-100 shadow-sm'>
                           <CartItem
                           />
                        </div>}
         {name && <div className='search-page position-fixed top-0 bg-light w-100 h-50 shadow-sm'>
                     <Search
                        name={name}
                        setName={setName}
                     />
                  </div>}
         {current && info && 
            <div class="user-info shadow">
               <ul>
                  <li><span>Điểm tích lũy</span> <span>{current?.accumulate?.points || 0}</span></li>
                  <li><span>Rank</span> <span class="rank">{current?.accumulate?.rank || 0}</span></li>
                  <li className='underline'><a href={'/info-user'}>Thông tin cá nhân</a></li>
                  <li className='underline'><a href={'/order'}>Đơn hàng</a></li>
                  {(current?.role === "2002" || current?.role === "2006") && (
                     <li className="underline">
                        <a href="/admin">Quản lý</a>
                     </li>
                     )}
                  <li><a href='voucher'>Ưu đãi</a></li>
               </ul>
            </div>
         }
      </header>
  )
}

export default withBaseComponents(memo(Header));