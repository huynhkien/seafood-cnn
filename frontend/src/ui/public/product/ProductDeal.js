import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, A11y } from 'swiper/modules';
import {Product} from '../../Index';
import { apiGetProducts } from '../../../apis';

const ProductDeal = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [spaceBetween, setSpaceBetween] = useState(20);
  const fetchProductsDeal = async () => {
    const response = await apiGetProducts({ sort: '-sold', limit: 6 });
    if (response.success) setDealProducts(response.setData);
  };
  useEffect(() => {
    fetchProductsDeal();

  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 767) {
        setSlidesPerView(2);
        setSpaceBetween(10);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(3);
        setSpaceBetween(10);
      } else if (window.innerWidth < 1350) {
        setSlidesPerView(4);
        setSpaceBetween(10);
      } else {
        setSlidesPerView(5);
        setSpaceBetween(20);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className='product-deal tpsection'>
        <div className='product-header tpsection__title d-flex'>
            <h4>Bao rẻ, tươi ngon</h4>
        </div>
        <div className='product-body'>
            <Swiper
                    modules={[Autoplay, A11y]}
                    spaceBetween={spaceBetween}
                    slidesPerView={slidesPerView}
                    loop={true}
                    autoplay={{ delay: 5000 }}
                    className='swiper-product'
                    breakpoints={{
                      0: {
                        slidesPerView: 2, 
                      },
                      768: {
                        slidesPerView: 5,  
                      },
                    }}
                    >
                    {dealProducts?.map((el) => (
                        <SwiperSlide key={el._id} className=''>
                        <Product
                            key={el._id}
                            productData={{
                            thumb: el?.thumb?.url,
                            image: el?.images[0]?.url,
                            name: el?.name,
                            priceCoupon: el?.price,
                            price: el?.disCount.value ? 
                            (el?.disCount?.discountType === 'percentage' ? 
                                (el?.price - (el?.price * el?.disCount?.value / 100)) : 
                                (el?.price - el?.disCount?.value)) 
                            : el?.price,
                            totalRatings: el?.totalRatings,
                            id: el?._id,
                            category: el?.category,
                            variant: el?.variant,
                            quantity: el?.quantity,
                            type: el?.type,
                            disCount: el?.disCount
                            }}
                        />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    </div>
  )
}

export default ProductDeal