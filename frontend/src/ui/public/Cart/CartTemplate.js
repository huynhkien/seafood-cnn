import { formatMoney } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import withBaseComponents from '../../../hocs/withBaseComponents';
import { memo, useEffect, useState } from 'react';
import {Order} from '../../../ui/Index';
import { Breadcrumb} from '../../../components/Index';
import Swal from 'sweetalert2';
import { apiGetProducts } from '../../../apis';


const CartPage = ({dispatch, navigate }) => {
  const { currentCart, isLogin, current } = useSelector((state) => state.user);
  const calculateTotal = (cart) => {
    return cart.reduce((sum, el) => sum + el?.price * el?.quantity, 0);
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
 useEffect(() => {
  const validateCartQuantity = async () => {
    const response = await apiGetProducts();
    if (response.success) {
      const invalidItems = currentCart.filter(cartItem => {
        const product = response.setData.find(p => p._id === cartItem.product);

        return (
          product &&
          (
            product.variants.some(variant =>
              variant.variant === cartItem.variant && cartItem.quantity > variant.quantity
            ) ||
            (cartItem.variant === product.variant && cartItem.quantity > product.quantity)
          )
        );
      });

      if (invalidItems.length > 0) {
        const productNames = invalidItems.map(item => item.name).join(', ');
        Swal.fire({
          title: `Sản phẩm sau có số lượng vượt quá số lượng trong kho: ${productNames}`,
          text: 'Xin vui lòng kiểm tra lại giỏ hàng!',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  validateCartQuantity();
}, [currentCart]);

  return (
    <section className='cart-area pb-5'>
      <Breadcrumb
        category='Giỏ hàng'
        />
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <form action='#'>
              <div className='table-content table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th className='product-thumbnail'>Hình ảnh</th>
                      <th className='cart-product-name'>Sản phẩm</th>
                      <th className='product-price'>Lựa Chọn</th>
                      <th className='product-price'>Số lượng</th>
                      <th className='product-quantity'>Giá</th>
                      <th className='product-subtotal'>Tổng</th>
                      <th className='product-remove'>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCart?.map((el) => (
                      <Order
                        key={el._id}
                        addQuantity={el?.quantity}
                        variant = {el?.variant}
                        name = {el?.name}
                        thumb = {el?.thumb}
                        price = {el?.price}
                        pid = {el?._id}
                        dispatch = {dispatch}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='row mt-4'>
              <div className='col-md-8'>
                  <div className='cart-page-total'>
                    <h2>Thanh Toán</h2>
                    <ul className='mb-20'>
                      <li>
                        Tổng{' '}
                        <span>
                          {(calculateTotal(currentCart)?.toLocaleString())} VNĐ
                        </span>
                      </li>
                      <li>
                        Thành Tiền{' '}
                        <span>
                        {(calculateTotal(currentCart)?.toLocaleString())} VNĐ
                        </span>
                      </li>
                    </ul>
                    <span
                      style={{cursor: 'pointer'}}
                      onClick={() => handleLogin()}
                      className='tp-btn tp-color-btn banner-animation'
                    >
                      Thanh Toán
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withBaseComponents(memo(CartPage));
