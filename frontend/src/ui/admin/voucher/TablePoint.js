import { memo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaTrash } from "react-icons/fa";
import { useDispatch} from 'react-redux';
import { addVoucherCategory, addVoucherUser, removeVoucherCategory, removeVoucherUser } from '../../../store/user/userSlice';
import { Select } from '../../../components/Index';
import { useForm } from 'react-hook-form';
import { accumulate } from '../../../utils/contant';

const Form = ({voucher, payload}) => {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const handleAccChange = (e) => {
    const value = e.target.value;
    const existAcc = payload?.applicableUsers?.some(p => 
      p.name === value 
    );
    if (existAcc) {
      alert('Tồn tại điểm tích lũy trong dữ liệu. Vui lòng chọn điểm tích lũy khác');
      reset();
    }else{
      dispatch(addVoucherUser({name: value}))
    }
  }
  console.log(voucher);

  


  // Lọc các sản phẩm theo từ khóa tìm kiếm
  const filtered = voucher?.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch ;
  }) || [];
  const handleDelete = async (name) =>{
    dispatch(removeVoucherUser({name: name}));

  }
  // Xử lý ở đơn vị cung cấp 
  // Cột hiển thị nút xóa
  const actionBodyTemplate = (rowData) => (
    <button
    type='button'
    onClick={() =>handleDelete(rowData?.name)}
      className="btn btn-xs btn-danger"
    >
      <FaTrash />
    </button>
  );

  // Header tìm kiếm
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
        <form className="card mb-4">
           <div className='d-flex justify-content-between row p-3'>
                  <Select
                    options={accumulate?.map(el => ({ code: el.value, value: el.value }))}
                    register={register}
                    id='accumulate'
                    name='Chọn hạng'
                    errors={errors}
                    validate={{
                      required: 'Thông tin thiếu'
                    }}
                    onChange={handleAccChange}
                />
              </div>
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Hạng</h4>
          </div>
          <div className="card-body">
            <DataTable
              value={filtered}
              paginator
              rows={10}
              dataKey="id"
              emptyMessage="Không có danh mục."
              header={header}
              globalFilter={globalFilter}
            >
              <Column sortable field="name" header="Hạng" />
              <Column body={actionBodyTemplate} header="Action" />
            </DataTable>
          </div>
        </form>
  );
};

export default memo(Form);
