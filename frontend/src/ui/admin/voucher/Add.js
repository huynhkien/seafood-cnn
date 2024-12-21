import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputForm, Select } from "../../../components/Index"
import { useDispatch, useSelector } from 'react-redux';
import { applyVoucher, discountType} from '../../../utils/contant';
import {  removeAllVoucher } from '../../../store/user/userSlice';
import { VoucherTable, VoucherTableCategory, VoucherTablePoint } from '../../Index';
import { apiCreateVoucher } from '../../../apis/voucher';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { showModal } from '../../../store/app/appSlice';

const socket = io('http://localhost:3001');


const Add = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [selectType, setSelectType] = useState(null);
  const {voucher} = useSelector(state => state.user);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Lắng nghe sự kiện connect
    socket.on('connect', () => {
      setSocketConnected(true);
    });

    return () => {
      socket.off('connect');
    };
  }, []);


  const dispatch = useDispatch();


  const handleType = (e) => {
    const type = e.target.value;
    if(type === 'all' && type === ''){ setSelectType(null);
    }else{ setSelectType(type);}
    }
    const handleCreate = async (data) => {
      const payload = {
        code: data?.code,
        description: data?.description,
        discountType: data?.discountType,
        discountValue: data?.discountValue,
        minPurchaseAmount: data?.minPurchaseAmount,
        maxDiscount: data?.maxDiscount,
        endDate: data?.endDate,
        startDate: data?.startDate,
        applyType: data?.applyType,
        usageLimit: data?.usageLimit,
        userUsageLimit: data?.userUsageLimit
      }
      if(payload.applyType === 'products'){
        payload.applicableProducts = voucher
      }else if(payload.applyType === 'categories'){
        payload.applicableCategories = voucher
      }else if(payload?.applyType === 'users'){
        payload.applicableUsers = voucher
      }
      dispatch(showModal({ isShowModal: true, modalType: 'loading' })); 
      const response = await apiCreateVoucher(payload);
      dispatch(showModal({ isShowModal: false, modalType: null }));
      if(response.success){
        toast.success(response.message)
        dispatch(removeAllVoucher());
        reset();
      }else{
        toast.error(response.message)
      }

     
    };
  return (
    <div className="container-fluid">
      <div className="header row">
        <div className="left">
          <h1>Mã giảm giá</h1>
        </div>
      </div>
      <div className="bottom-data row">
        <div className='orders col'>
          <form onSubmit={handleSubmit(handleCreate)}>
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
            {voucher && selectType === 'products' &&
              <div className='my-3'>
                <VoucherTable
                voucher={voucher}
              />
              </div>
            }
            {voucher && selectType === 'categories' &&
              <div className='my-3'>
                <VoucherTableCategory
                voucher={voucher}
              />
              </div>
            }
            {voucher && selectType === 'users' &&
              <div className='my-3'>
                <VoucherTablePoint
                voucher={voucher}
              />
              </div>
            }
            </div>
                  
            <div className="d-flex justify-content-center text-center">
              <button type="submit" name="submit" className="btn btn-primary">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;