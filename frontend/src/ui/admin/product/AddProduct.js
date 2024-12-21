import { FaCloudUploadAlt } from "react-icons/fa";
import { InputForm, Select, MarkdownEditor } from "../../../components/Index";
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { apiCreateProduct, apiGetCategory } from '../../../apis';
import { getBase64, validate } from '../../../utils/helper';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux'; 
import { showModal } from '../../../store/app/appSlice';
import {discountType, payMethod} from '../../../utils/contant';

const AddProduct = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [categories, setCategories] = useState(null);
    const [invalidFields, setInvalidFields] = useState([]);
    const [discount, setDiscount] = useState(false);
    const dispatch = useDispatch();


    const fetchCategories = async () => {
        const response = await apiGetCategory(); 
        if(response.success) setCategories(response.data);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

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
        const imageFiles = watch('images');
        if (imageFiles && imageFiles.length > 0) handlePreviewImages(imageFiles);
    }, [watch('images')]);

    const handleCreateProduct = async (data) => {
        const {discountType, start_date, end_date, value, ...setData} = data
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if (data.category) data.category = categories?.find(el => el._id === data.category)?.name;
            const finalPayload = {
                ...setData,
                ...payload
            };
            
            const formData = new FormData();
            
            if (discount) {
                formData.append('disCount[discountType]', discountType);
                formData.append('disCount[value]', value);
                formData.append('disCount[start_date]', start_date);
                formData.append('disCount[end_date]', end_date);
            }
            for (let i of Object.entries(finalPayload)) {
                if (i[0] !== 'thumb' && i[0] !== 'images') {
                    formData.append(i[0], i[1]);
                }
            }
            // Xử lý files
            if (finalPayload.thumb) {
                formData.append('thumb', finalPayload.thumb[0]);
            }
            if (finalPayload.images) {
                for (let image of finalPayload.images) {
                    formData.append('images', image);
                }
            }
            dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
            const response = await apiCreateProduct(formData);
            dispatch(showModal({ isShowModal: false, modalType: null }));
            if (response.success) {
                toast.success(response.message);
                reset();
                setPayload('')
                setPreview({
                    thumb: null,
                    images: []
                });
            } else {
                toast.error(response.message);
            }
        }
    }
    

    return (
        <div>
            <div className="header">
                <div className="left">
                    <h1>Sản phẩm</h1>
                </div>
            </div>
            <div className="bottom-data">
                <div className="orders">
                    <div className="container">
                        <form method="post" action="" onSubmit={handleSubmit(handleCreateProduct)}>
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
                                <Select
                                    label='Danh mục:'
                                    options={categories?.map(el => ({ code: el.name, value: el.name }))}
                                    register={register}
                                    id='category'
                                    name='Chọn danh mục'
                                    errors={errors}
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between mt-2">
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
                                        options={payMethod?.map(el => ({ code: el.code, value: el.value }))}
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
                            <div className="d-flex justify-content-between mt-2">
                                <span className="btn btn-primary mt-2" onClick={() => setDiscount(prev => !prev)}>Áp dụng giảm giá </span>
                            </div>
                            {discount &&
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
                                                {...register('thumb', {required: 'Thiếu ảnh'})}
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
                                                {...register('images', {required: 'Thiếu ảnh'})} 
                                                multiple
                                            />
                                        </label>
                                        {preview.images?.map((el,idx) => (
                                                <img key={idx} src={el.path} alt='preview'/>
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
                                />
                            </div>
                            <button type="submit" name="submit" className="btn btn-primary mt-2">Thêm</button>
                        </form>
                    </div>
                </div>
           </div>
        </div>
    )
}
export default AddProduct;
