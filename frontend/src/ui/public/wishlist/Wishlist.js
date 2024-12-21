import { useEffect, useState } from 'react';
import { apiGetProduct, apiUpdateWishList } from "../../../apis";  
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux'; 
import { Breadcrumb } from '../../../components/Index';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';  
import { removeFromWishList } from '../../../store/user/userSlice';  

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const { current } = useSelector(state => state.user);
  const dispatch = useDispatch(); 

  const fetchProduct = async (id) => {
    const response = await apiGetProduct(id);
    return response.success ? response.data : null;
  };

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (current?.wishlist?.length) {
        const productPromises = current.wishlist.map(id => fetchProduct(id));
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter(product => product !== null));
      }
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [current?.wishlist]);

  const handleDelete = async (productId) => {
    const response = await apiUpdateWishList(productId, 'remove');
    if (response.success) {
      dispatch(removeFromWishList(productId));
      setProducts(products.filter(product => product._id !== productId));
      toast.success(response.mes);
    } else {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <button 
          onClick={() => handleDelete(rowData._id)} 
          className="btn btn-xs btn-danger"
        >
          <FaTrash/>
        </button>
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return <a href={`/detail/${rowData?._id}`}><img src={rowData?.thumb?.url} alt={rowData?.name} width={50} height={50} /></a>;
  };
  const nameBodyTemplate = (rowData) => {
    return <a style={{color:'black'}} href={`/detail/${rowData?._id}`}>{rowData?.name}</a>;
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
    <div>
      <Breadcrumb category='Sản phẩm yêu thích' />
      <div className="wishlist">
        <div className="wishlist-body">
          <DataTable
            value={products}
            paginator
            rows={10}
            dataKey="_id"
            loading={loading}
            emptyMessage="Không có sản phẩm nào."
            header={header}
            globalFilter={globalFilter}
          >
            <Column sortable body={nameBodyTemplate} header="Sản Phẩm" />
            <Column sortable body={imageBodyTemplate} header="Hình ảnh" />
            <Column sortable field="category" header="Danh mục" />
            <Column sortable field="origin" header="Nguồn gốc" />
            <Column sortable body={actionBodyTemplate} header="Hủy yêu thích" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
