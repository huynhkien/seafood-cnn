import {IconAbout1, IconAbout2, IconAbout3, Logo} from '../../assets/img/Index';
const Featured = () => {
  return (
    <section class="about-area">
            <div class="container">
               <div class="tpabout__border ">
                  <div class="row">
                     <div class="col-md-12">
                        <div class="tpabout__title-img text-center ">
                           <img class="" src={Logo} width={500} height={200} alt=""/>
                           <p>Chúng tôi cung cấp nền tảng bán hải sản trực tuyến. <br/> Khách hàng có thể lựa chọn những sản phẩm <br/>tốt nhất tại cửa hàng.</p>
                        </div>
                     </div>
                  </div>
                  <div class="row py-4">
                     <div class="col-lg-4 col-md-4 col-sm-6">
                        <div class="tpabout__item text-center ">
                           <div class="tpabout__icon">
                              <img  src={IconAbout1} width={120} height={100} alt=""/>
                           </div>
                           <div class="tpabout__content">
                              <h4 class="tpabout__title">Nhiều lựa chọn</h4>
                              <p>Khách hàng có nhiều sự lựa chọn. <br/> Liên hệ để mua hàng.</p>
                           </div>
                        </div>
                     </div>
                     <div class="col-lg-4 col-md-4 col-sm-6">
                        <div class="tpabout__item text-center ">
                           <div class="tpabout__icon">
                            <img src={IconAbout2} width={120} height={100} alt=""/>
                           </div>
                           <div class="tpabout__content">
                              <h4 class="tpabout__title">Nhiều sản phẩm </h4>
                              <p>Hơn 100 lại hải sản khác nhau <br/> luôn được tươi mới.
                              </p>
                           </div>
                        </div>
                     </div>
                     <div class="col-lg-4 col-md-4 col-sm-6">
                        <div class="tpabout__item text-center ">
                           <div class="tpabout__icon">
                            <img src={IconAbout3} width={120} height={100} alt=""/>
                           </div>
                           <div class="tpabout__content">
                              <h4 class="tpabout__title">Giao hàng nhanh chóng </h4>
                              <p>Giao hàng toàn quốc  <br/> và miễn phí trong vòng 20 KM.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
  )
}

export default Featured