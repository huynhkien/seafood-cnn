import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegEye, FaCartPlus   } from "react-icons/fa";
import { formatMoney, renderStartFromNumber } from '../../../utils/helper';
import {apiUpdateWishList} from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {addToCart, addToWishList, removeFromWishList} from '../../../store/user/userSlice';
const Product = ({productData}) => {
   const [heart, setHeart] = useState(false);
   const {current} = useSelector(state => state.user);
   const dispatch = useDispatch();
   const navigate = useNavigate(false);

   useEffect(() => {
      if (current) {
        const isInWishlist = current?.wishlist?.includes(productData.id);
        setHeart(isInWishlist);
      }
    }, [current, productData.id]);
   const handleAddCart = () => {
      const quantity = 1; 
      dispatch(addToCart({
        pid: productData.id,
        category: productData?.category,
        variant: productData.variant,
        quantity,
        thumb: productData.thumb,
        price: productData.price,
        name: productData.name
      }));
    
      toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
    };
    const handleAddWishList = async () => {
      if (!current) {
        return Swal.fire({
          text: 'Vui lòng đăng nhập',
          icon: 'info',
          cancelButtonText: 'Không phải bây giờ!',
          showCancelButton: true,
          confirmButtonText: 'Chuyển đến trang đăng nhập'
        }).then((rs) => {
          if (rs.isConfirmed) navigate('/login');
        });
      }
  
      try {
        const response = await apiUpdateWishList(productData.id, heart ? 'remove' : 'add');
        if (response.success) {
          setHeart(!heart);
          if (heart) {
            dispatch(removeFromWishList(productData.id));
            toast.success(response.mes);
          } else {
            dispatch(addToWishList(productData.id));
            toast.success(response.mes);
          }
        } else {
          toast.error(response.mes);
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    };
   
   return (
    <div class="tpproduct p-relative shadow">
         <div class="tpproduct__thumb p-relative text-center ">
                                <a href={`/detail/${productData?.id}`}><img src={productData?.thumb} width={100} height={300} alt=""/></a>
                                <a class="tpproduct__thumb-img" href={`/detail/${productData?.id}`}><img src={productData?.image} width={500} height={300} alt=""/></a>
                                <div class="tpproduct__info bage">{productData?.disCount?.value && <span class="tpproduct__info-discount bage__discount">-{productData?.disCount?.discountType === 'percentage' ? `${productData?.disCount?.value} %` : `${productData?.disCount?.value?.toLocaleString()} VNĐ` }</span>}
                                   {productData?.quantity === 0 && 
                                   <span class="tpproduct__info-hot bage__hot">Hết hàng</span>
                                   }
                                </div>
                                {productData?.quantity !== 0 &&
                                <div class="tpproduct__shopping">
                                   <button class="tpproduct__shopping-wishlist" onClick={handleAddWishList}><i><FaHeart/></i></button>
                                   <button class="tpproduct__shopping-wishlist"><i><a href={`/product/${productData?.id}`}><FaRegEye/></a></i></button>
                                   <button class="tpproduct__shopping-cart" onClick={handleAddCart}><i><FaCartPlus/></i></button>
                                </div>
                                 }
         </div>
         <div class="tpproduct__content">
                                <h4 class="tpproduct__title">
                                   <a href="/">{productData?.name}</a>
                                </h4>
                                <div class="tpproduct__rating mb-3">
                                {renderStartFromNumber(productData?.totalRatings)?.map((el, index) => (
                                   <span key={index}>{el}</span>
                                ))}
                                </div>
                                <div class="tpproduct__price">
                                   <span>{`${(productData?.price).toLocaleString()} VNĐ`}</span>
                                   {productData?.disCount?.value &&
                                   <del>{`${(productData?.priceCoupon).toLocaleString()} VNĐ`}</del>
                                 }
                                </div>
                              </div>
                            <div class="tpproduct__hover-text ">
                            {productData?.quantity !== 0 && 
                            <>
                                <div class="tpproduct__hover-btn d-flex justify-content-center mb-10">
                                   <button class="tp-btn-2" onClick={handleAddCart}>Thêm vào giỏ</button>
                                </div>
                              
                                <div class="tpproduct__descrip">
                                   <ul>
                                      <li>Danh mục: {productData?.category}</li>
                                      <li>{productData?.type}: {productData?.variant}</li>
                                      <li>Số lượng: {productData?.quantity}</li>
                                   </ul>
                                </div>
                                </>
}
          </div>
   </div>
  )
}

export default Product