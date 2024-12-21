import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, A11y } from 'swiper/modules';
import Product from './Product';
import { apiGetProducts } from '../../../apis';

const Product_Relative = () => {
  const [products, setProducts] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [spaceBetween, setSpaceBetween] = useState(20);
  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: '-sold', limit: 6 });
    if (response.success) setProducts(response.data);
  };

  
  useEffect(() => {
    fetchProducts();
    
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
        setSlidesPerView(3);
        setSpaceBetween(10);
      } else {
        setSlidesPerView(3);
        setSpaceBetween(10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='product-relative tpsection shadow'>
        <div className='product-header tpsection__title d-flex'>
            <h4>Sản phẩm khác</h4>
        </div>
        <div className='product-body'>
                <Swiper
                  modules={[Autoplay, A11y]}
                  spaceBetween={spaceBetween}
                  slidesPerView={slidesPerView}
                  loop={true}
                  autoplay={{ delay: 5000 }}
                  
                >
                  {products?.map((el) => (
                    <SwiperSlide  >
                      <Product
                        key={el._id}
                        productData={{
                          thumb: el?.thumb?.url,
                          image: el?.images[0]?.url,
                          name: el?.name,
                          priceCoupon: el?.price,
                          price: el?.disCount?.value ? 
                          (el?.disCount?.discountType === 'percentage' ? 
                              (el?.price - (el?.price * el?.disCount?.value / 100)) : 
                              (el?.price - el?.disCount?.value)) 
                          : el?.price,
                          totalRatings: el?.totalRatings,
                          id: el?._id,
                          category: el?.category,
                          variant: el?.variant,
                          quantity: el?.quantity,
                          disCount: el?.disCount,
                          type: el?.type
                        }}                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                </div>
                </div>
  );
};

export default Product_Relative;
