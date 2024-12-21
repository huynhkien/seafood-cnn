import { memo, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaTrash } from "react-icons/fa";
import { useDispatch} from 'react-redux';
import { addVoucherProduct, removeVoucher } from '../../../store/user/userSlice';
import { Select } from '../../../components/Index';
import { useForm } from 'react-hook-form';
import { apiGetProducts } from '../../../apis';

const Form = ({voucher, payload}) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState(null);
 
 

  const [globalFilter, setGlobalFilter] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchProducts = async () => {
    const response = await apiGetProducts();
    setProducts(response.data);
  }

  useEffect(() => {
    fetchProducts();
  },[])
  useEffect(() => {
    console.log(payload);
  })
  const handleProductChange = (event) => {
    const productId = event.target.value;
    if(payload){
      const getVoucher = payload?.applicableProducts?.find(p => p?.product === productId)
      if(getVoucher){
        alert('Sản phẩm này đã tồn tại trong mã giảm giá')
        return;
      }
    }
    const product = products.find(p => p._id === productId);
    const newProduct = {
      product: product?._id,
      name: product?.name,
    }
    dispatch(addVoucherProduct(newProduct));

    }

  
  // Lọc các sản phẩm theo từ khóa tìm kiếm
  const filtered = voucher?.filter(item => {
    const nameMatch = item.name?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch ;
  }) || [];
  const handleDelete = async (product, variant) =>{
    console.log(product);
    console.log(variant);
    dispatch(removeVoucher({product, variant}));

  }
  // Xử lý ở đơn vị cung cấp 
  // Cột hiển thị nút xóa
  const actionBodyTemplate = (rowData) => (
    <button
    type='button'
    onClick={() =>handleDelete(rowData?.product, rowData?.variant)}
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
                <div className="col-md-6">
                  <Select
                    options={products?.map(el => ({ code: el._id, value: el.name }))}
                    register={register}
                    id='products'
                    name='Chọn sản phẩm'
                    errors={errors}
                    validate={{
                      required: 'Thông tin thiếu'
                    }}
                    onChange={handleProductChange}
                />
                </div>
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
              emptyMessage="Không có sản phẩm."
              header={header}
              globalFilter={globalFilter}
            >
              <Column sortable field='product' header="Id" />
              <Column sortable field="name" header="Sản phẩm" />
              <Column body={actionBodyTemplate} header="Action" />
            </DataTable>
          </div>
        </form>
  );
};

export default memo(Form);
