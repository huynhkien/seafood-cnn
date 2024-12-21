import React from 'react'
import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaSkype } from "react-icons/fa";
import {Icon1, Icon2, Icon3, Icon4, Icon5} from '../../assets/img/Index';
const Footer = () => {
  return (
    <div>
      <div className="feature-area mainfeature__bg py-5">
        <div className="container">
          <div className="mainfeature__border pb-15">
            <div className="row row-cols-lg-5 row-cols-md-3 row-cols-2">
              <div className="col">
                <div className="mainfeature__item text-center mb-30">
                  <div className="mainfeature__icon">
                    <Icon1 />
                  </div>
                  <div className="mainfeature__content">
                    <h4 className="mainfeature__title">Giao hàng nhanh chóng</h4>
                    <p>Toàn quốc</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mainfeature__item text-center mb-30">
                  <div className="mainfeature__icon">
                    <Icon2 />
                  </div>
                  <div className="mainfeature__content">
                    <h4 className="mainfeature__title">Thanh toán an toàn</h4>
                    <p>100% thanh toán an toàn</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mainfeature__item text-center mb-30">
                  <div className="mainfeature__icon">
                    <Icon3 />
                  </div>
                  <div className="mainfeature__content">
                    <h4 className="mainfeature__title">Giảm giá trực tuyến</h4>
                    <p>Thêm nhiều ưu đãi về giá</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mainfeature__item text-center mb-30">
                  <div className="mainfeature__icon">
                    <Icon4 />
                  </div>
                  <div className="mainfeature__content">
                    <h4 className="mainfeature__title">Hỗ trợ nhanh chóng</h4>
                    <p>Hỗ trợ 24/7</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mainfeature__item text-center mb-30">
                  <div className="mainfeature__icon">
                    <Icon5 />
                  </div>
                  <div className="mainfeature__content">
                    <h4 className="mainfeature__title">Chất lượng</h4>
                    <p>Sản phẩm được lựa chọn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="tpfooter__area theme-bg-2">
          <div className="tpfooter__top">
            <div className="container">
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="tpfooter__widget footer-col-1">
                    <h4 className="tpfooter__widget-title">Liên hệ với tôi</h4>
                    <p>
                      Nếu bạn cần câu trả lời, vui lòng <br /> liên hệ:
                      <a href="/"> kien@gmail.com</a>
                    </p>
                    <div className="tpfooter__widget-social">
                      <span className="tpfooter__widget-social-title">Social Media:</span>
                        <a className="mx-2" href="/"><FaFacebook /></a>
                        <a className="mx-2" href="/"><FaTwitter /></a>
                        <a className="mx-2" href="/"><FaYoutube /></a>
                        <a className="mx-2" href="/"><FaPinterest /></a>
                        <a className="mx-2" href="/"><FaSkype /></a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="tpfooter__widget footer-col-2">
                    <h4 className="tpfooter__widget-title">Địa chỉ</h4>
                    <p>56 Nam Chánh, Ngọc Chánh, Đầm Dơi, Cà Mau </p>
                    <div className="tpfooter__widget-time-info">
                      <span>Thứ 2 – Thứ 6: <b>8:10 AM – 6:10 PM</b></span>
                      <span>Thứ 7: <b>10:10 AM – 06:10 PM</b></span>
                      <span>Chủ Nhật: <b>Đóng cửa</b></span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-4 col-sm-5">
                  <div className="tpfooter__widget footer-col-sm-4">
                    <h4 className="tpfooter__widget-title">Danh Mục Hot</h4>
                    <div className="tpfooter__widget-links">
                      <ul>
                        <li><a href="/">Hải sản tươi sống</a></li>
                        <li><a href="/">Hải sản nhập khẩu</a></li>
                        <li><a href="/">Hải sản đông lạnh</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-8 col-sm-7">
                  <div className="tpfooter__widget footer-col-4">
                    <h4 className="tpfooter__widget-title">Giới Thiệu</h4>
                    <div className="tpfooter__widget-newsletter">
                      <p>Hải sản Hoàng Gia chuyên cung cấp các loại hải sản chất lượng nhất trên thị trường. Không chỉ chất lượng mà cửa hàng còn chú trọng về mức giá để phù hợp với khách hàng.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
