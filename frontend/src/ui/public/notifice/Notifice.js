import React from 'react';
import { MdCancel } from 'react-icons/md';
import moment from 'moment';
import { apiDeleteNotification } from '../../../apis';
import { useSelector } from 'react-redux';


function Notification({fetchNotifications, notification}) {
  const handleDelete = async (id) => {
      const response = await apiDeleteNotification(id);
      if (response.success) {
        fetchNotifications();
      }
  };
  console.log(notification)
  const {current} = useSelector(state => state.user);
  const filteredNotifications = notification?.filter(el => 
    el.voucher || 
    el.product || 
    (el.status_order && el.status_order?.uid === current?._id)
  );

  return (
    <div className="notification">
      {filteredNotifications && filteredNotifications.length > 0 ? (
        filteredNotifications.map((el, index) => (
          <div key={index} className="notification--item">
            <p className="message">
              {el.voucher && (
                <>
                  Mã giảm giá <span className="text-primary font-weight">{el.voucher.code}</span> mới được tạo. Áp dụng từ ngày{" "}
                  {moment(el.voucher.startDate).format("DD/MM")} - {moment(el.voucher.endDate).format("DD/MM")}.{" "}
                </>
              )}
              {el.status_order && el.status_order?.uid === current?._id && (
                <>
                  {el.status_order?.order ? `Mã đơn hàng ${el?.status_order?.order}` : `Đơn hàng đang xử lý, thời gian giao dự kiến mất khoảng 2 - 3 ngày`}
                  {(() => {
                    switch(el.status_order.status) {
                      case 'Delivering':
                        return ' - Đang được giao, vui lòng nghe máy khi shipper gọi';
                      case 'Processing':
                        return ' - Đang xử lý, thời gian giao dự kiến mất khoảng 2 - 3 ngày ';
                      case 'Cancelled':
                        return ' - Đã hủy, bạn có thể xem thêm các sản phẩm khác';
                      case 'Succeed':
                        return ' - Giao hàng thành công, cảm ơn quý khách';
                      case 'Confirm':
                        return ' - Đã xác nhận, vui lòng xác nhận để nhận hàng';
                      default:
                        return '';
                    }
                  })()}
                </>
              )}
              {el.product && (
                <>
                  <a href={`http://localhost:3000/detail/${el.product._id}`} className="text-primary font-weight">{el.product.name}</a> vừa được thêm. Quý khách hàng có thể tham khảo.
                </>
              )}
            </p>
            <span onClick={() => handleDelete(el?._id)} className="icon"><MdCancel /></span>
          </div>
          ))
      ) : (
        <div className="tpsection">
          <p>Không có thông báo nào hết</p>
        </div>
      )}

    </div>
  );
}

export default Notification;
