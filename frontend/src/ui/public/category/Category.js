import { useEffect, useState, useCallback } from "react";
import { Breadcrumb, Pagination } from "../../../components/Index";
import { apiGetProducts } from "../../../apis";
import {Product} from "../../Index";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { InputSearch, InputSelect } from "../../../components/Index";
import { sorts } from "../../../utils/contant";
import { Container, Row, Col, Button } from 'react-bootstrap';

const Page = () => {
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  const [sort, setSort] = useState('');
  const navigate = useNavigate();

  const fetchProductsByCategory = async(queries) => {
    const response = await apiGetProducts({category, ...queries});
    if(response.success) setProducts(response);
  } 
  const {category} = useParams();
  
  useEffect(() => {
    
    const queries = Object.fromEntries([...params]);
    let priceQuery = {}
    if(queries.from && queries.to) {
      priceQuery = {
        $and: [
          {price: {gte: queries.from}},
          {price: {lte: queries.to}}
      ]}  
      delete queries.price;
 
    }
    if(queries.from) queries.price = {gte: queries.from}
    if(queries.to) queries.price = {lte: queries.to}
    delete queries.to;
    delete queries.from;
    
    const q = {...priceQuery, ...queries}
    console.log(q)

    fetchProductsByCategory(q);
    
  },[params, sort])
  const changeActiveFilter = useCallback((name) => {
    if(activeClick=== name) setActiveClick(null);
    else setActiveClick(name);
  }, [activeClick]);
  const changeValue = useCallback((value) => {
    setSort(value);
  },[sort])
  useEffect(() => {
    if(sort){
      navigate({
        pathname: `/category/${category}`,
        search: createSearchParams({sort}).toString()
      })
    }
  },[sort])

  const isNoProducts = !products?.setData?.length;
 
  return (
    <div>
      {isNoProducts ? 
        (
          <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <Row className="justify-content-center w-100">
            <Col xs={12} md={8} lg={6} className="text-center py-5">
              <div className="mb-4">
                <svg 
                  width="120" 
                  height="120" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#6c757d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  <line x1="3" y1="3" x2="21" y2="21"></line>
                </svg>
              </div>

              <h2 className="display-6 fw-bold text-dark mb-3">
                Không tìm thấy sản phẩm
              </h2>

              <div className="mb-4">
                <span className="display-3" role="img" aria-label="sad face">
                  😕
                </span>
              </div>

              <div className="text-secondary mb-4">
                <p className="lead mb-2">
                  Rất tiếc, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm.
                </p>
                <p className="mb-4">
                  Sản phẩm có thể đã được gỡ bỏ hoặc không còn tồn tại trong hệ thống.
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-4 py-2"
                  onClick={() => window.location.href = '/'}
                >
                  Về Trang Chủ
                </Button>

                <Button
                  variant="outline-primary"
                  size="lg"
                  className="px-4 py-2"
                  onClick={() => window.location.href = '/'}
                >
                  Xem Sản Phẩm Khác
                </Button>
              </div>

              <div className="mt-4 pt-4 border-top">
                <p className="text-muted mb-2">Bạn cần giúp đỡ?</p>
                <Button
                  variant="link"
                  className="text-decoration-none"
                >
                  Liên hệ hỗ trợ qua tin nhắn
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        )
        :
        (
          <>
            <Breadcrumb category={category}/>
            <section className="shop-area-start grey-bg">
              <div className="container">
                <div className="row">
                  <div className="col-xl-2 col-lg-12 col-md-12">
                    <div className="tpshop__leftbar shadow">
                      <div className="tpshop__widget pb-4">
                        <h5 className="tpshop__widget-title mb-2">Sắp xếp</h5>
                        <InputSelect
                          value={sort} 
                          options ={sorts} changeValue={changeValue}/>
                      </div>
                      <div class="tpshop__widget">
                          <h5 class="tpshop__widget-title mb-2">Lọc theo giá</h5>
                          <InputSearch
                          name='Giá'
                          changeActiveFilter={changeActiveFilter}
                          activeClick={activeClick}/>
                      </div>
                      
                    </div>
                  </div>
                  <div className="col-xl-10 col-lg-12 col-md-12">
                  <div class="tpshop__top ml-60">
                              <div class="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols tpproduct__shop-item">
                                {products?.setData?.map((el) => (
                                    <div className="col product-col mb-4">
                                      <Product
                                        productData={{
                                          thumb: el?.thumb?.url,
                                          image: el?.images[0]?.url,
                                          name: el?.name,
                                          priceCoupon: el?.price,
                                          price: el?.coupon ? el?.price * el?.coupon/100 : el?.price,
                                          totalRatings: el?.totalRatings,
                                          id: el?._id,
                                          category: el?.category,
                                          variant: el?.variant,
                                          quantity: el?.quantity,
                                          coupon: el?.coupon
                                        }}
                                      />
                                </div>
                              ))}
                        </div>
                        <Pagination
              totalCount={products?.counts}
            />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
      }
    </div>
  );
};

export default Page;
