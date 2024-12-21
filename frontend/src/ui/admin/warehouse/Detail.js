import { useEffect, useState } from 'react';
import { apiGetReceipt } from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MdCancel } from 'react-icons/md';
import ExcelExport from '../file/Excel';
import { ExportWord } from '../../Index';

const DetailReceipt = ({ id, setShow }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchReceipt = async () => {
    const response = await apiGetReceipt(id);
    if (response.success) {
      setReceipt(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipt();
    console.log(receipt)
  }, [id]);
  // Hàm hiển thị hình ảnh trong cột
  const imageBodyTemplate = (rowData) => (
      <img src={rowData?.thumb?.url} alt={rowData.product} style={{ width: '50px', height: '50px' }} />
    );

  const priceBodyTemplate = (rowData) => (
      <span>{rowData?.price?.toLocaleString()}</span>
    );
  const priceTotalBodyTemplate = (rowData) => (
      <span>{rowData?.totalPrice?.toLocaleString()}</span>
    );

  // Lọc sản phẩm dựa trên globalFilter
  const filteredProducts = receipt?.products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(globalFilter.toLowerCase());
    const variantMatch = product.variant.toLowerCase().includes(globalFilter.toLowerCase());

    return nameMatch || variantMatch;
  }) || [];

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
      <div className="bottom-data">
        <div className='position-absolute top-0 end-0'>
          <span onClick={() => setShow(null)} ><MdCancel color='primary' fontSize={25}/></span>
        </div>
        <div className="orders">
          <div>
            <ExcelExport
             rid={id}
            />
            <ExportWord
            rid={id}
            />
          </div>
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Chi tiết</h4>
          </div>
          <div className="card m-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Nhân viên:</strong> {receipt?.handledBy}
                </li>
                <li className="list-group-item">
                  <strong>Tổng tiền:</strong> {receipt?.total.toLocaleString()} VNĐ
                </li>
              </ul>
            </div>
          <div className="card-body">
          <DataTable
            value={filteredProducts}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            emptyMessage="Không tìm thấy sản phẩm."
            header={header}
          >
            <Column sortable field="name" header="Sản phẩm" />
            <Column body={imageBodyTemplate} header="Ảnh" />
            <Column sortable field="variant" header="Biến thể" />
            <Column sortable field="quantity" header="Số lượng" />
            <Column sortable body={priceBodyTemplate} header="Giá" />
            <Column sortable body={priceTotalBodyTemplate} header="Tổng tiền" />
          </DataTable>
          </div>
          {receipt?.exportedTo && (
            <div className="card m-4">
              <div className="card-header">
                <h5>Thông tin người nhận</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Tên:</strong> {receipt?.exportedTo?.name}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {receipt?.exportedTo?.email}
                </li>
                <li className="list-group-item">
                  <strong>Địa chỉ:</strong> {receipt?.exportedTo?.address}
                </li>
                <li className="list-group-item">
                  <strong>Số điện thoại:</strong> {receipt?.exportedTo?.phone}
                </li>
              </ul>
            </div>
          )}

          </div>
        </div>
      </div>
  );
};

export default DetailReceipt;
