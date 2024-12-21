import React from 'react'
import { useSelector } from 'react-redux';
import {Insights, PieChart, BarChart} from "../Index";
import { useCallback, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { apiGetAllOrder } from '../../apis'; // Import API function
import { Badge } from 'primereact/badge';
import moment from 'moment';
import {formatMoney} from "../../utils/helper";
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate(false);
  const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [update,setUpdate] = useState(false);
  const render = useCallback(() => {
    setUpdate(!update);
  })

    const fetchAllOrder = async () => {
        try {
            const response = await apiGetAllOrder();
            if (response.success) {
                setOrders(response?.data);
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
        switch (status) {
          case 'Cancelled':
            return <Badge  value="Đã hủy đơn" severity="error"></Badge>;
          case 'Processing':
            return <Badge  value="Đang xử lý" severity="warning"></Badge>;
          case 'Delivering':
            return <Badge value="Đang giao" ></Badge>;
          case 'Received':
          default:
            return <Badge value="Đã nhận hàng" severity="success"></Badge>;
        }
      };
      const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm');
      };
      const format = (money) => {
        return <div>{(Math.round(money*23.500)).toLocaleString()} VNĐ</div>;
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
      <Insights/>
      <div className="bottom-data">
      <div className="orders">
        <h5 className="text-center">Trạng thái đơn hàng</h5>
       <PieChart/>
      </div>
      <div className="orders">
      <h5 className="text-center">Đánh giá sản phẩm</h5>
      <BarChart/>
      </div>
    </div>
      <div className="bottom-data">
                <div className="orders">
                <h4>Đơn hàng</h4>
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
                        <Column field="user.phone" header="Điện thoại" sortable />
                        <Column field="user.address" header="Địa chỉ" sortable />
                        <Column field="order._id" header="Mã đơn " sortable />
                        <Column body={(rowData) => formatStatus(rowData.order.status)} header="Trạng thái " sortable />
                        <Column body={(rowData) => formatDate(rowData.order.createdAt)} header="Ngày tạo" />
                        <Column sortable body={(rowData) => format(rowData.order.total)} header="Tổng tiền" />
                    </DataTable>
                </div>
            </div>
    </div>
  );
};

export default AdminDashboard;
