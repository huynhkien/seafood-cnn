import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { apiGetAllOrder } from '../../../apis'; 
import { Badge } from 'primereact/badge';
import moment from 'moment';
import { RxUpdate } from "react-icons/rx";
import { BiDetail } from "react-icons/bi";
import {UpdateStatus, OrderDetail} from "../../Index";

const Page = () => {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showOrder, setShowOrder] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAllOrder = async () => {
        try {
            const response = await apiGetAllOrder();
            if (response.success) {
                setOrders(response.data);
            } else {
                console.error('Failed to fetch orders:', response.error);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrder();
    }, []);

    const formatStatus = (status) => {
        const statusConfig = {
          'Cancelled': { value: 'Đã hủy đơn', severity: 'danger' },
          'Processing': { value: 'Đang xử lý', severity: 'warning' },
          'Delivering': { value: 'Đang giao', severity: 'info' },
          'Succeed': { value: 'Đã nhận hàng', severity: 'success' },
          'Confirm': { value: 'Xác nhận đơn', severity: 'info' },
        };
      
        const config = statusConfig[status] || { value: 'Không xác định', severity: 'secondary' };
      
        return <Badge value={config.value} severity={config.severity}></Badge>;
      };

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm');
    };

    const format = (money) => {
        return <div>{Math.round(money * 23.500).toLocaleString()} VNĐ</div>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <button className="btn btn-xs btn-primary" onClick={() => setShowOrder(rowData.order._id)}>
                    <BiDetail />
                </button>
                <span className='mx-1'></span>
                <button className="btn btn-xs btn-primary" onClick={() => setUpdateStatus(rowData.order._id)}>
                    <RxUpdate />
                </button>
            </div>
        );
    };

    const header = (
        <div className="p-inputgroup flex-1 my-2">
            <InputText
                type="text"
                placeholder="Tìm kiếm"
                className="p-inputtext p-component p-2"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
        </div>
    );

    return (
        <div>
            {showOrder && (
                <div className='order-detail shadow'>
                    <OrderDetail showOrder={showOrder} setShowOrder={setShowOrder} />
                </div>
            )}
            {updateStatus && (
                <div className='update-status'>
                    <UpdateStatus
                        updateStatus={updateStatus}
                        setUpdateStatus={setUpdateStatus}
                        fetchAllOrder={fetchAllOrder} 
                    />
                </div>
            )}
            <div className="header">
                <div className="left">
                    <h1>Đơn hàng</h1>
                </div>
            </div>
            <div className="bottom-data">
                <div className="orders">
                    <DataTable
                        value={orders}
                        paginator
                        rows={10}
                        dataKey="_id"
                        loading={loading}
                        emptyMessage="Không tìm thấy đơn hàng nào."
                        header={header}
                        globalFilter={globalFilter}
                    >
                        <Column field="user.name" header="Tên khách hàng" sortable />
                        {!isSmallScreen &&<Column field="user.phone" header="Điện thoại" sortable />}
                        {!isSmallScreen &&<Column field="user.address" header="Địa chỉ" sortable />}
                        {!isSmallScreen && <Column field="order._id" header="Mã đơn " sortable />}
                        <Column body={(rowData) => formatStatus(rowData.order.status)} header="Trạng thái " sortable />
                        {!isSmallScreen && <Column body={(rowData) => formatDate(rowData.order.createdAt)} header="Ngày tạo" />}
                        <Column sortable body={(rowData) => format(rowData.order.total)} header="Tổng tiền" />
                        <Column body={actionBodyTemplate} header="Chi tiết" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Page;
