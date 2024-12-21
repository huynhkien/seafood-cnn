import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { apiDeleteRating, apiGetProducts, apiGetUsers, apiReplyToComment } from "../../../apis";
import moment from 'moment';
import { FaEye, FaReply, FaTrash } from "react-icons/fa";
import { AdminReply, ReplyManager } from '../../Index';
import { toast } from 'react-toastify';
import { Button } from '../../../components/Index';
import { MdCancel } from 'react-icons/md';

const ProductCommentsTable = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showReply, setShowReply] = useState(null);
  const [isReply, setIsReply] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    const response = await apiGetProducts();
    if (response.success) {
      const flattenedProducts = response.data.flatMap(product => 
        product.ratings.map(rating => ({
          ...product,
          commentId: rating._id,
          comment: rating.comment,
          star: rating.star,
          postedBy: rating.postedBy,
          postedByName: rating.postedByName,
          updatedAt: rating.updatedAt
        }))
      );
      setProducts(flattenedProducts);
      console.log(products);
    }
    setLoading(false);
  };
  const fetchUsers =  async () => {
    const response = await apiGetUsers();
    if(response.success) setUsers(response?.userData);

  }

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);
  
  const formatDate = (rowData) => {
    return moment(rowData?.updatedAt).format('DD/MM/YYYY HH:mm');
    };
    const actionBodyTemplate = (rowData) => {
        return (
          <div>
            <button onClick={() => setShowReply({commentId: rowData.commentId, productId: rowData?._id  })} className="btn btn-xs btn-success">
              <FaEye/>
            </button>
            <span className='mx-2'></span>
            <button onClick={() => setIsReply({commentId: rowData.commentId, productId: rowData?._id, name: rowData?.postedByName })} className="btn btn-xs btn-primary">
              <FaReply/>
            </button>
            <span className='mx-2'></span>
            <button className="btn btn-xs btn-danger" onClick={() => handleDeleteRating(rowData?._id, rowData?.commentId)}>
              <FaTrash/>
            </button>
          </div>
        );
      };
      const commentBodyTemplate = (rowData) => {
        return (
            <textarea 
                value={rowData.comment} 
                readOnly
                rows="3"
                style={{ width: '100%', resize: 'none' }}
            />
        );
    };
    const handleDeleteRating = async(pid, rid) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
      const response = await apiDeleteRating(pid, rid);
      if (response.success) {
          toast.success(response.message);
          fetchProducts();
        } else {
          toast.error(response.message);
        }
    }
  }

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
        {showReply &&
            <div className='show-option shadow'>
                <ReplyManager
                    showReply={showReply}
                    setShowReply={setShowReply}
                />
            </div>
        }
        {isReply &&
            <div className='show-option shadow'>
                <AdminReply
                    isReply={isReply}
                    setIsReply={setIsReply}
                />
            </div>
        }
      <div className="header">
        <div className="left">
          <h1>Bình luận</h1>
        </div>
      </div>
      <div className="bottom-data">
        <div className="orders">
          <DataTable 
            value={products} 
            paginator 
            rows={10} 
            dataKey="commentId" 
            loading={loading} 
            emptyMessage="Không tìm thấy bình luận nào."
            header={header}
            globalFilter={globalFilter}
          >
            
            <Column field="postedByName" header="Tên người dùng" sortable />
            <Column body={commentBodyTemplate} header="Nội dung bình luận" sortable />
            {!isSmallScreen && <Column body={formatDate} header="Ngày" sortable sortField="updatedAt" />}
            {!isSmallScreen && <Column field="name" header="Tên sản phẩm" sortable />}
            <Column field="star" header="Đánh giá" sortable sortField="star" />
            <Column body={actionBodyTemplate} header="Phản hồi" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ProductCommentsTable;