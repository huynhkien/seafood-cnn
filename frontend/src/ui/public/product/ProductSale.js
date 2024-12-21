import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, A11y } from 'swiper/modules';
import { Product } from '../../Index';
import { apiGetAllVoucherProduct } from '../../../apis';

const ProductSale = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [spaceBetween, setSpaceBetween] = useState(20);

  const fetchProductsDeal = async () => {
    const response = await apiGetAllVoucherProduct();
    if (response.success) {
      setDealProducts(response);
      const now = new Date().getTime();
      const endDate = new Date(response.endDate).getTime();
      const startDate = new Date(response.startDate).getTime();

      if (now < endDate) {
        setTimeLeft({
          total: endDate - now,
          days: Math.floor((endDate - now) / (1000 * 60 * 60 * 24)),
          hours: Math.floor(((endDate - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor(((endDate - now) % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor(((endDate - now) % (1000 * 60)) / 1000),
        });
      }
    }
  };

  useEffect(() => {
    fetchProductsDeal();
    
    // Cập nhật countdown mỗi giây
    const interval = setInterval(() => {
      if (dealProducts.endDate) {
        const now = new Date().getTime();
        const endDate = new Date(dealProducts.endDate).getTime();
        if (now < endDate) {
          setTimeLeft({
            total: endDate - now,
            days: Math.floor((endDate - now) / (1000 * 60 * 60 * 24)),
            hours: Math.floor(((endDate - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor(((endDate - now) % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor(((endDate - now) % (1000 * 60)) / 1000),
          });
        } else {
          // Ngừng cập nhật khi hết thời gian
          clearInterval(interval);
        }
      }
    }, 1000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
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
    <div className='product-sale tpsection'>
      <div className="sale-header">
        <div className="sale-title">
          <h4 className='tpsection__title sale-line px-4'>Áp ngay mã voucher!!! </h4>
          <span className="end-time">
            <span>Kết thúc trong</span>
            <div className="countdown">
              {timeLeft.days !== undefined && (
                <>
                  <span className="time-block"><small>{timeLeft.days} ngày</small></span>
                  <span className="time-block"><small>{timeLeft.hours} giờ</small></span>
                  <span className="time-block"><small>{timeLeft.minutes} phút</small></span>
                  <span className="time-block"><small>{timeLeft.seconds} giây</small></span>
                </>
              )}
            </div>
          </span>
        </div>
      </div>
      <div className='sale-body'>
        <Swiper
          modules={[Autoplay, A11y]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={true}
          autoplay={{ delay: 5000 }}
          className='swiper-product'
        >
          {dealProducts?.data?.map((el) => (
            <SwiperSlide key={el._id}>
              <Product
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
  );
};

export default ProductSale;
