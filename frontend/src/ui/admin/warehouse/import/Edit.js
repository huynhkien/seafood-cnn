import React, {useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {InputForm, Select} from "../../../../components/Index"
import { useDispatch, useSelector } from 'react-redux';
import EditFormProduct from './EditFormProduct';
import { MdCancel } from 'react-icons/md';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaTrash } from "react-icons/fa";
import { removeAllWaveHouse, removeWaveHouse } from '../../../../store/user/userSlice';
import {  apiGetReceipt, apiGetSuppliers, apiUpdateReceiptProducts} from '../../../../apis';
import {type} from '../../../../utils/contant';
import { ImportAdd } from '../../../Index';
import { showModal } from '../../../../store/app/appSlice';
const Edit = ({editReceipt, setEditReceipt, fetchReceiptManager}) => {
  const dispatch = useDispatch();
  const [dataReceipt, setDataReceipt] = useState(null);
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();

  // form
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const { waveHouse } = useSelector((state) => state.user);
  const [calculatedSum, setCalculatedSum] = useState(0);
  const [supplier, setSupplier] = useState(null);
  const {current} = useSelector(state => state.user);
  const [showExport, setShowExport] = useState(false);

  // Lọc các sản phẩm theo từ khóa tìm kiếm
  const filtered = waveHouse?.filter(item => {
    const productMatch = item.product?.toLowerCase().includes(globalFilter.toLowerCase());
    const supplierMatch = item.supplier?.toLowerCase().includes(globalFilter.toLowerCase());
    const variantMatch = item.variant?.toLowerCase().includes(globalFilter.toLowerCase());
    return productMatch || supplierMatch || variantMatch;
  });
  // Xử lý ở đơn vị cung cấp 
  const fetchSupplier = async () => {
    const response = await apiGetSuppliers();
    if(response.success) setSupplier(response?.data);
  }
  useEffect(() => {
    fetchSupplier();
  },[])
  useEffect(() => {
    return () => {
      reset(); 
    };
  }, []);

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
      productId: id, variant, name, type
    }));
    toast.success("Xóa thành công!");
  };
  useEffect(() => {
    if (editReceipt) {
      fetchReceipt();
    }
  }, [editReceipt]);
  
  useEffect(() => {
    if (dataReceipt) {
      reset({
        type: dataReceipt?.type || '',
        user: dataReceipt?.handledBy || '',
        supplier: dataReceipt?.supplier || '',
        name: dataReceipt?.type === 'Phiếu xuất' ? dataReceipt?.exportedTo?.name : '',
        email: dataReceipt?.type === 'Phiếu xuất' ? dataReceipt?.exportedTo?.email : '',
        address: dataReceipt?.type === 'Phiếu xuất' ? dataReceipt?.exportedTo?.address : '',
        phone: dataReceipt?.type === 'Phiếu xuất' ? dataReceipt?.exportedTo?.phone : '',
      });
    }
  }, [dataReceipt, reset]);
  // Xử lý phiếu xuất
  const handleTypeChange = (event) => {
    const type = event.target.value;
    if(type === 'Phiếu xuất') {
        setShowExport(true);
    }else{
        setShowExport(false);
    }
  }

  // Hàm update phiếu xuất
  const handleUpdate = async (data) => {
    const totalReceipt = dataReceipt?.products?.reduce((acc, el) => acc + el.totalPrice, 0) || 0;
    const totalCurrent = totalReceipt + calculatedSum
    try {
      const item = {
        products: waveHouse,
        type: data.type,  
        handledBy: current?.name,
        total: totalCurrent,
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
      const response = await apiUpdateReceiptProducts(editReceipt, item);
      dispatch(showModal({ isShowModal: false, modalType: null }));

      if (response.success) {
        toast.success(response.message);
        dispatch(removeAllWaveHouse());
        setShowExport(false);
        fetchReceiptManager();
        fetchReceipt();
        reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi cập nhật phiếu.");
    }
  };
  

  // Cột hiển thị hình ảnh
  const imageBodyTemplate = (rowData) => (
    <img src={rowData?.thumb?.url} alt={rowData.product} style={{ width: '50px', height: '50px' }} />
  );

  // Cột hiển thị nút xóa
  const actionBodyTemplate = (rowData) => (
    <button
      onClick={() => handleDelete(rowData.product, rowData.variant, rowData.name)}
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
  // 
  const fetchReceipt = async () => {
    const response = await apiGetReceipt(editReceipt);
    if(response.success) setDataReceipt(response.data);
  }


  useEffect(() => {
    fetchReceipt();
  }, []);
  

  return (
    <div>
      <div className="bottom-data">
      <span onClick={() => setEditReceipt(null)} className='position-absolute top-0 end-0'>
        <MdCancel fontSize='25' />
      </span>
        <div className="orders">
          <div className='card shadow-sm mb-4'>
            <div className="card-body">
                  <EditFormProduct
                    id={editReceipt}
                    receipt={dataReceipt}
                    fetchReceipt={fetchReceipt}
                  />
            </div>
          </div>
          <div className="card shadow-sm">
            <ImportAdd
             editReceipt={editReceipt}
            />
          </div>
          <div className=' card shadow-sm my-3'>
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
              <Column sortable field="price" header="Giá" />
              <Column sortable field="totalPrice" header="Tổng tiền" />
              <Column body={actionBodyTemplate} header="Action" />
            </DataTable>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="row mt-4">
          <div className="d-flex justify-content-end">
            <h5 className="text-end">Thành tiền: <span className="text-primary">{calculatedSum.toLocaleString()} VNĐ</span></h5>
          </div>
          <div>
            <div className='row g-3 mt-3'>
                <div className="col-md-4">
                    <Select
                      label='Hình thức'
                      options={type?.map(el => ({ code: el.code, value: el.code }))}
                      register={register}
                      id='type'
                      name='Hình thức'
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
                    />
                  </div>
                  <div className="col-md-4">
                  {!showExport && dataReceipt?.type !== 'Phiếu xuất' ? 
                 (
                  <Select
                  label='Đơn vị cung cấp'
                  options={supplier?.map(el => ({ code: el.name, value: el.name }))}
                  register={register}
                  id='supplier'
                  name='supplier'
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
        
          {dataReceipt?.type === 'Phiếu xuất' || showExport ? (
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
            )
            :
            null
            }
            <div className="mt-3 d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
            </div>
          <div>
          </div>
          
        </div>
        </form>
      </div>
    </div>
          </div>
    </div>
    </div>
    </div>
  )
}

export default Edit;