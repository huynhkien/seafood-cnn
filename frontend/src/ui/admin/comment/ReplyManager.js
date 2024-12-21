import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { apiDeleteReplyId, apiGetProducts, apiGetReceipts, apiGetReplies, apiGetReplyId, apiGetUsers, apiReplyToComment, apiUpdateReply } from "../../../apis";
import moment from 'moment';
import { FaAddressBook, FaEdit, FaList, FaPlus, FaReply, FaTrash } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import useDebounce from '../../../hook/useDebounce';

const ProductCommentsTable = ({showReply, setShowReply}) => {
  const [replies, setReplies] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectRepId, setSelectRepId] = useState(null);
  const [selectEditRepId, setSelectEditRepId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showOption, setShowOption] = useState(false);
  const {current} = useSelector(state => state.user);

  console.log(showReply)

  const fetchReplies = async () => {
    const response = await apiGetReplies(showReply?.productId, showReply?.commentId);
    if(response.success) setReplies(response?.data);
  }
  useEffect(() => {
    if (showReply) {
      fetchReplies();
    }
  }, [showReply]);
  const value = useDebounce(replyText, 1000);
  const handleAddReply = async () => {
    const uid = current?._id ? current?._id : null;
    
    if (value) { 
      const response = await apiReplyToComment(showReply?.productId, showReply?.commentId, { parentCommentId: selectRepId?.postedByName, postedByName: current?.name, comment: value, postedBy: uid });
      if (response.success) {
        toast.success(response.message);
        setReplyText('');
        fetchReplies();
      } else {
        toast.error(response.message);
      }
    }else{
        alert('Vui lòng nhập phản hồi')
    }
  };
  const formatDate = (rowData) => {
    return moment(rowData?.createdAt).format('DD/MM/YYYY HH:mm');
    };
   
    const actionBodyTemplate = (rowData) => {
        return (
          <div className='position-relative'>
            {showOption === rowData?._id && (
                <div className='show-item  shadow'>
                  {selectRepId?.id === rowData?._id ?
                  (<>
                    <button 
                    className="show-item-list btn btn-xs btn-primary"
                    onClick={handleAddReply}
                  >
                    <FaPlus />
                  </button>
                    <span onClick={() => setSelectRepId(null)} className='reply-cancel'><MdCancel/></span>
                    </>)
                    :
                    (
                      <button 
                    className="show-item-list btn btn-xs btn-primary"
                    onClick={() => setSelectRepId({id: rowData?._id, postedByName: rowData?.postedByName})}
                  >
                    <FaReply />
                  </button>
                    )
                  }
                  {selectEditRepId?.id === rowData?._id ?
                  (<>
                    <button 
                    className="show-item-list btn btn-xs btn-primary"
                    onClick={handleUpdateReply}
                  >
                    <FaEdit />
                  </button>
                    <span onClick={() => setSelectEditRepId(null)} className='reply-edit-cancel'><MdCancel/></span>
                    </>)
                    :
                    (
                      <button 
                    className="show-item-list btn btn-xs btn-primary"
                    onClick={() => {setSelectEditRepId({id: rowData?._id, postedByName: rowData?.postedByName}); setReplyText(rowData.comment);}}
                  >
                    <FaEdit />
                  </button>
                    )
                  }
              </div>
             )}
              <button onClick={() => {setShowOption(prev => prev === rowData?._id ? null : rowData?._id ); setSelectRepId(null);} } className="btn btn-xs btn-primary">
              <FaList/>
            </button>
            <span className='mx-2'></span>
            <button className="btn btn-xs btn-danger" onClick={() => handleDeleteReply(rowData?._id)}>
              <FaTrash/>
            </button>
          </div>
        );
      };
      const handleUpdateReply = async() => {
        if(value){
        const response = await apiUpdateReply(showReply?.productId, showReply?.commentId, selectEditRepId?.id, {comment: value});
        if (response.success) {
            toast.success(response.message);
            setSelectEditRepId(null);
            fetchReplies();
          } else {
            toast.error(response.message);
          }
        }else{
            alert('Vui lòng nhập phản hồi')
        }
      }
      const handleDeleteReply = async(id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
        const response = await apiDeleteReplyId(showReply?.productId, showReply?.commentId, id);
        if (response.success) {
            toast.success(response.message);
            fetchReplies();
          } else {
            toast.error(response.message);
          }
      }
      }
      const commentBodyTemplate = (rowData) => {
        const isEditing = selectEditRepId?.id === rowData?._id;
        const isAddingReply = selectRepId?.id === rowData?._id;
    
        return (
            <textarea 
                value={isAddingReply ? replyText : isEditing ? replyText : rowData?.comment}
                readOnly={!isEditing && !isAddingReply} 
                rows="3"
                placeholder={isAddingReply ? "Nhập phản hồi mới..." : ""}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: '100%', resize: 'none' }}
            />
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
    <div>
      <div className='position-absolute top-0 end-0'>
        <span onClick={() => setShowReply(null)}><MdCancel color='primary' fontSize={25}/></span>
      </div>
      <div className="bottom-data">
        <div className="orders">
          <DataTable 
            value={replies?.replies || []} 
            paginator 
            rows={10} 
            dataKey="commentId" 
            emptyMessage="Không tìm thấy bình luận nào."
            header={header}
            globalFilter={globalFilter}
          >
            
            <Column field='postedByName' header="Tên người dùng" sortable />
            <Column field="parentCommentId" header="Phản hồi" />
            <Column body={commentBodyTemplate} header="Nội dung bình luận" sortable />
            <Column body={formatDate} header="Ngày" sortable />
            <Column body={actionBodyTemplate} header="Hành động" sortable />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ProductCommentsTable;