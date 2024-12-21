import { memo, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllWaveHouse, removeWaveHouse } from '../../../../store/user/userSlice';
import { apiCreateReceiptImport, apiGetReceipt, apiGetSuppliers, apiUpdateReceiptProducts } from '../../../../apis';
import {type} from '../../../../utils/contant';
import {InputForm, Select} from "../../../../components/Index"
import { useForm } from 'react-hook-form';
import { showModal } from '../../../../store/app/appSlice';

const Form = ({editReceipt, setEditReceipt}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const { waveHouse } = useSelector((state) => state.user);
  const [calculatedSum, setCalculatedSum] = useState(0);
  const [supplier, setSupplier] = useState(null);
  const {current} = useSelector(state => state.user);
  const [showExport, setShowExport] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();

  // Lọc các sản phẩm theo từ khóa tìm kiếm
  const filtered = waveHouse?.filter(item => {
    const searchTerm = globalFilter.toLowerCase();
    return (
      item.product?.toLowerCase().includes(searchTerm) ||
      item.supplier?.toLowerCase().includes(searchTerm) ||
      item.variant?.toLowerCase().includes(searchTerm)
    );
  }) || [];

  // Xử lý ở đơn vị cung cấp 
  const fetchSupplier = async () => {
    try {
      const response = await apiGetSuppliers();
      if(response.success) {
        setSupplier(response?.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Không thể tải danh sách nhà cung cấp');
    }
  }

  useEffect(() => {
    fetchSupplier();
  }, []);

  useEffect(() => {
    return () => {
      reset(); 
    };
  }, [reset]);

  useEffect(() => {
    if (filtered.length > 0) {
      const newSum = filtered.reduce((acc, item) => acc + (item?.totalPrice || 0), 0);
      setCalculatedSum(newSum);
    } else {
      setCalculatedSum(0);
    }
    setLoading(false);
  }, [filtered]);

  // Hàm xóa sản phẩm
  const handleDelete = (id, variant, name) => {
    dispatch(removeWaveHouse({
      productId: id, 
      variant, 
      name, 
      type
    }));
    toast.success("Xóa thành công!");
  };

  // Xử lý phiếu xuất
  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setShowExport(selectedType === 'Phiếu xuất');
  }

  // Hàm tạo phiếu nhập
  const handleCreate = async (data) => {
    try {
      const item = {
        products: waveHouse,
        type: data.type,  
        handledBy: current?.name,
        total: calculatedSum,
        supplier: data.supplier,
      };
  
      if (showExport) {
        item.exportedTo = {
          name: data.name,
          email: data.email,
          address: data.address,
          phone: data.phone,
        };
      }
      dispatch(showModal({ isShowModal: true, modalType: 'loading' }));  
      const response = await apiCreateReceiptImport(item);
      dispatch(showModal({ isShowModal: false, modalType: null }));
      if (response.success) {
        toast.success(response.message);
        dispatch(removeAllWaveHouse());
        reset();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi tạo phiếu.");
    }
  };

  const imageBodyTemplate = (rowData) => (
    <img 
      src={rowData?.thumb?.url} 
      alt={rowData.product} 
      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
    />
  );

  const actionBodyTemplate = (rowData) => (
    <button
      onClick={() => handleDelete(rowData.product, rowData.variant, rowData.name)}
      className="btn btn-xs btn-danger"
    >
      <FaTrash />
    </button>
  );

  const formatMoney = (rowData) => (
    <div>
      {rowData?.price?.toLocaleString()} VNĐ
    </div>
  );

  const formatTotalPrice = (rowData) => (
    <div>
      {rowData?.totalPrice?.toLocaleString()} VNĐ
    </div>
  );

  const header = (
    <div className="p-inputgroup flex-1 my-2">
      <InputText
        type="text"
        placeholder="Tìm kiếm"
        className="p-inputtext p-component p-2"
        onChange={(e) => setGlobalFilter(e.target.value)}
        value={globalFilter}
      />
    </div>
  );

  return (
    <div className="bottom-data">
      <div className="orders">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Sản phẩm</h4>
          </div>
          <div className="card-body">
            <DataTable
              value={filtered}
              paginator
              rows={10}
              dataKey="id"
              loading={loading}
              emptyMessage="Không có sản phẩm."
              header={header}
              globalFilter={globalFilter}
            >
              <Column sortable field="name" header="Sản phẩm" />
              <Column body={imageBodyTemplate} header="Ảnh" />
              <Column sortable field="variant" header="Thuộc tính" />
              <Column sortable field="quantity" header="Số lượng" />
              <Column sortable body={formatMoney} header="Giá" />
              <Column sortable body={formatTotalPrice} header="Tổng tiền" />
              <Column body={actionBodyTemplate} header="Action" />
            </DataTable>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleCreate)}>
          <div className="row mt-4">
            <div className="d-flex justify-content-end">
              <h5 className="text-end">
                Thành tiền: <span className="text-primary">{calculatedSum.toLocaleString()} VNĐ</span>
              </h5>
            </div>
            <div>
              <div className='row g-3 mt-3'>
                <div className="col-md-4">
                  <Select
                    label='Hình thức'
                    options={type?.map(el => ({ code: el.code, value: el.code }))}
                    register={register}
                    id='type'
                    name='Lựa chọn hình thức'
                    errors={errors}
                    validate={{ required: 'Vui lòng chọn hình thức' }}
                    onChange={handleTypeChange}
                    className="form-select"
                  />
                </div>
                <div className="col-md-4">
                  <InputForm
                    label='Nhân viên thực hiện'
                    placeholder='Nhân viên thực hiện'
                    register={register}
                    errors={errors}
                    id='user'
                    validate={{ required: 'Thông tin thiếu' }}
                    defaultValue={current?.name}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                 {!showExport ? 
                 (
                  <Select
                  label='Đơn vị cung cấp'
                  options={supplier?.map(el => ({ code: el.name, value: el.name }))}
                  register={register}
                  id='supplier'
                  name='Đơn vị cung cấp'
                  errors={errors}
                  validate={{ required: 'Vui lòng chọn đơn vị cung cấp' }}
                  className="form-select"
                />
                 )
                :
                <InputForm
                    label='Đơn vị cung cấp'
                    register={register}
                    errors={errors}
                    id='supplier'
                    validate={{ required: 'Thông tin thiếu' }}
                    className="form-control"
                    readOnly
                  />
                }
                </div>
              </div>
            </div>
        
            {showExport && (
              <div className="d-flex justify-content-between mt-3 bg-white p-4 shadow rounded">
                <div>
                  <InputForm
                    label='Tên khách hàng'
                    placeholder='Tên khách hàng'
                    register={register}
                    errors={errors}
                    id='name'
                    validate={{ required: 'Thông tin thiếu' }}
                    className="form-control"
                  />
                </div>
                <div>
                  <InputForm
                    label='Email'
                    placeholder='Email'
                    register={register}
                    errors={errors}
                    id='email'
                    validate={{ required: 'Thông tin thiếu' }}
                    className="form-control"
                  />
                </div>
                <div>
                  <InputForm
                    label='Địa chỉ'
                    placeholder='Địa chỉ'
                    register={register}
                    errors={errors}
                    id='address'
                    validate={{ required: 'Thông tin thiếu' }}
                    className="form-control"
                  />
                </div>
                <div>
                  <InputForm
                    label='Số điện thoại'
                    placeholder='Số điện thoại'
                    register={register}
                    errors={errors}
                    id='phone'
                    validate={{ required: 'Thông tin thiếu' }}
                    className="form-control"
                  />
                </div>
              </div>
            )}
            <div className="mt-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-primary w-100">
                {editReceipt ? 'Cập nhật' : 'Tạo phiếu'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(Form);