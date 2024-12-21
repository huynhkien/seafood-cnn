import React from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { InputForm, Select, MarkdownEditor, Loading } from "../../../components/Index";
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { apiDeleteDiscount, apiGetCategory, apiGetProduct, apiUpdateProduct } from '../../../apis';
import { getBase64, validate } from '../../../utils/helper';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux'; 
import { showModal } from '../../../store/app/appSlice';
import { MdCancel } from 'react-icons/md';
import { discountType, payMethod } from '../../../utils/contant';

const Page = ({updateProduct, setUpdateProduct, fetchProducts}) => {
    const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm();
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState(null);
    const [invalidFields, setInvalidFields] = useState([]);
    const [discount, setDiscount] = useState(false);
    const dispatch = useDispatch(); 

    const fetchCategories = async () => {
        const response = await apiGetCategory(); 
        if(response.success) setCategories(response.data);
    }
    const fetchProduct = async () => {
        const response = await apiGetProduct(updateProduct);
        if(response.success) setEditProduct(response.data);
    }
   useEffect(() => {
    console.log(editProduct)
   },[editProduct])

    useEffect(() => {
        fetchCategories();
        fetchProduct();
    }, []);
    useEffect(() => {
       reset({
        name: editProduct?.name || '',
        category: editProduct?.category || '',
        origin: editProduct?.origin || '',
        status:editProduct?.status || '',
        quantity:editProduct?.quantity || '',
        price:editProduct?.price || '',
        specifications:editProduct?.specifications || '',
        type: editProduct?.type || '',
        variant:editProduct?.variant || '',
        discountType:editProduct?.disCount?.discountType || '',
        value:editProduct?.disCount?.value || '',
        end_date:editProduct?.disCount?.end_date?.split("T")[0] || '',
        start_date:editProduct?.disCount?.start_date?.split("T")[0] || '',
       })
       setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join('') : editProduct?.description})
       setPreview({
            thumb: editProduct?.thumb?.url || '',
            images: editProduct?.images || [],
       })
    },[editProduct])

    const [payload, setPayload] = useState({
        description: '',
    });

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    });

    const changeValue = useCallback((e) => {
        setPayload(e);
    }, [payload]);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview({ ...preview, thumb: base64Thumb });
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
                toast.warning('File not supported');
                return;
            }
            const base64 = await getBase64(file);
            imagesPreview.push({ name: file.name, path: base64 });
        }
        if (imagesPreview.length > 0) setPreview(prev => ({ ...prev, images: imagesPreview }));
    }

    useEffect(() => {
        const thumbFile = watch('thumb');
        if (thumbFile && thumbFile[0]) handlePreviewThumb(thumbFile[0]);
    }, [watch('thumb')]);

    useEffect(() => {
        if(watch('images') instanceof FileList && watch('images').length > 0)
        handlePreviewImages(watch('images'))
    },[watch('images')])

    const handleUpdateProduct = async (data) => {
        const {discountType, start_date, end_date, value, ...setData} = data
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.name;
            const finalPayload = {
                ...setData,
                ...payload
            };
            
            const formData = new FormData();
            
            if (discount || editProduct?.disCount) {
                formData.append('disCount[discountType]', discountType);
                formData.append('disCount[value]', value);
                formData.append('disCount[start_date]', start_date);
                formData.append('disCount[end_date]', end_date);
            }
            for (let [key, value] of Object.entries(finalPayload)) {
                if (key === 'thumb' || key === 'images') continue;
                formData.append(key, value);
            }
            if (data.thumb && data.thumb[0]) {
                formData.append('thumb', data.thumb[0]);
            }
    
            if (data.images) {
                for (let file of data.images) {
                    formData.append('images', file);
                }
            }
    
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await apiUpdateProduct( formData, updateProduct); 
            dispatch(showModal({ isShowModal: false, modalType: null }));
    
            if (response.success) {
                toast.success(response.message)
                fetchProducts();
                reset();
                setPayload({
                    description: '',
                    thumb: null,
                    images: []
                });
                fetchProduct();
            }
        }
    }
    const handleDeleteDiscount = async() => {
        const response = await apiDeleteDiscount(updateProduct);
        if (response.success) {
            toast.success(response.message);
            fetchProduct();
    }else{
        toast.error(response.message);
    }
  }

    return (
        <div>
            <div className="header">
            <div className='position-absolute top-0 end-0'>
          <span onClick={() => setUpdateProduct(null)}><MdCancel color='red' fontSize={18}/></span>
        </div>
            </div>
            <div className="bottom-data">
                <div className="orders">
                    <div className="container">
                        <form method="post" action="" onSubmit={handleSubmit(handleUpdateProduct)}>
                            <div className="d-flex justify-content-between">
                                <InputForm
                                    label='Tên sản phẩm:'
                                    placeholder='Tên sản phẩm'
                                    register={register}
                                    errors={errors}
                                    id='name'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                                <span className="mx-2"></span>
                                <Select
                                    label='Danh mục:'
                                    options={categories?.map(el => ({ code: el.name, value: el.name }))}
                                    register={register}
                                    id='category'
                                    name='Choose Category'
                                    errors={errors}
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <InputForm
                                    label='Nguồn gốc:'
                                    placeholder='Nguồn gốc'
                                    register={register}
                                    errors={errors}
                                    id='origin'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                                <span className="mx-2"></span>
                                <InputForm
                                    label='Tình trạng:'
                                    placeholder='Tình trạng'
                                    register={register}
                                    errors={errors}
                                    id='status'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <InputForm
                                    label='Giá:'
                                    placeholder='Giá'
                                    type='number'
                                    register={register}
                                    errors={errors}
                                    id='price'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                                <span className="mx-2"></span>
                                <InputForm
                                    label='Quy cách:'
                                    placeholder='Quy cách'
                                    register={register}
                                    errors={errors}
                                    id='specifications'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <Select
                                        label='Hình thức bán:'
                                        options={payMethod?.map(el => ({ code: el.code, value: el.code }))}
                                        register={register}
                                        id='type'
                                        name='Chọn hình thức bán'
                                        errors={errors}
                                        validate={{
                                            required: 'Thông tin thiếu'
                                        }}
                                    />
                                <span className="mx-2"></span>
                                <InputForm
                                    label='Biến thể:'
                                    placeholder='Biến thể'
                                    register={register}
                                    errors={errors}
                                    id='variant'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                    
                                />
                            </div>
                            <div className="d-flex justify-content-start mt-2">
                                <span className="btn btn-primary" onClick={() => setDiscount(prev => !prev)}>Áp dụng giảm giá </span>
                                {editProduct?.disCount?.discountType &&
                                <span className="btn btn-danger mx-2" onClick={handleDeleteDiscount}>Xóa giảm giá </span>
                                }
                            </div>
                            {(discount || editProduct?.disCount?.discountType) &&
                            <div>
                                <div className="d-flex justify-content-between mt-2">
                                <Select
                                        label='Loại giảm giá'
                                        options={discountType?.map(el => ({ code: el.code, value: el.value }))}
                                        register={register}
                                        id='discountType'
                                        name='Chọn loại giảm giá'
                                        errors={errors}
                                        validate={{
                                            required: 'Thông tin thiếu'
                                        }}
                                    />
                                    <span className="mx-2"></span>
                                    <InputForm
                                        label='Giá trị:'
                                        type='number'
                                        register={register}
                                        errors={errors}
                                        id='value'
                                        validate={{
                                            required: 'Thông tin thiếu'
                                        }}
                                    />
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <InputForm
                                        label='Ngày bắt đầu:'
                                        type='date'
                                        register={register}
                                        errors={errors}
                                        id='start_date'
                                        validate={{
                                            required: 'Thông tin thiếu'
                                        }}
                                    />
                                    <span className="mx-2"></span>
                                    <InputForm
                                        label='Ngày kết thúc:'
                                        type='date'
                                        register={register}
                                        errors={errors}
                                        id='end_date'
                                        validate={{
                                            required: 'Thông tin thiếu'
                                        }}
                                    />
                                </div>
                            </div>
                            }
                            <fieldset className="mt-2">
                                <div className="body-title">Ảnh chính:</div>
                                <div className="upload-image flex-grow mt-2">
                                    <div className="item up-load w-50">
                                        <label className="uploadfile" htmlFor="thumb">
                                            <span className="icon">
                                                <FaCloudUploadAlt color="blue" />
                                            </span>
                                            <span className="body-text">Thêm ảnh chính cho sản phẩm</span>
                                            <input
                                                type='file'
                                                id='thumb'
                                                {...register('thumb')}
                                            />
                                        </label>
                                        {preview.thumb && <img className='img-upload' src={preview.thumb} alt="Preview" />}
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset className="mt-2">
                                <div className="body-title">Ảnh phụ:</div>
                                <div className="upload-image flex-grow mt-2">
                                    <div className="item up-load w-100">
                                        <label className="uploadfile" htmlFor="images">
                                            <span className="icon">
                                                <FaCloudUploadAlt color="blue" />
                                            </span>
                                            <span className="body-text">Chọn ctrl để thêm nhiều ảnh</span>
                                            <input
                                                type='file'
                                                id='images' 
                                                {...register('images')} 
                                                multiple
                                                
                                            />
                                        </label>
                                        {preview.images?.map((el,idx) => (
                                            <img  key={idx} src={el.url || el.path} alt='preview'/>
                                        ))}
                                    </div>
                                </div>
                            </fieldset>
                            <div className="mt-2">
                                <MarkdownEditor
                                    name='description'
                                    changeValue={changeValue}
                                    label='Mô tả:'
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    value={payload.description}
                                />
                            </div>
                            <button type="submit" name="submit" className="btn btn-primary mt-2">Cập nhật</button>
                        </form>
                    </div>
                </div>
           </div>
        </div>
    )
}
export default Page;
