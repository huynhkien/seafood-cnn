import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputForm, Select } from "../../../components/Index";
import { roles } from '../../../utils/contant';
import { getBase64 } from '../../../utils/helper';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { apiCreateRole } from '../../../apis';
import { toast } from 'react-toastify';
import {showModal} from '../../../store/app/appSlice'
import { useDispatch } from 'react-redux';

const Add = () => {
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();

  const handleCreate = async (data) => {
    const formData = new FormData();
    for (let i of Object.entries(data)) {
        formData.append(i[0], i[1]);
    }
   
    dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
    const response = await apiCreateRole(formData);
    dispatch(showModal({ isShowModal: false, modelType: null }));
    if(response.success){
        toast.success(response.message)
        reset();
    }else{
        toast.error(response.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="header row">
        <div className="left">
          <h1>Phân quyền</h1>
        </div>
      </div>
      <div className="bottom-data row">
        <div className='orders col'>
          <form onSubmit={handleSubmit(handleCreate)}>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <InputForm
                  label='Tên nhân viên:'
                  placeholder='Tên nhân viên'
                  register={register}
                  errors={errors}
                  id='name'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-6">
                <InputForm
                  label='Địa chỉ email:'
                  placeholder='Địa chỉ email'
                  register={register}
                  errors={errors}
                  id='email'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <InputForm
                  label='Địa chỉ:'
                  placeholder='Địa chỉ'
                  register={register}
                  type='text'
                  errors={errors}
                  id='address'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
              <div className="col-md-6">
                <InputForm
                  label='Số điện thoại'
                  placeholder='Số điện thoại'
                  register={register}
                  errors={errors}
                  id='phone'
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between row mb-3'>
              <div className="col-md-6">
                <Select
                  label='Quyền hạn:'
                  options={roles?.map(el => ({ code: el.code, value: el.value }))}
                  name='Lựa chọn quyền'
                  register={register}
                  id='role'
                  errors={errors}
                  validate={{
                    required: 'Thông tin thiếu'
                  }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center text-center mt-3">
              <button type="submit" name="submit" className="btn btn-primary">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;
