import { useEffect, useState } from 'react';
import { apiGetCategory, apiDeleteCategory } from "../../../apis";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import {EditCategory} from '../../Index';
import path from '../../../utils/path';


const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);


  const fetchCategories = async () => {
    const response = await apiGetCategory();
    if (response.success) setCategories(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.image?.url} alt={rowData.name} width={50} height={50} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button onClick={() => setEditCategory(rowData._id)} className="btn btn-xs btn-primary">
          <FaEdit/>
        </button>
        <span className='mx-2'></span>
        <button 
          onClick={() => handleDelete(rowData._id)} 
          className="btn btn-xs btn-danger"
        >
          <FaTrash/>
        </button>
      </div>
    );
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      const response = await apiDeleteCategory(categoryId);

      if (response.success) {
        toast.success('Xóa danh mục thành công');
        setLoading(true); 
        fetchCategories(); 
      } else {
        toast.error('Xóa danh mục không thành công');
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
      {editCategory && (
                <div className='edit-category shadow'>
                    <EditCategory  
                      editCategory={editCategory}
                      setEditCategory={setEditCategory}
                      fetchCategories={fetchCategories}
                    />
                </div>
            )}
      <div className="header">
        <div className="left">
          <h1>Danh Mục</h1>
        </div>
      </div>
      <div className="bottom-data">
        <div className="orders">
          <a href={`/admin/manager-category/add-category`} className="btn btn-primary" style={{ marginBottom: '30px' }}>
            <i className="fa fa-plus"></i> Thêm danh mục
          </a>
          <DataTable 
            value={categories} 
            paginator 
            rows={10} 
            dataKey="id" 
            loading={loading} 
            emptyMessage="No categories found."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable field="name" header="Tên" />
            {!isSmallScreen && <Column sortable body={imageBodyTemplate} header="Hình ảnh" />}
            <Column sortable field="description" header="Mô tả" />
            <Column body={actionBodyTemplate} header="Action" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Page;
