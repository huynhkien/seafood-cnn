import React, { useEffect, useState } from 'react'
import { InputForm } from '../../../../components/Index'
import { useForm } from 'react-hook-form';
import { apiGetReceipt, apiUpdateReceiptInfo } from '../../../../apis';
import { toast } from 'react-toastify';

const EditFormInfo = ({ receipt, editReceipt }) => {
   const [editInfo, setEditInfo] = useState(null);
   const [reload, setReload] = useState(null);
   const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
    // 
    useEffect(() => {
        reset({
         name: receipt?.exportedTo?.name || '',
         email: receipt?.exportedTo?.email || '',
         phone: receipt?.exportedTo?.phone || '',
         address: receipt?.exportedTo?.address || '',
        })
      }, [editInfo, reset])
      const handleUpdateInfo = async (info) => {
        const response = await apiUpdateReceiptInfo(editReceipt, info);
        if (response.success) {
          toast.success(response?.message);
          
          const updatedReceipt = await apiGetReceipt(editReceipt); 
          if (updatedReceipt.success) {
            setReload(updatedReceipt?.data)
          } else {
            toast.error(updatedReceipt?.message);
          }
          
          setEditInfo(null);
        } else {
          toast.error(response?.message);
        }
      };
    

  return (
    <div>
         {receipt?.exportedTo && receipt.type === 'Phiếu xuất' ? (
            <form className="card m-4" onSubmit={handleSubmit(handleUpdateInfo)}>
              <div className="card-header d-flex justify-content-between">
                <h5>Thông tin người nhận</h5>
                <span className='text-primary' style={{cursor: 'pointer'}} onClick={() => setEditInfo((prev) => !prev)}>
                  Chỉnh sửa
                </span>
              </div>
              <ul className="list-group list-group-flush">
                {editInfo ?
                (
                  <div className='px-3'>
                    <InputForm
                              placeholder='Tên khách hàng'
                              register={register}
                              errors={errors}
                              id='name'
                              validate={{ required: 'Thông tin thiếu' }}
                              className="form-control"
                          />
                  </div>
                )
                :
                (<li className="list-group-item">
                  <strong>Tên:</strong> {reload ? reload?.exportedTo?.name : receipt?.exportedTo?.name}
                </li>)
            }
            { editInfo ? 
              (
                <div className='px-3'>
                  <InputForm
                                placeholder='Email'
                                register={register}
                                errors={errors}
                                id='email'
                                validate={{ required: 'Thông tin thiếu' }}
                                className="form-control"
                            />
                </div>
              )
               :
              (<li className="list-group-item">
                <strong>Email:</strong> {reload ? reload?.exportedTo?.email : receipt?.exportedTo?.email}
              </li>)
            }
            {editInfo ?
                  (
                    <div className='px-3'>
                      <InputForm
                                  placeholder='Địa chỉ'
                                  register={register}
                                  errors={errors}
                                  id='address'
                                  validate={{ required: 'Thông tin thiếu' }}
                                  className="form-control"
                              />
                    </div>
                  )
                :
                  (<li className="list-group-item">
                    <strong>Địa chỉ:</strong> {reload ? reload?.exportedTo?.address : receipt?.exportedTo?.address}
                  </li>)
              }
              {editInfo ? 
                (
                  <div className='px-3 mb-3'>
                    <InputForm
                                placeholder='Số điện thoại'
                                register={register}
                                errors={errors}
                                id='phone'
                                validate={{ required: 'Thông tin thiếu' }}
                                className="form-control"
                            />
                   </div>
                )
                :
                (
                  <li className="list-group-item">
                  <strong>Số điện thoại:</strong> {reload ? reload?.exportedTo?.phone : receipt?.exportedTo?.phone}
                </li>
                )
              }
              {editInfo &&
                <button className='btn btn-primary m-3'>Cập nhật</button>
              }
              </ul>
            </form>
          )
          :
          null
          }
    </div>
  )
}

export default EditFormInfo