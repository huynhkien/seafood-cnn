import React, { useState } from 'react';
import { FaStore } from 'react-icons/fa';
import moment from 'moment';
const VoucherItem = ({ voucherData, handleChange, isSelected, id }) => {
  const [showProducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  return (
    <div className="voucher-card round">
      <div className="voucher-logo line-voucher">
        <span><FaStore />
        </span>
        <span>Sea Food</span>
      </div>
      <div className="voucher-content">
        <div className="voucher-discount">Giảm {voucherData?.discountType === 'percentage' ? `${voucherData?.discountValue}%` : `${voucherData?.discountValue?.toLocaleString()} VNĐ`}
        </div>
        <div className="voucher-minimum">ĐH tối thiểu: {voucherData?.minPurchaseAmount?.toLocaleString()} VNĐ</div>
        <div className="voucher-description">{voucherData?.code}</div>
        <div className="voucher-apply">
          {voucherData?.applyType === 'products'
            ? <>
                <span onClick={() => setShowProducts(prev => !prev)}>Áp dụng với một số sản phẩm</span>
                {showProducts &&
                  <div className='voucher-product-detail shadow'>
                  {voucherData?.applicableProducts?.map(el => (
                    <span key={el.id}>{el.name}, </span>
                  ))}
                  </div>
                }
              </>
            : voucherData?.applyType === 'categories'
            ? <>
            <span onClick={() => setShowCategories(prev => !prev)}>Áp dụng với một số danh mục</span>
            {showCategories &&
                  <div className='voucher-product-detail shadow'>
                  {voucherData?.applicableCategories?.map(el => (
                    <span key={el.id}>{el.name}, </span>
                  ))}
                  </div>
                }
                </>
            : voucherData?.applyType === 'users'
            ? <>
              <span onClick={() => setShowUsers(prev => !prev)}>Áp dụng với khách hàng hạng</span>
              {showUsers &&
                  <div className='voucher-product-detail shadow'>
                  {voucherData?.applicableUsers?.map(el => (
                    <span key={el.id}>{el.name}, </span>
                  ))}
                  </div>
                }
              </>
            : <span>Áp dụng với tất cả sản phẩm</span>}
        </div>
        <div className="voucher-expiry">HSD: {moment(voucherData?.endDate).format('DD/MM/YYYY HH:mm')}</div>
      </div>
      <div className="voucher-action">
        <div className='voucher-action-check' >
          <input 
            onChange={handleChange}   
            value={voucherData?.id} 
            className='voucher-action-check__input' 
            type='checkbox'
            checked={isSelected}  
            />
        </div>
        <div>
          <a href={'cart'} className="copy-button">Giỏ hàng</a>
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;