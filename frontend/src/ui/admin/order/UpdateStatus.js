import { useState } from 'react';
import { apiUpdateStatus } from '../../../apis';
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import { Map } from '../../../components/Index';
import { MapTemplate } from '../../Index';

const UpdateStatus = ({ updateStatus, setUpdateStatus, fetchAllOrder }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    return (
        <div className="update-status-container">
            <span onClick={() => setUpdateStatus(null)} className="close-button">
                <MdCancel size={24} />
            </span>
            <div>
                <h2 className="text-xl text-center font-semibold mb-4">Xác nhận trạng thái</h2>
                <select
                    className="status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">-- Chọn Trạng thái --</option>
                    <option value="Cancelled">Hủy đơn</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Delivering">Đang giao hàng</option>
                    <option value="Confirm">Xác nhận</option>
                    {/* <option value="Succeed">Đã nhận hàng</option> */}
                </select>
            </div>
            <div>
                <MapTemplate
                    selectedStatus={selectedStatus}
                    updateStatus={updateStatus}
                    setUpdateStatus={setUpdateStatus}
                    fetchAllOrder={fetchAllOrder}
                />
            </div>
        </div>
    );
}

export default UpdateStatus;
