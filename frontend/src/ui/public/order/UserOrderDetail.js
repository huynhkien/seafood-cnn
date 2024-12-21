import React, { useEffect, useState } from 'react';
import { apiGetOrderById } from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Index';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserOrderDetail = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const { id } = useParams();
  const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

  const fetchOrders = async () => {
    try {
      const response = await apiGetOrderById(id);
      if (response.success) {
        setOrders(response.message);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("An error occurred while fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.thumb} alt={rowData.name} width={50} height={50} />;
  };

  const totalBodyTemplate = (rowData) => {
    return (
      <div>
        {(rowData.price * rowData.quantity).toLocaleString()} VNĐ
      </div>
    );
  };
  const priceBodyTemplate = (rowData) => {
    return (
      <div>
        {(rowData.price).toLocaleString()} VNĐ
      </div>
    );
  };


  const header = (
    <div className="p-inputgroup flex-1 my-2">
      <InputText
        type="text"
        placeholder="Tìm kiếm"
        className="p-inputtext p-component p-2"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );

  return (
    <div>
      <div className="order-detail__top">
        <Breadcrumb category='Đơn hàng' categoryUrl={'/order'} name='Chi tiết'/>
      </div>
      <div className="order-detail__bottom">
        <div className="bottom--table">
          <DataTable
            value={orders?.products}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            emptyMessage="No orders found."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable field="name" header="Sản phẩm" />
            <Column body={imageBodyTemplate} header="Hình ảnh" />
            <Column sortable body={priceBodyTemplate} field="price" header="Giá" />
            <Column sortable field="quantity" header="Số lượng" />
            <Column sortable field="variant" header="Chọn" />
            <Column field="total" header="Tổng" body={totalBodyTemplate} />
          </DataTable>
        </div>
        {orders?.location?.lat &&
          <div className='mt-3'>
            <h3 className='text-center text-primary mb-4 border-bottom pb-2'>Vị trí đơn hàng</h3>
            <MapContainer center={[orders?.location?.lat, orders?.location?.lng]} zoom={13} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[orders?.location?.lat, orders?.location?.lng]} icon={customIcon}>
                <Popup>Vị trí của đơn hàng</Popup>
              </Marker>
            </MapContainer>
          </div>
        }
      </div>
    </div>
  );
};

export default UserOrderDetail;
