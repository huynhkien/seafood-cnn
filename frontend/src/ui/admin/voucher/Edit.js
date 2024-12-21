import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiGetCategory, apiGetProducts } from '../../../apis';
import { InputForm, Select } from "../../../components/Index"
import { useDispatch, useSelector } from 'react-redux';
import { applyVoucher, discountType, accumulate } from '../../../utils/contant';
import { addVoucherCategory, addVoucherProduct, removeAllVoucher } from '../../../store/user/userSlice';
import { TableEdit, TableEditTemp, VoucherTable, VoucherTableCategory, VoucherTablePoint } from '../../Index';
import { apiCreateVoucher, apiDeleteVoucher, apiGetVoucher, apiUpdateVoucher } from '../../../apis/voucher';
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import { showModal } from '../../../store/app/appSlice';


const Edit = ({data, setData, fetchVouchers}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [selectType, setSelectType] = useState(null);
  const dispatch = useDispatch();
  const [payload, setPayload] = useState(null);
  const {voucher} = useSelector(state => state.user)


  const fetchVoucher = async () => {
    const response = await apiGetVoucher(data?.id);
    if(response.success) setPayload(response.data);
  }

  useEffect(() => {
    fetchVoucher();
  }, [data?.id])

  useEffect(() => {
    if(payload){
      reset({
        code: payload?.code || '',
        description: payload?.description || '',
        discountType: payload?.discountType || '',
        discountValue: payload?.discountValue || '',
        minPurchaseAmount: payload?.minPurchaseAmount || '',
        maxDiscount: payload?.maxDiscount || '',
        endDate: payload?.endDate?.split("T")[0] || '', 
        startDate: payload?.startDate?.split("T")[0] || '', 
        applyType: payload?.applyType || '',
        usageLimit: payload?.usageLimit || '',
        userUsageLimit: payload?.userUsageLimit || ''
      })
    }
  }, [payload, reset])


  const handleType = (e) => {
    const type = e.target.value;
    console.log(type)
    if(type === 'all' && type === ''){ setSelectType(null);
    }else{ 
      setSelectType(type);}
    }
  const handleUpdate = async (pay) => {
    const item = {
      code: pay.code,
      description: pay.description,
      discountType: pay.discountType,
      discountValue: pay.discountValue,
      minPurchaseAmount: pay.minPurchaseAmount,
      maxDiscount: pay.maxDiscount,
      endDate: pay.endDate,
      startDate: pay.startDate,
      applyType: pay.applyType,
      usageLimit: pay.usageLimit,
      userUsageLimit: pay.userUsageLimit
    }
    if(item.applyType === 'products'){
      item.applicableProducts = voucher
    }else if(item.applyType === 'categories'){
      item.applicableCategories = voucher
    }else if(item.applyType === 'users'){
      item.applicableUsers = voucher
    }
    console.log(item)
    dispatch(showModal({ isShowModal: true, modalType: 'loading' })); 
    const response = await apiUpdateVoucher(data?.id, item);
    dispatch(showModal({ isShowModal: false, modalType: null }));
    if(response.success){
      toast.success(response.message);
      fetchVouchers();
      reset();
      dispatch(removeAllVoucher());
    }else{
      toast.error(response.message);
    }
  };
  return (
    <div className="container-fluid">
      <div className='position-absolute top-0 end-0'>
        <span onClick={() => setData(null)}><MdCancel color='primary' fontSize={25}/></span>
      </div>
      <div className="bottom-data row">
        <div className='orders col'>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-4">
                <InputForm
                  label='Mã code giảm giá:'
                  placeholder='Tên mã code giảm giá'
                  register={register}
                  errors={errors}
                  id='code'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-4">
                <Select
                    label='Loại giảm giá:'
                    options={discountType?.map(el => ({ code: el.code, value: el.value }))}
                    name='Chọn loại giảm giá'
                    register={register}
                    id='discountType'
                    errors={errors}
                    validate={{
                      required: 'Thông tin thiếu'
                    }}
                  />
              </div>
              <div className="col-md-4">
                <InputForm
                  label='Mức giảm giá:'
                  placeholder='Mức giảm giá'
                  type='number'
                  register={register}
                  errors={errors}
                  id='discountValue'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <InputForm
                  label='Áp dụng tối thiểu:'
                  placeholder='Áp dụng tối thiểu'
                  register={register}
                  type='number'
                  errors={errors}
                  id='minPurchaseAmount'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-6">
                <InputForm
                  label='Áp dụng tối đa:'
                  placeholder='Áp dụng tối đa'
                  type='number'
                  register={register}
                  errors={errors}
                  id='maxDiscount'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <InputForm
                  label='Ngày bắt đầu:'
                  placeholder='Ngày bắt đầu'
                  type='date'
                  register={register}
                  errors={errors}
                  id='startDate'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-6">
                <InputForm
                  label='Ngày hết hạn:'
                  placeholder='Ngày hết hạn'
                  type='date'
                  register={register}
                  errors={errors}
                  id='endDate'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <InputForm
                  label='Giới hạn áp dụng:'
                  placeholder='Giới hạn áp dụng'
                  register={register}
                  errors={errors}
                  type='number'
                  id='usageLimit'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-6">
                <InputForm
                  label='Giới hạn người sử dụng:'
                  placeholder='Giới hạn người sử dụng'
                  register={register}
                  type='number'
                  errors={errors}
                  id='userUsageLimit'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="description" className='mb-2'>Mô tả:</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    rows="3"
                    placeholder="Nhập mô tả cho mã giảm giá"
                    {...register('description', {
                      required: 'Thông tin thiếu'
                    })}
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                </div>
              </div>
            </div>
            <div className='col mb-3'>
              <div className='row'>
                <div className="col-12">
                  <Select
                    label='Hình thức áp dụng:'
                    options={applyVoucher?.map(el => ({ code: el.code, value: el.value }))}
                    register={register}
                    id='applyType'
                    name='Trạng thái'
                    errors={errors}
                    validate={{
                      required: 'Thông tin thiếu'
                    }}
                    onChange={handleType}
                  />
                </div>
              </div>
              {payload?.applyType === 'products' &&
                <div className='my-3'>
                  <TableEdit
                    payload={payload}
                    render={fetchVoucher}
                    
                />
                </div>
            }
              {payload?.applyType === 'categories' &&
                <div className='my-3'>
                  <TableEditTemp
                    payload={payload}
                    render={fetchVoucher}
                />
                </div>
            }
              {payload?.applyType === 'users' &&
                <div className='my-3'>
                  <TableEditTemp
                    payload={payload}
                    render={fetchVoucher}
                />
                </div>
            }
            </div>
                  
            <div className="d-flex justify-content-center text-center">
              <button type="submit" name="submit" className="btn btn-primary">Cập nhật</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;