import React, { useEffect, useState } from 'react';
import moment from "moment";
import { renderStartFromNumber } from "../../../utils/helper";
import { HiThumbUp } from "react-icons/hi";
import { FaReply } from "react-icons/fa";
import { apiGetReply, apiReplyToComment, apiReplyToCommentChild } from '../../../apis/product';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import useDebounce from '../../../hook/useDebounce';

const CommentItem = ({ comment, productId, setProduct }) => {
  const [replyText, setReplyText] = useState('');
  const [replyTextChild, setReplyTextChild] = useState('');
  const [commentData, setCommentData] = useState(comment);
  const [showReply, setShowReply] = useState({ id: null, name: '' });
  const [showCommentChild, setShowCommentChild] = useState({ id: null, name: '' });
  const [showComments, setShowComments] = useState(false); 
  const { current } = useSelector(state => state.user);

  const value = useDebounce(replyText, 1000);
  const valueChild = useDebounce(replyTextChild, 1000);
  console.log(showCommentChild)

  const handleAddReply = async () => {
    const uid = current?._id ? current?._id : null;
    const postedByName = current?.name || `User-${nanoid(6)}`;
    
    if (value) { 
      const response = await apiReplyToComment(productId, showReply?.id, { parentCommentId: showReply?.name, postedByName: postedByName, comment: value, useId: uid });
      if (response.success) {
        toast.success(response.message);
        setProduct();
        setReplyText('');
        setShowReply({}); 
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleAddReplyChild = async () => {
    const uid = current?._id ? current?._id : null;
    const postedByName = current?.name || `User-${nanoid(6)}`;
    
    if (valueChild) { 
      const response = await apiReplyToCommentChild(productId, showCommentChild?.id, { userId: uid, parentCommentId: showCommentChild?.name, postedByName, comment: valueChild });
      if (response.success) {
        toast.success(response.message);
        setProduct();
        setReplyTextChild('');
        setShowCommentChild({}); 
      } else {
        toast.error(response.message);
      }
    } else {
      toast.error('Vui lòng nhập nội dung bình luận');
    }
  };

  const handleLike = () => {
    setCommentData(prevComment => ({
      ...prevComment,
      likes: (prevComment.likes || 0) + 1
    }));
  };

  const handleLikeChild = (childId) => {
    setCommentData(prevComment => ({
      ...prevComment,
      replies: prevComment.replies.map(reply => 
        reply._id === childId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
      )
    }));
  };

  return (
    <div className="comment-container shadow">
      <img src="/path-to-your-avatar-image.png" alt="Avatar" className="avatar" />
      <div className="comment-content">
        <div className="comment-header">
          <span className="user-name">{commentData?.postedBy}</span>
          <span className="time-text">{moment(commentData?.updatedAt).fromNow()}</span>
        </div>
        <p className="comment-text">{commentData?.comment}</p>
        <div className="comment-star">{renderStartFromNumber(commentData.star)}</div>
        
        <div className="action-buttons">
          <button onClick={handleLike} className="action-button">
            <HiThumbUp size={18} />
            <span className="like-text">{commentData?.likes} Thích</span>
          </button>

          <button onClick={() => {
            setShowReply(prev => prev.id === commentData?.id ? { id: null, name: '' } : { id: commentData?.id, name: commentData?.postedBy });
          }} className="action-button">
            <FaReply size={18} />
            <span className="reply-text">Phản hồi</span>
          </button>
        </div>

        {showReply?.id === commentData?.id && (
          <div className="reply-input-container">
            <input
              className="reply-input"
              placeholder="Viết phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={handleAddReply} className="submit-reply-button">
              Gửi
            </button>
          </div>
        )}

        {comment?.replies?.length > 0 && (
          <div className="view-comments">
            <button className='mt-2' onClick={() => setShowComments(!showComments)}>
              {showComments ? 'Ẩn bình luận' : 'Xem phản hồi'}
            </button>
          </div>
        )}

        {showComments && comment?.replies?.map((el) => (
          <div key={el?._id} className="reply-input-container">
            <img src="/path-to-your-avatar-image.png" alt="Avatar" className="avatar" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="user-name">{el.postedByName}</span>
                <span className="time-text">{moment(el?.createdAt).fromNow()}</span>
              </div>
              <p className="comment-text"><span className='comment-reply-text'>{el.parentCommentId}</span>{el?.comment}</p>
              <div className="action-buttons">
                <button onClick={() => handleLikeChild(el._id)} className="action-button">
                  <HiThumbUp size={18} />
                  <span className="like-text">{el?.likes} Thích</span>
                </button>

                <button onClick={() => setShowCommentChild(prev => prev.id === el?._id ? { id: null, name: '' } : { id: el?._id, name: el?.postedByName })} className="action-button">
                  <FaReply size={18} />
                  <span className="reply-text">Phản hồi</span>
                </button>
              </div>
            </div>
            {showCommentChild?.id === el?._id && 
              <div className="reply-input-container">
                <input
                  className="reply-input"
                  placeholder="Viết phản hồi..."
                  value={replyTextChild}
                  onChange={(e) => setReplyTextChild(e.target.value)}
                />
                <button onClick={handleAddReplyChild} className="submit-reply-button">
                  Gửi
                </button>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentItem;
