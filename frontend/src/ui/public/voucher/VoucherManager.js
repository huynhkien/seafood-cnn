import React, { useEffect, useState } from 'react'
import { Breadcrumb } from '../../../components/Index'
import { apiGetVouchers } from '../../../apis/voucher';
import VoucherItem from './VoucherItem';

const VoucherManager = () => {
  const [voucher, setVoucher] = useState(null);
  const fetchVouchers = async () => {
    const response = await apiGetVouchers();
    if(response.success) setVoucher(response?.data);
  }
  useEffect(() => {
    fetchVouchers();
  })
  return (
    <div>
            <div className="header">
                <Breadcrumb category='Mã giảm giá'/>
            </div>
            <div className="user d-flex flex-wrap justify-content-between">
                {
                    voucher && voucher.map((item, index) => (
                        <div className='' key={item._id}>
                            <VoucherItem
                                voucherData={{
                                    id: item?._id,
                                    code: item?.code,
                                    description: item?.description,
                                    discountType: item?.discountType,
                                    discountValue: item?.discountValue,
                                    minPurchaseAmount: item?.minPurchaseAmount,
                                    maxDiscount: item?.maxDiscount,
                                    startDate: item?.startDate,
                                    endDate: item?.endDate,
                                    usageLimit: item?.usageLimit,
                                    usedCount: item?.usedCount,
                                    userUsageLimit: item?.userUsageLimit,
                                    applyType: item?.applyType,
                                    applicableProducts: item?.applicableProducts,
                                    applicableCategories: item?.applicableCategories,
                                    applicableUsers: item?.applicableUsers
                                }}
                            />
                        </div>
                    ))}
            </div>
        </div>
  )
}

export default VoucherManager