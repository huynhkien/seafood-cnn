import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, A11y } from 'swiper/modules';
import {Product} from '../../Index';
import { apiGetProducts } from '../../../apis';

const tabs = [
  { id: 1, name: 'Nổi bật' },
  { id: 2, name: 'Sản phẩm mới' },
  { id: 3, name: 'Giá rẻ' }
];

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [cheapProducts, setCheapProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [spaceBetween, setSpaceBetween] = useState(20);

  const fetchProductsSold = async () => {
    const response = await apiGetProducts({ sort: '-sold', limit: 6 });
    if (response.success) setBestProducts(response.setData);
  };

  const fetchProductsNew = async () => {
    const response = await apiGetProducts({ sort: '-createdAt', limit: 6 });
    if (response.success) setNewProducts(response.setData);
  };

  const fetchProductsPrice = async () => {
    const response = await apiGetProducts({ sort: 'price', limit: 6 });
    if (response.success) setCheapProducts(response.setData);
  };

  useEffect(() => {
    fetchProductsSold();
    fetchProductsNew();
    fetchProductsPrice();
  }, []);

  useEffect(() => {
    if (activeTab === 1) setProducts(bestProducts);
    if (activeTab === 2) setProducts(newProducts);
    if (activeTab === 3) setProducts(cheapProducts);
  }, [activeTab, bestProducts, newProducts, cheapProducts]);
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
    <section className="weekly-product-area grey-bg pt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="tpsection mb-20">
              <h4 className="tpsection__sub-title">~ Sản phẩm ~</h4>
              <h4 className="tpsection__title">Ưu đãi hàng tuần</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="tpnavtab__area pb-40">
               <nav>
              <div className="nav nav-tabs">
                {tabs.map((el) => (
                  <span
                    key={el.id}
                    className={`nav-link ${activeTab === el.id ? 'text-dark' : ''}`}
                    onClick={() => setActiveTab(el.id)}
                  >
                    {el.name}
                  </span>
                ))}
              </div>
              </nav>
                <Swiper
                  modules={[Autoplay, A11y]}
                  spaceBetween={spaceBetween}
                  slidesPerView={slidesPerView}
                  loop={true}
                  autoplay={{ delay: 5000 }}
                  className='swiper-product'
                >
                  {products?.map((el) => (
                    <SwiperSlide className=''>
                      <Product
                        key={el?._id}
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
