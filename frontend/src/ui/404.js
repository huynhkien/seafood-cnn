import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center py-5">
          <div className="mb-4">
            <svg
              viewBox="0 0 200 200"
              width="200"
              height="200"
              className="mx-auto"
            >
              <circle cx="100" cy="100" r="90" fill="#f8f9fa" stroke="#0d6efd" strokeWidth="4"/>
              <text
                x="100"
                y="120"
                textAnchor="middle"
                fontSize="120"
                fill="#0d6efd"
                fontWeight="bold"
              >
                ?
              </text>
            </svg>
          </div>

          <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
          
          <div className="display-3 mb-4">😢</div>
          
          <h2 className="display-4 fw-bold text-dark mb-3">
            Rất tiếc! Trang này không tồn tại
          </h2>
          
          <p className="lead text-secondary mb-4">
            Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển hoặc không tồn tại.
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
          
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="primary" 
              size="lg"
              className="px-4 py-2"
              onClick={() => window.location.href = '/'}
            >
              Quay về Trang chủ
            </Button>
            
            <Button 
              variant="outline-primary" 
              size="lg"
              className="px-4 py-2"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
          
          <div 
            className="mx-auto bg-primary my-4"
            style={{
              width: '60px',
              height: '4px',
              borderRadius: '2px'
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;