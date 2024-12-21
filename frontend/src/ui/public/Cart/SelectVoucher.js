import React, { useEffect, useState } from 'react'
import { apiGetVouchers } from '../../../apis/voucher';
import { useForm } from 'react-hook-form';

const SelectVoucher = () => {
  const [voucher, setVoucher] = useState(null);
  const [selectVoucher, setSelectVoucher] = useState(null);

  const fetchVouchers = async () => {
    const response = await apiGetVouchers();
    if (response.success) setVoucher(response?.data);
  }

  useEffect(() => {
    fetchVouchers();
  }, []); 

  const handleChangeVoucher = (e) => {
    const selectedVoucher = e.target.value; 
    setSelectVoucher(selectedVoucher); 
    console.log("Selected voucher:", selectedVoucher);
  }

  return (
    <div>
      <div>
        <select onChange={handleChangeVoucher}>
          <option value="">Chọn mã giảm giá</option> 
          {voucher && voucher.map((el, index) => (
            <option key={index} value={el?.code}>
              {el?.code}
            </option>
          ))}
        </select>
      </div>
      <div className='coupon-container pt-3'>
        <div className='coupon2 my-2'>
          <span
            className='tp-btn tp-color-btn banner-animation'
          >
            Áp mã giảm giá
          </span>
        </div>
      </div>
    </div>
  )
}

export default SelectVoucher;
