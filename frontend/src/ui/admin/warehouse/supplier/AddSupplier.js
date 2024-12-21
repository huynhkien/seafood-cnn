import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiCreateSupplier} from '../../../../apis';
import {InputForm, Select} from "../../../../components/Index"
import { useDispatch } from 'react-redux';
import {status} from '../../../../utils/contant';
import { MdCancel } from 'react-icons/md';
import { showModal } from '../../../../store/app/appSlice';

const AddSupplier = ({setShowSupplier, showSupplier, onSuccessAdd}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();


  const handleCreate = async (data) => {
    try{
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await apiCreateSupplier(data);
        dispatch(showModal({ isShowModal: false, modalType: null }));

            toast.success(response.message);
            reset();
            onSuccessAdd();
    }catch(response){
        toast.error(response.message);
            reset();
    }
  };

  return (
    <div>
        <span onClick={() =>setShowSupplier(false) } className='position-absolute top-0 end-0'><MdCancel fontSize='25'/></span>
       <div className="wg-box bg-light">
        <form className="form-new-product form-style-1" onSubmit={handleSubmit(handleCreate)} >
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
                placeholder='email'
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
                }}/>
          <div className="d-flex justify-content-center text-center">
            <button type="submit" name="submit" className="btn btn-primary ">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
