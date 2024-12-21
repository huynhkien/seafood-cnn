import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, A11y } from 'swiper/modules';
import {Product} from '../../Index';
import { apiGetProducts } from '../../../apis';
const ProductPage = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [spaceBetween, setSpaceBetween] = useState(20);


  const fetchProductsSold = async () => {
    const response = await apiGetProducts({ status: 'Đông lạnh', limit: 6 });
    if (response.success) setBestProducts(response.data);
  };

  useEffect(() => {
    fetchProductsSold();
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
    <section className="weekly-product-area grey-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="tpsection py-5">
              <h4 className="tpsection__title">Sản Phẩm Đông Lạnh</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="tpnavtab__area pb-40">
                <Swiper
                  modules={[Autoplay, A11y]}
                  spaceBetween={spaceBetween}
                  slidesPerView={slidesPerView}
                  loop={true}
                  autoplay={{ delay: 5000 }}
                  className='swiper-product'
                >
                  {bestProducts?.map((el) => (
                    <SwiperSlide className=''>
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
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
