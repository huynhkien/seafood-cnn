import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MdCancel } from 'react-icons/md';
import {  FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { apiDeleteVoucherCategory, apiDeleteVoucherProductId, apiDeleteVoucherUser, apiUpdateVoucherProductId } from '../../../apis/voucher';
import TableCategory from './TableCategory';
import TablePoint from './TablePoint';

const EditFormProduct = ({ payload, render }) => {
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [addItem, setAddItem] = useState(false);
  const {voucher} = useSelector(state => state.user);

  const dispatch = useDispatch();
  // Hàm xóa
  const handleDelete = async (vid, _id, type) => {
      console.log(type)
      if(type === 'categories'){
        const response = await apiDeleteVoucherCategory(vid, _id);
        if (response.success) {
            toast.success(response.message);
            render(); 
        } else {
            toast.error(response.message);
        }
      }else if(type === 'users'){
        const response = await apiDeleteVoucherUser(vid, _id);
        if (response.success) {
            toast.success(response.message);
            render(); 
        } else {
            toast.error(response.message);
        }
      }
    };
  
  

  
  // Lọc sản phẩm dựa trên globalFilter
  const data = payload?.applyType === 'categories' ? payload?.applicableCategories : payload?.applicableUsers 
  const filteredProducts = data?.filter((product) => {
    const nameMatch = product?.name?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch ;
  }) || [];

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button type='button' className="btn btn-xs btn-danger" onClick={() => handleDelete(payload?._id, rowData?._id, payload?.applyType)}>
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
    <div>
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

                <Column sortable field="name" header="Danh mục" />
                <Column body={actionBodyTemplate} header="Action" />
              </DataTable>
          </div>
          <div className='p-3' onClick={() => setAddItem(prev => !prev)}>
            <span className='btn btn-primary'>
            {payload?.applyType === 'categories' ? 'Thêm danh mục' : 'Thêm điểm tích lũy '}
            </span>
          </div>
        </div>
        {addItem && payload?.applyType === 'categories' && (
          <div className='mt-3'>
            <TableCategory
             voucher={voucher}
             payload={payload}
            />
          </div>
        )}
        {addItem && payload?.applyType === 'users' && (
          <div className='mt-3'>
            <TablePoint
             voucher={voucher}
             payload={payload}
            />
          </div>
        )}
      </div>
  );
};

export default EditFormProduct;
