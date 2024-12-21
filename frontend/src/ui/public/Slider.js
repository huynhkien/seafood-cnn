import React from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Banner1, Banner2, Banner3, Banner4, Banner5, Banner6, Banner7} from '../../assets/img/Index';
// css
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = () => {
  return (
    <section className='slider-area tpslider-delay secondary-sliderbg'>
   <div className='swiper-container slider-active'>
      <Swiper
          navigation
          pagination={{clickable: true}}
          autoplay={true}
          loop={true}
          modules={[Autoplay, Navigation, Pagination]} 
         className='swiper-wrapper'>
         <SwiperSlide className='swiper-slide'>
            <div className='tpslider pt-90 pb-0 grey-bg'>
               <div className='container'>
                  <div className='row align-items-center'>
                     <div className='col-xxl-5 col-xl-6 col-lg-6 col-md-6 col-sm-7'>
                        <div className='tpslider__content pt-20'>
                           <span className='tpslider__sub-title mb-35'>Hải sản luôn trong tình trạng tươi sống</span>
                           <h2 className='tpslider__title mb-30'>Thưởng thức vị ngọt <br/> của hải sản.</h2>
                           <p>Cung cấp cho khách hàng những bữa ăn <br/> chất lượng nhất</p>
                           <div className='tpslider__btn'>
                              <a className='tp-btn' href={'/contact'}>Liên hệ</a>
                           </div>
                        </div>
                     </div>
                     <div className='col-xxl-7 col-xl-6 col-lg-6 col-md-6 col-sm-5'>
                        <div className='tpslider__thumb p-relative pt-70'>
                           <img className='tpslider__thumb-img' src={Banner1} width={600} height={500} alt='slider-bg'/>
                           <div className='tpslider__shape d-none d-md-block'>
                              <img className='tpslider__shape-one' src={Banner5} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-two' src={Banner6} width={150} height={150} alt='slider-icon'/>
                              <img className='tpslider__shape-three' src={Banner4} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-four' src={Banner7} width={150} height={150} alt='slider-icon' />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </SwiperSlide>
         <SwiperSlide className='swiper-slide'>
            <div className='tpslider pt-90 pb-0 grey-bg'>
               <div className='container'>
                  <div className='row align-items-center'>
                     <div className='col-xxl-5 col-xl-6 col-lg-6 col-md-6 col-sm-7'>
                        <div className='tpslider__content pt-20'>
                        <span className='tpslider__sub-title mb-35'>Hải sản luôn trong tình trạng tươi sống</span>
                           <h2 className='tpslider__title mb-30'>Thưởng thức vị ngọt <br/> của hải sản.</h2>
                           <p>Cung cấp cho khách hàng những bữa ăn <br/> chất lượng nhất</p>
                           <div className='tpslider__btn'>
                              <a className='tp-btn' href={'/contact'}>Liên hệ</a>
                           </div>
                        </div>
                     </div>
                     <div className='col-xxl-7 col-xl-6 col-lg-6 col-md-6 col-sm-5'>
                        <div className='tpslider__thumb p-relative'>
                           <img className='tpslider__thumb-img' src={Banner2} width={600} height={500} alt='slider-bg'/>
                           <div className='tpslider__shape d-none d-md-block'>
                              <img className='tpslider__shape-one' src={Banner5} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-two' src={Banner6} width={150} height={150} alt='slider-icon'/>
                              <img className='tpslider__shape-three' src={Banner4} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-four' src={Banner7} width={150} height={150} alt='slider-icon' />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </SwiperSlide>
         <SwiperSlide className='swiper-slide'>
            <div className='tpslider pt-90 pb-0 grey-bg'>
               <div className='container'>
                  <div className='row align-items-center'>
                     <div className='col-xxl-5 col-xl-6 col-lg-6 col-md-6 col-sm-7'>
                        <div className='tpslider__content pt-20'>
                        <span className='tpslider__sub-title mb-35'>Hải sản luôn trong tình trạng tươi sống</span>
                           <h2 className='tpslider__title mb-30'>Thưởng thức vị ngọt <br/> của hải sản.</h2>
                           <p>Cung cấp cho khách hàng những bữa ăn <br/> chất lượng nhất</p>
                           <div className='tpslider__btn'>
                              <a className='tp-btn' href={'/contact'}>Liên hệ</a>
                           </div>
                        </div>
                     </div>
                     <div className='col-xxl-7 col-xl-6 col-lg-6 col-md-6 col-sm-5'>
                        <div className='tpslider__thumb p-relative pt-70'>
                           <img className='tpslider__thumb-img' src={Banner3} width={600} height={500} alt='slider-bg'/>
                           <div className='tpslider__shape d-none d-md-block'>
                              <img className='tpslider__shape-one' src={Banner5} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-two' src={Banner6} width={150} height={150} alt='slider-icon'/>
                              <img className='tpslider__shape-three' src={Banner4} width={150} height={150} alt='slider-icon' />
                              <img className='tpslider__shape-four' src={Banner7} width={150} height={150} alt='slider-icon' />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </SwiperSlide>
      </Swiper>
      <div className='slider-pagination'></div>
   </div>
</section>
  )
}

export default Slider