import React from 'react'
import {Slider} from '../../Index'
import {Background1, Logo, Logo2, Logo3, Logo4, Logo5} from '../../../assets/img/Index'
import { FaCheck } from "react-icons/fa";

const page = () => {
  return (
    <div>
        <Slider/>
         <section className="about-area pt-100 pb-60">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-lg-6">
                     <div className="tpabout__inner-thumb-2 p-relative mb-30">
                     <img class="" src={Background1} width={600} height={450} alt='' />
                        <div className="tpabout__inner-thumb-shape d-none d-md-block">
                           <div className="tpabout__inner-thumb-shape-two pt-5">
                           <img class="" src={Logo} width={300} height={150} alt='' />
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="tpabout__inner-2">
                        <div className="tpabout__inner-tag mb-10">
                           <span className="active">About us</span>
                           <span>Welcome Hải Sản Hoàng Gia</span>
                        </div>
                        <h3 className="tpabout__inner-title-2 mb-25">Quá trình phát triển của <br/> Hải Sản Hoàng Gia</h3>
                        <p>Cửa hàng luôn mon muốn cung cấp tới khách hàng những sản phẩm chất lượng nhất. <br/>
                        Với mong muốn này, trong suốt quá trình phát triển Sea Food luôn đảm bảo sự hài lòng  <br/> của khách hàng là trên hết.</p>
                        <div className="tpabout__inner-list">
                           <ul>
                              <li><i><FaCheck/></i> Hải sản được tuyển chọn kỹ càng.</li>
                              <li><i><FaCheck/></i>Đảm bảo tươi sống giao đến khách hàng.</li>
                              <li><i><FaCheck/></i> Giá thành rẻ nhất trên thị trường.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <section className="choose-area tpchoose__bg pt-5 grey-bg">
            <div className="container">
               <div className="row">
                  <div className="col-lg-12 text-center">
                     <div className="tpsection mb-35 pt-75">
                        <h4 className="tpsection__sub-title">~ Tại sao chọn chúng tôi? ~</h4>
                        <h4 className="tpsection__title">Điều gì khiến chúng tôi khác biệt?</h4>
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-6">
                     <div className="tpchoose__item text-center mb-30">
                        <div className="tpchoose__icon mb-20">
                        <img class='' src={Logo2} width={150} height={150} alt='' />
                        </div>
                        <div className="tpchoose__content">
                           <h4 className="tpchoose__title">100% đánh bắt tự nhiên</h4>
                           <p>Hải sản được đánh bắt trực tiếp tự các vùng biển hoặc được nuôi trồng.</p>
                          
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                     <div className="tpchoose__item text-center mb-30">
                        <div className="tpchoose__icon mb-20">
                        <img class="" src={Logo3} width={150} height={150} alt=''/>
                        </div>
                        <div className="tpchoose__content">
                           <h4 className="tpchoose__title">Chất lượng cao cấp</h4>
                           <p>Đảm bảo cung cấp tới khách hàng những sản phẩm chất lượng nhất.</p>
                          
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                     <div className="tpchoose__item text-center mb-30">
                        <div className="tpchoose__icon mb-20">
                        <img class="" src={Logo4} width={150} height={150} alt='' />
                        </div>
                        <div className="tpchoose__content">
                           <h4 className="tpchoose__title">Giá rẻ</h4>
                           <p>Hải sản tại cửa hàng luôn rẻ hơn so với các khu vực khác.</p>
                          
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                     <div className="tpchoose__item text-center mb-30">
                        <div className="tpchoose__icon mb-20">
                        <img class="" src={Logo5} width={150} height={150} alt='' />
                        </div>
                        <div className="tpchoose__content">
                           <h4 className="tpchoose__title">Giao hàng tân nơi</h4>
                           <p>Đảm bảo khách hàng nhận được hàng trong thời gian nhanh nhất.</p>
                          
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
    </div>
  )
}

export default page