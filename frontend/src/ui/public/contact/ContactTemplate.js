import React from 'react'
import {Slider} from '../../Index';

const ContactTemplate = () => {
  return (
   <section>
      <Slider/>
    <div className="map-area tpmap__box mt">
            <div className="container py-4">
               <div className="row py-2">
                  <div className="col-lg-6 col-md-6 order-2 order-md-1 mt-5">
                  <div className="tpmap__wrapper">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15763.125602600572!2d105.18829371285997!3d8.99225212643467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a150f2accc0ec5%3A0x381fdaf62f3ff434!2zVUJORCBodXnhu4duIMSQ4bqnbSBExqFp!5e0!3m2!1svi!2s!4v1719506313878!5m2!1svi!2s"
                        className="w-100 h-100"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 order-1 order-md-2">
                     <div className="tpform__wrapper pt-120 pb-80 mx-4">
                        <h4 className="tpform__title">LIÊN HỆ</h4>
                        <p>Your email address will not be published. Required fields are marked *</p>
                        <div className="tpform__box">
                           <form action="#">
                              <div className="row gx-7">
                                 <div className="col-lg-6">
                                    <div className="tpform__input my-2">
                                       <input type="text" placeholder="Your Name *"/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="tpform__input my-2">
                                       <input type="email" placeholder="Your Email *"/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="tpform__input my-2">
                                       <input type="text" placeholder="Subject *"/>
                                    </div>
                                 </div>
                                 <div className="col-lg-6">
                                    <div className="tpform__input my-2">
                                       <input type="text" placeholder="Phone"/>
                                    </div>
                                 </div>
                                 <div className="col-lg-12">
                                    <div className="tpform__textarea">
                                       <textarea name="message" placeholder="Message"></textarea>
                                       <div className="tpform__textarea-check my-2">
                                          <div className="form-check">
                                             <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault01"/>
                                             <label className="form-check-label" for="flexCheckDefault01">
                                                I am bound by the terms of the <a href="/">Service I accept Privacy Policy.</a>
                                             </label>
                                           </div>                                  
                                       </div>
                                       <button>Send message</button>
                                    </div>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         </section>
  )
}

export default ContactTemplate