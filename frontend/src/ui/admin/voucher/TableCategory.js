import { memo, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaTrash } from "react-icons/fa";
import { useDispatch} from 'react-redux';
import { addVoucherCategory, removeVoucherCategory } from '../../../store/user/userSlice';
import { useForm } from 'react-hook-form';
import { Select } from '../../../components/Index';
import { apiGetCategory } from '../../../apis';

const Form = ({voucher, payload}) => {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState('');
  const [categories, setCategories] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const fetchCategories = async() =>{
    const response = await apiGetCategory();
    if(response.success) setCategories(response.data)

  }
  useEffect(() => {
    fetchCategories();
  },[])
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    console.log(voucher)
    const category = categories.find(c => c._id === categoryId);
    const existCategories = payload?.applicableCategories?.some(p => 
      p.category === categoryId 
    );
    if(existCategories){
      alert('Tồn tại danh mục trong dữ liệu. Vui lòng chọn danh mục khác');
      reset();
    }else{
      if(category){
        dispatch(addVoucherCategory({category: categoryId, name: category?.name}))
      }
    }
  }


  // Lọc các sản phẩm theo từ khóa tìm kiếm
  const filtered = voucher?.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch ;
  }) || [];
  const handleDelete = async (id) =>{
    dispatch(removeVoucherCategory({id: id}));

  }
  // Xử lý ở đơn vị cung cấp 
  // Cột hiển thị nút xóa
  const actionBodyTemplate = (rowData) => (
    <button
    type='button'
    onClick={() =>handleDelete(rowData?.id)}
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
                    options={categories?.map(el => ({ code: el._id, value: el.name }))}
                    register={register}
                    id='category'
                    name='Chọn danh mục'
                    errors={errors}
                    validate={{
                      required: 'Thông tin thiếu'
                    }}
                    onChange={handleCategoryChange}
                />
              </div>
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Sản phẩm</h4>
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
              <Column sortable field="category" header="Mã" />
              <Column sortable field="name" header="Danh mục" />
              <Column body={actionBodyTemplate} header="Action" />
            </DataTable>
          </div>
        </form>
  );
};

export default memo(Form);
