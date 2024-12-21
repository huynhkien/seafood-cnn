import React from 'react'
import { useEffect, useState } from 'react';
import { apiGetProducts, apiDeleteProduct } from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaEdit, FaTrash } from "react-icons/fa";
import { RxValue } from "react-icons/rx";
import { toast } from 'react-toastify';
import { CiCirclePlus } from "react-icons/ci"
import AddProduct from './AddProduct';
import { EditProduct, Variant } from '../../Index';
const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [updateProduct, setUpdateProduct] =useState(null);
  const [addVariant, setAddVariant] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const fetchProducts = async () => {
    const response = await apiGetProducts();
    if (response.success) setProducts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.thumb?.url} alt={rowData.name} width={50} height={50} />;
  };
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button onClick={() => setUpdateProduct(rowData._id)} className="btn btn-xs btn-primary">
          <FaEdit/>
        </button>
        <span className='mx-1'></span>
        <button 
          onClick={() => handleDelete(rowData._id)} 
          className="btn btn-xs btn-danger"
        >
          <FaTrash/>
        </button>
        <span className='mx-1'></span>
        <span className="btn btn-xs btn-primary" onClick={() => setAddVariant(rowData?._id)}>
          <RxValue/>
        </span>
      </div>
    );
  };
  const quantityTemplate = (rowData) => {
    return (
      <div>
          <div>
            <span className='text-dark badge badge-primary'>{rowData?.variant}: </span>
            <span className='small'>{rowData?.quantity}</span>
          </div>
          {rowData?.variants.length > 0 &&
            <div>
              {rowData?.variants?.map(el => (
                <div key={el._id}>
                  <span className='text-dark badge badge-primary'>{el.variant}: </span>
                  <span className='small'>{el.quantity || 'Hết hàng'}</span>
                </div>
              ))}
            </div>
          
          }
      </div>
    )
  };

  const formatMoney = (rowData) => {
    return (
      <div>
        {rowData?.price?.toLocaleString()} VNĐ
      </div>
    )
  }
  

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const response = await apiDeleteProduct(id);

      if (response.success) {
        toast.success(response.mes);
        setLoading(true); 
        fetchProducts();
      } else {
        toast.error(response.mes);
      }
    }
  };

  const header = (
    <div className="p-inputgroup flex-1 my-2">
        <InputText type="text" placeholder="Tìm kiếm" className="p-inputtext p-component p-2" onChange={(e) => setGlobalFilter(e.target.value)} />
    </div>
  );

  return (
    <div>
        {
          updateProduct && 
          <div className='update-product shadow'>
            <EditProduct
              updateProduct={updateProduct}
              setUpdateProduct={setUpdateProduct}
              fetchProducts={fetchProducts}
            />
          </div>
        }
        {
          addVariant && 
          <div className='show-option shadow'>
            <Variant
              addVariant={addVariant}
              setAddVariant={setAddVariant}
              render={fetchProducts}
            />
          </div>
        }
      <div className="header">
        <div className="left">
          <h1>Sản phẩm</h1>
        </div>
      </div>
      <div className="bottom-data">
        <div className="orders">
          <a href={'/admin/manager-product/add-product'} className="btn btn-primary" style={{ marginBottom: '30px' }}>
            <i className="fa fa-plus"></i> Thêm sản phẩm
          </a>
          <DataTable 
            value={products} 
            paginator 
            rows={10} 
            dataKey="id" 
            loading={loading} 
            emptyMessage="No products found."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable field="name" header="Tên sản phẩm" />
            {!isSmallScreen && <Column body={imageBodyTemplate} header="Hình ảnh" sortable />}
            {!isSmallScreen && <Column sortable field="category" header="Danh mục" /> }
            <Column sortable body={quantityTemplate} header="Số lượng" />
            {!isSmallScreen && <Column sortable field="origin" header="Nguồn gốc" />}
            {!isSmallScreen && <Column sortable field="sold" header="Lượt mua" /> }
            <Column sortable body={formatMoney} header="Giá" />
            <Column body={actionBodyTemplate} header="Action" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Page;
