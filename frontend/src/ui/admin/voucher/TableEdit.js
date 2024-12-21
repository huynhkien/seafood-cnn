import { useEffect, useState } from 'react';
import {  apiGetProduct} from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { apiDeleteVoucherProductId, apiUpdateVoucherProductId } from '../../../apis/voucher';
import { VoucherTable } from '../../Index';
import { useSelector } from 'react-redux';

const EditFormProduct = ({ payload, render }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [addProducts, setAddProducts] = useState(false);
  const {voucher} = useSelector(state => state.user);
  const [getVoucher, setGetVoucher] = useState(null);
  // Hàm xóa
  const handleDelete = async (vid, _id) => {
    if (window.confirm('Bạn chắc muoốn xóa không?')) {
        const response = await apiDeleteVoucherProductId(vid, _id);
        if (response.success) {
          toast.success(response.message);
          render(); 
        } else {
          toast.error(response.message);
        }
      }
    };
    
  
  

  
  // Lọc sản phẩm dựa trên globalFilter
  const filteredProducts = payload?.applicableProducts?.filter((product) => {
    const nameMatch = product?.name?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch ;
  }) || [];

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button type='button' className="btn btn-xs btn-danger" onClick={() => handleDelete(payload?._id, rowData?._id)}>
          <FaTrash />
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
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );

  return (
    <div >
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Chi tiết</h4>
          </div>
          <div className="card-body">
              <DataTable
                value={filteredProducts}
                paginator
                rows={10}
                dataKey="id"
                emptyMessage="Không tìm thấy sản phẩm."
                header={header}
              >
                <Column sortable field='product' header="Id" />
                <Column sortable field="name" header="Sản phẩm" />
                <Column body={actionBodyTemplate} header="Action" />
              </DataTable>
          </div>
          <div className='p-3' onClick={() => setAddProducts(prev => !prev)}>
            <span className='btn btn-primary'>
              Thêm sản phẩm
            </span>
          </div>
        </div>
        {addProducts && (
          <div className='mt-3'>
            <VoucherTable
             voucher={voucher}
             payload={payload}
            />
          </div>
        )}
      </div>
  );
};

export default EditFormProduct;
