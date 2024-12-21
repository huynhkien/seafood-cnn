import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiGetSupplier, apiUpdateSupplier } from '../../../../apis';
import { InputForm, Select } from "../../../../components/Index";
import { status } from '../../../../utils/contant';
import { MdCancel } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../../store/app/appSlice';

const EditSupplier = ({ setEditSupplier, editSupplier,  onUpdateSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [supplier, setSupplier] = useState(null);
  const dispatch = useDispatch();

  const fetchSupplier = async () => {
    const response = await apiGetSupplier(editSupplier);
    if (response.success) setSupplier(response.data);
  };

  useEffect(() => {
    fetchSupplier();
  }, [editSupplier]);

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier?.name || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        address: supplier?.address || '',
        status: supplier?.status || ''
      });
    }
  }, [supplier, reset]);

  const handleUpdate = async (data) => {
    try {
      dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
      const response = await apiUpdateSupplier(editSupplier, data);
      dispatch(showModal({ isShowModal: false, modalType: null }));

      toast.success(response.message);
      reset(); 
      onUpdateSuccess(); 
    } catch (error) {
      toast.error(error.message);
      reset();
    }
  };

  return (
    <div>
      <span onClick={() => setEditSupplier(null)} className='position-absolute top-0 end-0'>
        <MdCancel fontSize='25' />
      </span>
      <div className="wg-box bg-light">
        <form className="form-new-product form-style-1" onSubmit={handleSubmit(handleUpdate)}>
          <InputForm
            label='Tên nhà cung cấp:'
            placeholder='Tên nhà cung cấp'
            register={register}
            errors={errors}
            id='name'
            validate={{
              required: 'Thông tin thiếu'
            }}
          />
          <InputForm
            label='Email:'
            placeholder='Email'
            register={register}
            errors={errors}
            id='email'
            validate={{
              required: 'Thông tin thiếu',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ"
              }
            }}
          />
          <InputForm
            label='Địa chỉ:'
            placeholder='Địa chỉ'
            register={register}
            errors={errors}
            id='address'
            validate={{
              required: 'Thông tin thiếu'
            }}
          />
          <InputForm
            label='Số điện thoại:'
            placeholder='Số điện thoại'
            register={register}
            errors={errors}
            id='phone'
            validate={{
              required: 'Thông tin thiếu',
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ"
              }
            }}
          />
          <Select
            label='Danh mục:'
            options={status?.map(el => ({ code: el.code, value: el.value }))}
            register={register}
            id='status'
            name='Trạng thái'
            errors={errors}
            validate={{
              required: 'Thông tin thiếu'
            }}
          />
          <div className="d-flex justify-content-center text-center">
            <button type="submit" name="submit" className="btn btn-primary">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
