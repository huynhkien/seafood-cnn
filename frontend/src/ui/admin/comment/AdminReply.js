import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { apiDeleteReplyId, apiGetProducts, apiGetReceipts, apiGetReplies, apiGetRepliesAdmin, apiGetReplyId, apiGetUsers, apiReplyToComment, apiUpdateReply } from "../../../apis";
import moment from 'moment';
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import useDebounce from '../../../hook/useDebounce';

const ProductCommentsTable = ({isReply, setIsReply}) => {
  const [replies, setReplies] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isEditReply, setIsEditReply] = useState(null);
  const [selectRepId, setSelectRepId] = useState(null);
  const {current} = useSelector(state => state.user);
  const fetchRepliesAdmin = async () => {
    const response = await apiGetRepliesAdmin(isReply?.productId, isReply?.commentId, current?._id);
    if(response.success) setReplies(response?.data);
  }
  const fetchReplyId = async () => {
    const response = await apiGetReplyId(isReply?.productId, isReply?.commentId, selectRepId);
    if (response.success) {
      setIsEditReply(response?.data); 
      setReplyText(response?.data.comment); 
    }
  };

  useEffect(() => {
    if (isReply) {
      fetchRepliesAdmin();
    }
  }, [isReply]);;
  useEffect(() => {
    if (selectRepId) {
        fetchReplyId();
    }
  }, [selectRepId]);
  const formatDate = (rowData) => {
    return moment(rowData?.createdAt).format('DD/MM/YYYY HH:mm');
    };
   
    const actionBodyTemplate = (rowData) => {
        return (
          <div className='position-relative'>
            <button onClick={() => setSelectRepId(rowData?._id)} className="btn btn-xs btn-primary">
              <FaEdit/>
            </button>
            {selectRepId === rowData?._id && (
                <span onClick={() => { setSelectRepId(null); setIsEditReply(null); setReplyText(''); }} className='reply-cancel'>
                    <MdCancel />
                </span>
             )}
            <span className='mx-2'></span>
            <button className="btn btn-xs btn-danger" onClick={() => handleDeleteReply(rowData?._id)}>
              <FaTrash/>
            </button>
          </div>
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

  const value = useDebounce(replyText, 1000);
  const handleAddReply = async () => {
    const uid = current?._id ? current?._id : null;
    
    if (value) { 
      const response = await apiReplyToComment(isReply?.productId, isReply?.commentId, { parentCommentId: isReply?.name, postedByName: current?.name, comment: value, postedBy: uid });
      if (response.success) {
        toast.success(response.message);
        setReplyText('');
        fetchRepliesAdmin();
      } else {
        toast.error(response.message);
      }
    }else{
        alert('Vui lòng nhập phản hồi')
    }
  };
  const handleUpdateReply = async() => {
    if(value){
    const response = await apiUpdateReply(isReply?.productId, isReply?.commentId, selectRepId, {comment: value});
    if (response.success) {
        toast.success(response.message);
        setReplyText('');
        setIsEditReply(null)
        setSelectRepId(null);
        fetchRepliesAdmin();
      } else {
        toast.error(response.message);
      }
    }else{
        alert('Vui lòng nhập phản hồi')
    }
  }
  const handleDeleteReply = async(id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
    const response = await apiDeleteReplyId(isReply?.productId, isReply?.commentId, id);
    if (response.success) {
        toast.success(response.message);
        fetchRepliesAdmin();
      } else {
        toast.error(response.message);
      }
  }
}
  
  return (
    <div>
      <div className='position-absolute top-0 end-0'>
        <span onClick={() => setIsReply(null)}><MdCancel color='primary' fontSize={25}/></span>
      </div>
      <div className="bottom-data">
        <div className="vote-option-container reply-cus shadow">
                <textarea
                    className="comment-textarea"
                    placeholder="Viết phản hồi của bạn ở đây..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <button onClick={isEditReply ? handleUpdateReply : handleAddReply} className='reply-button'>{isEditReply ? 'Cập nhật phản hồi' : 'Phản hồi khách'}</button>
        </div>
        <div className="orders">
          <DataTable 
            value={replies} 
            paginator 
            rows={10} 
            dataKey="commentId" 
            emptyMessage="Không tìm thấy bình luận nào."
            header={header}
            globalFilter={globalFilter}
          >
            <Column body={commentBodyTemplate} header="Phản hồi" sortable />
            <Column field="parentCommentId" header="Tên khách" sortable />
            <Column body={formatDate} header="Ngày" sortable />
            <Column body={actionBodyTemplate} header="Hành động" sortable />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ProductCommentsTable;