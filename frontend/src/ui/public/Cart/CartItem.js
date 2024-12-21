import { memo } from 'react'
import { MdCancel } from 'react-icons/md';
import { GiCancel } from "react-icons/gi";

import { useSelector } from 'react-redux';
import withBaseComponents from '../../../hocs/withBaseComponents';
import {showCart, showModal} from "../../../store/app/appSlice";
import {formatMoney} from "../../../utils/helper"
import { toast } from 'react-toastify';
import {removeCart} from '../../../store/user/userSlice';
import Swal from 'sweetalert2';


const CartItem = ({dispatch, navigate}) => {
   const { currentCart, isLogin, current} = useSelector(state => state.user);  
   const handleRemoveCart = async (id, variant) => {
    dispatch(removeCart({
      pid: id,
      variant: variant,  
    }));
    
    toast.success('Sản phẩm đã xóa khỏi giỏ hàng!');
  };
   const handleLogin = async() => {
      if(isLogin && current){
         navigate('/checkout');
      }else{
         return Swal.fire({
            text: 'Vui lòng đăng nhập',
            icon: 'info',
            cancelButtonText: 'Không phải bây giờ',
            showCancelButton: true,
            confirmButtonText: 'Chuyển đến trang đăng nhập'
         }).then((rs) => {
            if(rs.isConfirmed) navigate('/login')
         })
      }
   }
  
  return (
    <div onClick={e => e.stopPropagation()}>
           <div className='tpcartinfo tp-cart-info-area p-relative tp-sidebar-opened'>
            <button className='tpcart__close' onClick={() =>dispatch(showCart()) } >
               <MdCancel />
            </button>
            <div class="tpcart">
               <h4 class="tpcart__title">Giỏ hàng</h4>
               <div class="tpcart__product">
                  <div class="tpcart__product-list">
                     <ul>
                     {(!currentCart || currentCart.length === 0) && <span>Giỏ hàng trống</span>}


                        {currentCart?.map((el, index) => (
                        <li>
                           <div class="tpcart__item">
                              <div class="tpcart__img">
                              <img className='img__cart--page' src={el?.thumb} alt="Payment Methods" width={100} height={50} />
                              <div onClick={() => handleRemoveCart(el?.product?._id, el?.variant)} class="tpcart__del">
                                 <span ><i><GiCancel fontSize='20' color=''/></i></span>
                                 </div>

                              </div>
                              <div class="tpcart__content">
                                 <span class="tpcart__content-title"><a href="shop-details.html">{el?.name}</a>
                                 </span>
                                 <div class="tpcart__cart-price">
                                    <span class="quantity">{el?.quantity} x</span>
                                    <span class="new-price">{(el?.price)?.toLocaleString()} VNĐ</span>
                                 </div>
                              </div>
                           </div>
                        </li>
                        ))}
                     </ul>
                  </div>
                  <div class="tpcart__checkout">
                     <div class="tpcart__total-price d-flex justify-content-between align-items-center">
                        <span> Thành tiền:</span>
                        <span class="heilight-price">{(currentCart?.reduce((sum, el) => sum + el?.price * el.quantity, 0)?.toLocaleString())} VNĐ</span>
                     </div>
                     <div class="tpcart__checkout-btn">
                        <span class="tpcart-btn my-2" style={{cursor: 'pointer'}} 
                           onClick={() => {
                              dispatch(showModal({isShowModal: false, modalChildren: null}))
                              navigate('/cart')
                           }}
                        
                        >Xem chi tiết</span>
                        <span style={{cursor: 'pointer'}} class="tpcheck-btn" onClick={() => handleLogin()}>Thanh toán</span>
                     </div>
                  </div>
               </div>
            </div>
           </div>
    </div>
  )
}

export default withBaseComponents(memo(CartItem));