import { useEffect, useState } from 'react';
import { apiDeleteReceiptProductId, apiGetProduct, apiGetReceipt, apiGetReceipts, apiUpdateReceiptProductId } from "../../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MdCancel } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoIosAddCircleOutline } from "react-icons/io";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useForm } from 'react-hook-form';
import EditFormInfo from './EditFormInfo';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../../store/app/appSlice';

const EditFormProduct = ({ id, receipt, fetchReceipt }) => {
  const [product, setProduct] = useState(null);
  const [receipts, setReceipts] = useState(null);
  const [variants, setVariants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editReceipt, setEditReceipt] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(false);
  const { handleSubmit, reset, formState: { errors }, setValue, watch, register } = useForm();
  const dispatch = useDispatch();
  
  const fetchProduct = async () => {
    if (editReceipt?._id) {
      const response = await apiGetProduct(editReceipt.id);
      if (response.success) {
        setProduct(response.data);
  
        let variantsArray = response.data.variants || []; 
        variantsArray.push({ 
          sku: response.data.sku, 
          variant: response.data.variant, 
          price: response.data.price,
          thumb: response.data.thumb,
        });
        setVariants(variantsArray);
      }
    }
  };
  const fetchReceipts = async () => {
    const response = await apiGetReceipts();
    if(response.success) setReceipts(response?.data);
  }
  useEffect(() => {
    fetchReceipts();
  },[])
   
  

  useEffect(() => {
    if (editReceipt?._id) { 
      fetchProduct();
    }
  }, [id, editReceipt?._id]); 

  const handleVariantChange = (event) => {
    const variantSku = event.value; 
    const variant = variants.find(v => v.variant === variantSku);
    setSelectedVariant(variant);

    
    const isVariantExist = receipt?.products?.some((el) => 
      el.variant === variantSku && el.product === editReceipt.id &&
      !(el.product === editReceipt.id && el.variant === editReceipt.variant && el._id === editReceipt._id)
    );

    if (isVariantExist) {
      // Nếu variant đã tồn tại, hiển thị cảnh báo và reset
      alert("Variant này đã tồn tại trong đơn hàng!");
      setSelectedVariant(null);
      setValue('variant', editReceipt.variant);
      setValue('quantity', watch('quantity') || 0);
      setValue('price', watch('price') || 0);
      setValue('totalPrice', (watch('price') || 0) * (watch('quantity') || 0));
      return;
    }
    const productInReceipt = receipt?.products.find((el) => el._id === editReceipt._id);
  
    setValue('variant', variantSku);
    setValue('price', variant.price || productInReceipt.price);
    setValue('quantity', watch('quantity') || productInReceipt.quantity);
    setValue('totalPrice', variant.price * (watch('quantity') || productInReceipt.quantity));
    setValue('thumb', variant.thumb || productInReceipt.thumb)
  };
  
  // Hàm cập nhật
  const handleUpdate = async (data) => {
    console.log(data)
    const payload = {
      name: editReceipt?.name,
      variant: data?.variant,
      quantity: data?.quantity,
      price: data?.price,
      totalPrice: data?.totalPrice,
      product: editReceipt?.id,
      thumb: data.thumb
    };
    if(receipt?.type === 'Phiếu xuất'){
      const response = receipts?.filter(receipt => 
        receipt.type === 'Phiếu nhập' && 
        receipt?.products?.some(product => product.product === payload?.product && product.quantity > payload.quantity)
      );
      if(response.length === 0){
        alert('Không đủ số lượng sản phẩm cho phiếu xuất. Hãy thay đổi số lượng phù hợp với số lượng sản phẩm có trong kho');
        return;
      }
    }
    if (editReceipt) {
      dispatch(showModal({ isShowModal: true, modalType: 'loading' })); 
      const response = await apiUpdateReceiptProductId(id, editReceipt?._id, payload);
      dispatch(showModal({ isShowModal: false, modalType: null }));
      if (response.success) {
        toast.success(response.message);
        await fetchReceipt(); 
        reset(); 
        setEditReceipt(null); 
        setSelectedVariant(null); 
      } else {
        toast.error(response.message);
      }
    }
  };
  // Hàm xóa
  const handleDelete = async (rid, _id) => {
      const response = await apiDeleteReceiptProductId(rid, _id);
      if (response.success) {
        toast.success(response.message);
  
        await fetchReceipt(); 
        reset(); 
      } else {
        toast.error(response.message);
      }
    };
  
  

  // Hàm hiển thị hình ảnh trong cột
  const imageBodyTemplate = (rowData) => {
    if (editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant && editReceipt._id ===rowData._id) {
      
      const imageUrl = selectedVariant ? selectedVariant?.thumb?.url : rowData?.thumb?.url;
      return <img src={imageUrl} alt={rowData.product} style={{ width: '50px', height: '50px' }} />;
    } else {
      return <img src={rowData?.thumb?.url} alt={rowData.product} style={{ width: '50px', height: '50px' }} />;
    }
  };

  // Lọc sản phẩm dựa trên globalFilter
  const filteredProducts = receipt?.products.filter((product) => {
    const nameMatch = product?.name?.toLowerCase().includes(globalFilter.toLowerCase());
    const variantMatch = product?.variant?.toLowerCase().includes(globalFilter.toLowerCase());
    return nameMatch || variantMatch;
  }) || [];

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        {editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant ? (
          <div className="btn btn-xs btn-primary position-relative">
            <button><IoIosAddCircleOutline /></button>
            <span className='icon-edit-receipt' onClick={() => {
                setEditReceipt(null); 
                reset(); 
                setSelectedVariant(null); 
          }}>
              <MdCancel />
            </span>
          </div>
        ) : (
          <button 
            className="btn btn-xs btn-primary" 
            onClick={() =>{ setEditReceipt({
              _id: rowData?._id,
              id: rowData?.product,
              variant: rowData?.variant,
              name: rowData?.name
            });
          }}
          >
            <FaEdit />
          </button>
        )}
        <span className='mx-2'></span>
        <button className="btn btn-xs btn-danger" onClick={() => handleDelete(receipt._id, rowData._id)}>
          <FaTrash />
        </button>
      </div>
    );
  };
  useEffect(() => {
    if (editReceipt) {
      const productInReceipt = receipt?.products.find((el) => el._id === editReceipt._id);
      if (productInReceipt) {
        setValue('variant', watch('variant') || productInReceipt.variant);
        setValue('quantity', watch('quantity') || productInReceipt.quantity);
        setValue('price', watch('price') || productInReceipt.price);
        setValue('totalPrice', (watch('price') || productInReceipt.price) * (watch('quantity') || productInReceipt.quantity));
        setValue('thumb', watch('thumb') || productInReceipt.thumb )
      }
    }
  }, [editReceipt, receipt, setValue, watch]);
  
  const quantityBodyTemplate = (rowData) => {
    return editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant ? (
      <InputNumber
        value={watch('quantity') || rowData.quantity} 
        onValueChange={(e) => {
          setValue('quantity', e.value);
          setValue('price', watch('price') || rowData.price)
          const currentPrice = watch('price') || rowData.price;
          const currentVariant = watch('variant') || rowData.variant;
          setValue('totalPrice', currentPrice * e.value);
          setValue('variant', currentVariant); 
        }} 
        placeholder="Số lượng"
        className="w-50"
      />
    ) : (
      rowData.quantity
    );
  };

  const variantBodyTemplate = (rowData) => {
    return editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant ? (
      <div className="card flex justify-content-center">
        <Dropdown 
          value={watch('variant') || rowData.variant} 
          onChange={handleVariantChange} 
          options={variants?.map((el) => ({
            variant: el.variant, 
            value: el.variant
          }))} 
          optionLabel="variant" 
          className="w-full md:w-14rem" 
        />
      </div>
    ) : rowData.variant; 
  };
  const priceBodyTemplate = (rowData) => {
    return editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant ? (
      watch('price')?.toLocaleString()|| rowData?.price?.toLocaleString()
    ) : (
      rowData?.price?.toLocaleString() 
    );
  };

  const totalPriceBodyTemplate = (rowData) => {
    return editReceipt && editReceipt.id === rowData.product && editReceipt.variant === rowData.variant ? (
      (watch('totalPrice'))?.toLocaleString() || rowData?.totalPrice?.toLocaleString() 
    ) : (
      rowData?.totalPrice?.toLocaleString()
    );
  };
  

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

  return (
    <div className="bottom-data">
      <div className="orders">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Chi tiết</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(handleUpdate)}>
              <DataTable
                value={filteredProducts}
                paginator
                rows={10}
                dataKey="id"
                emptyMessage="Không tìm thấy sản phẩm."
                header={header}
              >
                <Column sortable field="name" header="Sản phẩm" />
                <Column body={imageBodyTemplate} header="Ảnh" />
                <Column sortable field="variant" header="Biến thể" body={variantBodyTemplate} />
                <Column 
                  sortable 
                  field="quantity" 
                  header="Số lượng"
                  body={quantityBodyTemplate}
                />
                <Column body={priceBodyTemplate} header="Giá" />
                <Column body={totalPriceBodyTemplate} header="Tổng tiền" />
                <Column body={actionBodyTemplate} header="Action" />
              </DataTable>
            </form>
          </div>
          { receipt?.type === 'Phiếu xuất' &&
          <div>

            <EditFormInfo
            receipt={receipt}
            editReceipt={id}
            />
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default EditFormProduct;
