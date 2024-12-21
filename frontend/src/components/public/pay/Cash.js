import React from 'react'
import {apiCreateOrder} from '../../../apis';
import Swal from 'sweetalert2';
const Cash = ({payload, setIsSuccess}) => {
  const handleCreateOrder = async() => {
    const response = await apiCreateOrder({...payload})
    if(response.success) {
        setIsSuccess(true)
        setTimeout(() => {
            Swal.fire('Bạn đã đặt hàng thành công', 'Đơn hàng sẽ sớm được vận chuyển', 'success');
        }, 500);
    }else{
        Swal.fire('Đặt hàng thất bại', 'Vui lòng thử lại sau', 'error');
    }
  }
  return (
    <div>
        <button onClick={() => handleCreateOrder()}>
            Thanh toán bằng tiền mặt
        </button>
    </div>
  )
}

export default Cash