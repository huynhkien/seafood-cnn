import { FaCloudUploadAlt } from "react-icons/fa";
import { InputForm, Loading} from "../../../components/Index";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { apiGetProduct, apiCreateVariant, apiDeleteVariant, apiGetVariantId, apiUpdateVariantId } from '../../../apis';
import { getBase64, validate } from '../../../utils/helper';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux'; 
import { showModal } from '../../../store/app/appSlice';
import { MdCancel } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

const Variant = ({addVariant, setAddVariant, render}) => {
    const { register, handleSubmit,formState: { errors }, watch, reset } = useForm();
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [editVariant, setEditVariant] = useState(null);
    const [variantId, setVariantId] = useState(null);
    const dispatch = useDispatch(); 
    const fetchProduct = async () => {
        const response = await apiGetProduct(addVariant);
        if (response.success) setEditProduct(response.data);
        setLoading(false);
        }
    
   

    useEffect(() => {
        fetchProduct();
    }, []);
    
    // Xử lý ảnh

    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePreviewThumb = async (file) => {
        const base64Thumb = await getBase64(file);
        setImagePreview(base64Thumb);
    };

    const handleThumbChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            handlePreviewThumb(file);
        }
    };
    // Thêm
    const handleCreateVariant = async (data) => {
            const payload = new FormData();
            payload.append('variant', data.variant);
            payload.append('price', data.price);
            if (selectedFile) {
                payload.append('thumb', selectedFile);
            }
            const response = await apiCreateVariant(payload, addVariant);
            if(response.success){
                toast.success(response.message);
                fetchProduct();
                reset();
            }else{
                toast.error(response.message);
            }
    };
    // Xóa
    const handleDelete = async (productId, variantId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa biến thể này?')) {
                const response = await apiDeleteVariant(productId, variantId);
    
                if (response.success) {
                    toast.success(response.message);
                    fetchProduct(); 
                } else {
                    toast.error(response.message);
                }
        }
      };
    // Cập nhật


    useEffect(() => {
        console.log(editProduct)
        const fetchVariantData = async () => {
            if (editVariant) {
                const response = await apiGetVariantId(addVariant, editVariant);
                if (response.success) {
                    setVariantId(response?.data);
                    reset({
                        variant: response?.data?.variant,
                        price: response?.data?.price,
                        thumb: response?.data?.thumb?.url,
                    });
                    setImagePreview(response?.data?.thumb?.url)
                }
            }
        };
        fetchVariantData();
    }, [addVariant, editVariant, reset]);
    const handleUpdate = async(data) => {
        const payload = new FormData();
        payload.append('variant', data?.variant);
        payload.append('price', data?.price);
        if (selectedFile) {
            payload.append('thumb', selectedFile);
        }
        console.log(...payload)
        const response = await apiUpdateVariantId(addVariant, editVariant, payload);
        if(response.success) {
            toast.success(response.message)
            fetchProduct();
        }else{
            toast.error(response.message)
        }
    }
    const imageBodyTemplate = (rowData) => {
       return (<img src={rowData?.thumb?.url} alt={rowData?.name} width={50} height={50} />)
      };
    
      const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                {editVariant === rowData?._id ? (
                    <div className="d-flex align-items-center position-relative">
                        <span
                            className="btn btn-xs btn-primary me-2" 
                        >
                            <IoIosAddCircleOutline/>
                        </span>
                        <span className='icon-edit-receipt' onClick={() => {
                            setEditVariant(null);
                            reset({  
                                variant: '',
                                price: '',
                                thumb: null, 
                            });
                            setImagePreview(null);
                        }}>
                            <MdCancel />
                        </span>
                    </div>
                ) : (
                    <span 
                    onClick={() => {
                        setEditVariant(rowData?._id); 
                    }}
                        className="btn btn-xs btn-primary me-2"
                    >
                        <FaEdit/>
                    </span>
                )}
                <span 
                    onClick={() => handleDelete(addVariant, rowData?._id)} 
                    className="btn btn-xs btn-danger"
                >
                    <FaTrash/>
                </span>
            </div>
        );
    };
    
      const header = (
        <div className="p-inputgroup flex-1 my-2">
            <InputText type="text" placeholder="Tìm kiếm" className="p-inputtext p-component p-2" onChange={(e) => setGlobalFilter(e.target.value)} />
        </div>
      );
    return (
        <div>
            <div className='position-absolute top-0 end-0'>
                <span onClick={() => setAddVariant(null)}><MdCancel color='primary' fontSize={25}/></span>
            </div>
            <div className="bottom-data">
                <div className="orders">
                    <div className="container">
                        {editProduct &&
                        <input
                          className="form-control my-2"
                          value={editProduct?.name} 
                        />
                        }
                        <form method="post" action="" onSubmit={editVariant ? handleSubmit(handleUpdate) : handleSubmit(handleCreateVariant)}>
                            <div className="d-flex justify-content-between">
                                <InputForm
                                    label='Tên biến thể:'
                                    placeholder='Tên biến thể'
                                    register={register}
                                    errors={errors}
                                    id='variant'
                                    validate={{
                                        required: 'Thông tin thiếu'
                                    }}
                                />
                                <span className="mx-2"></span>
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
                            </div>
                            <fieldset className="mt-3">
                                <div className="body-title">Tải ảnh:</div>
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
                                                validate={{
                                                    required: 'Thông tin thiếu'
                                                }}
                                                onChange={handleThumbChange}
                                            />
                                        </label>
                                        {imagePreview && (
                                            <img className="img-upload" src={imagePreview} alt="Preview" />
                                        )}
                                    </div>
                                </div>
                            </fieldset>
                            <button type="submit" name="submit" className="btn btn-primary mt-3">{editVariant? 'Cập nhật' : 'Thêm biến thể'}</button>
                        </form>
                    </div>
                </div>
           </div>
           <div className="bottom-data">
            <div className="orders">
            <DataTable
                value={editProduct?.variants }  
                paginator
                rows={10}
                dataKey="_id" 
                loading={loading}
                emptyMessage="No products found."
                header={header}
                globalFilter={globalFilter}
            >
                <Column sortable field="sku" header="Mã" />
                <Column sortable field="variant" header="Tên biến thể" />
                <Column sortable field="price" header="Giá" />
                <Column body={imageBodyTemplate} header="Hình ảnh" />
                <Column body={actionBodyTemplate} header="Action" />
            </DataTable>

            </div>
        </div>
        </div>
    )
}
export default Variant;
