import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiGetProduct } from "../../../apis";
import { TabPane, TabInfo, Breadcrumb, Quantity } from "../../../components/Index";
import { formatMoney, renderStartFromNumber } from "../../../utils/helper";
import { PiPackageFill } from "react-icons/pi";
import { IoShieldOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import withBaseComponents from '../../../hocs/withBaseComponents';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {ProductRelative} from '../../../ui/Index';
import {addToCart} from '../../../store/user/userSlice';


const Page = ({ navigate, dispatch }) => {
    const { id } = useParams();
    const { isLogin, current, mes } = useSelector(state => state.user);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        price: '',
        thumb: '',
    });

    useEffect(() => {
        if (variants) {
            const selectedVariant = product?.variants?.find(el => el.sku === variants);
            setCurrentProduct({
                title: selectedVariant?.variant,
                price: selectedVariant?.price,
                thumb: selectedVariant?.thumb?.url,
                quantity: selectedVariant?.quantity,
                sku: selectedVariant?.sku
            });
        } else {
            setCurrentProduct({
                title: product?.variant,
                price: product?.price,
                thumb: product?.thumb?.url,
                quantity: product?.quantity,
                sku: product?.sku
            });
        }
    }, [variants, product]);

    const fetchProduct = async () => {
        const response = await apiGetProduct(id);
        if (response.success) setProduct(response.data);
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return;
        } else {
            setQuantity(number);
        }
    }, []);

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') setQuantity(prev => +prev - 1);
        if (flag === 'plus') setQuantity(prev => +prev + 1);
    }, [quantity]);

    const handleAddCart = () => {
      if(currentProduct?.quantity === 0){
        Swal.fire({
            title: 'Số lượng sản phẩm đã không còn hàng trong kho',
            text: 'Xin vui lòng chọn lại số lượng sản phẩm!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
      }
      if(quantity > setCurrentProduct?.quantity || quantity > product?.quantity){
        Swal.fire({
            title: 'Số lượng sản phẩm bạn đạt vượt quá số lượng sản phẩm trong kho',
            text: 'Xin vui lòng chọn lại số lượng sản phẩm!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
      }
      if(product?.quantity <= 0){
         Swal.fire({
            title: 'Sản phẩm hết hàng',
            text: 'Xin vui lòng chọn sản phẩm khác!',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
      }else{
         dispatch(addToCart({
         pid: id,
         variant: currentProduct.title,
         quantity,
         category: product?.category,
         thumb: currentProduct.thumb,
         price: product?.disCount?.value 
         ? (
             product.disCount.discountType === 'percentage' 
             ? ((currentProduct?.price - (currentProduct?.price * product?.disCount?.value / 100)))
             : ((currentProduct?.price - product?.disCount?.value))
         ) 
         : (currentProduct?.price),
         name: product.name
         }));
      
         toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
    };
   }

    return (
        <section>
            <Breadcrumb
                category={product?.name}
            />
            <div className="shopdetails-area grey-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-md-12">
                            <div className="tpdetails__area">
                                <div className="tpdetails__product bg-light shadow-sm">
                                    <div className="tpdetails__title-box">
                                        <h3 className="tpdetails__title">{product?.name}</h3>
                                        <ul className="tpdetails__brand">
                                            <li> Thương hiệu: <a href="/">HAISANHOANGGIA</a> </li>
                                            <li>
                                                {renderStartFromNumber(product?.totalRatings)?.map((el, index) => (
                                                    <span key={index}>{el}</span>
                                                ))}
                                            </li>
                                            <li>
                                                SKU: <span>{currentProduct?.sku}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tpdetails__box">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="tpproduct-details__nab">
                                                    <TabPane images={product?.images.map(img => img.url)} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="product__details">
                                                    <div className="product__details-price-box">
                                                        <h5 className="product__details-price">
                                                        {
                                                        product?.disCount?.value 
                                                            ? (
                                                                product.disCount.discountType === 'percentage' 
                                                                ? ((currentProduct?.price - (currentProduct?.price * product?.disCount?.value / 100))?.toLocaleString())
                                                                : ((currentProduct?.price - product?.disCount?.value)?.toLocaleString())
                                                            ) 
                                                            : ((currentProduct?.price)?.toLocaleString())
                                                        }  VNĐ</h5>
                                                        <ul className="product__details-info-list">
                                                            <li>Giao hàng tận nơi</li>
                                                            <li>Miễn phí ship trong 10Km</li>
                                                            <li>Đảm bảo khách hàng nhận được sản phẩm chất lượng</li>
                                                        </ul>
                                                    </div>
                                                    <div className="product__color-switch mb-25">
                                                        <h4 className="product__color-title">Chọn: </h4>
                                                        <div className="tpshop__widget-color-box d-flex align-items-center">
                                                            <div
                                                                onClick={() => setVariants(null)}
                                                                style={{ cursor: 'pointer' }}
                                                                className={`bg-white rounded shadow-sm p-2 ${!variants && 'border border-success'}`}
                                                            >
                                                                <img src={product?.thumb?.url} width={40} alt="thumb"/>
                                                                <span>{product?.variant}</span>
                                                            </div>
                                                            {product?.variants?.map((el, index) => (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => setVariants(el.sku)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    className={`bg-white rounded shadow-sm p-2 mx-1 ${variants === el.sku && 'border border-success'}`}
                                                                >
                                                                    <img src={el?.thumb?.url} width={40} alt="img"/>
                                                                    <span>{el?.variant}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="product__details-cart">
                                                        <div className="product__details-quantity d-flex align-items-center mb-15">
                                                            <b>Qty:</b>
                                                            <div className="product__details-count mr-10">
                                                                <Quantity
                                                                    quantity={quantity}
                                                                    handleQuantity={handleQuantity}
                                                                    handleChangeQuantity={handleChangeQuantity}
                                                                />
                                                            </div>
                                                            
                                                            <div className="product__details-btn">
                                                                <button onClick={handleAddCart}>{currentProduct?.quantity > 0 ? 'Thêm sản phẩm' : 'Hết hàng'}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="product__details-stock mb-25">
                                                        <ul>
                                                            <li>Số lượng: <i>{currentProduct?.quantity === 0 ? 'Hết hàng' : currentProduct?.quantity}</i></li>
                                                            <li>Danh mục: <span>{product?.category}</span></li>
                                                            <li>Tình trạng: <span>{product?.status}</span></li>
                                                            <li>Quy cách: <span>{product?.specifications}</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tpdescription__box shadow-sm">
                                    <TabInfo
                                        description={product?.description}
                                        total={product?.totalRatings}
                                        ratings={product?.ratings}
                                        nameProduct={product?.name}
                                        pid={product?._id}
                                        setProduct={fetchProduct}
                                    />
                                </div>
                                <div className="my-4 shadow">
                                    <ProductRelative />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-12">
                            <div className="tpsidebar pb-30">
                                <div className="tpsidebar__warning mb-30">
                                    <ul>
                                        <li>
                                            <div className="tpsidebar__warning-item">
                                                <div className="tpsidebar__warning-icon">
                                                    <i><PiPackageFill /></i>
                                                </div>
                                                <div className="tpsidebar__warning-content">
                                                    <h4>Giao hàng nhanh chóng</h4>
                                                    <p>Đảm bảo giao hàng trong 24h.</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpsidebar__warning-item">
                                                <div className="tpsidebar__warning-icon">
                                                    <i><IoShieldOutline /></i>
                                                </div>
                                                <div className="tpsidebar__warning-content">
                                                    <h4>Đảm bảo hàng chất lượng</h4>
                                                    <p>Chúng tôi đảm bảo hàng hóa chất lượng.</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpsidebar__warning-item">
                                                <div className="tpsidebar__warning-icon">
                                                    <i><FaShoppingCart /></i>
                                                </div>
                                                <div className="tpsidebar__warning-content">
                                                    <h4>Mua sắm dễ dàng</h4>
                                                    <p>Mua sắm trực tuyến dễ dàng và nhanh chóng.</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default withBaseComponents(Page);
