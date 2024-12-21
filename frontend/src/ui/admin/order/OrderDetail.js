import { useEffect, useState } from 'react';
import { apiGetOrderById, apiGetUser } from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MdCancel } from 'react-icons/md';

const OrderDetail = ({showOrder, setShowOrder, uid}) => {
  const [orders, setOrders] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isUser, setIsUser] = useState(null);

  const fetchOrders = async () => {
      const response = await apiGetOrderById(showOrder);
      if (response.success) setOrders(response.message);
      
  };
  const fetchUser = async() => {
    const response = await apiGetUser(orders?.orderBy)
    if(response.success) setIsUser(response.data);
  }

  useEffect(() => {
    fetchOrders();
  }, [showOrder]);
  
  useEffect(() => {
    if (orders && orders.orderBy) {
      fetchUser();
    }
  }, [orders]);

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.thumb} alt={rowData.name} width={50} height={50} />;
  };
  const priceBodyTemplate = (rowData) => {
    return rowData?.price?.toLocaleString();
  };

  const totalBodyTemplate = (rowData) => {
    return <span>{(rowData.price * rowData.quantity).toLocaleString()}</span>;
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
    <div className='shadow'>
      <span onClick={() =>setShowOrder(null) } className='position-absolute top-0 end-0'><MdCancel fontSize='25'/></span>
      <div className="bottom-data">
        <div className="orders">
          <DataTable
            value={orders?.products}
            paginator
            rows={10}
            dataKey="id"
            emptyMessage="No orders found."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable field="name" header="Sản phẩm" />
            <Column body={imageBodyTemplate} header="Hình ảnh" />
            <Column sortable body={priceBodyTemplate} header="Giá" />
            <Column sortable field="quantity" header="Số lượng" />
            <Column sortable field="variant" header="Chọn" />
            <Column field="total" header="Tổng" body={totalBodyTemplate} />
          </DataTable>
        </div>
        <div className="card m-4">
              <div className="card-header">
                <h5>Thông tin khách hàng</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Tên:</strong> {isUser?.name}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {isUser?.email}
                </li>
                <li className="list-group-item">
                  <strong>Địa chỉ:</strong> {isUser?.address}
                </li>
                <li className="list-group-item">
                  <strong>Số điện thoại:</strong> {isUser?.phone}
                </li>
              </ul>
            </div>
      </div>
    </div>
  );
};

export default OrderDetail;
