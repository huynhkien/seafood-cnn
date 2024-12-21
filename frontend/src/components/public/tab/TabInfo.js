import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DOMPurify from 'dompurify';
import { VoteBar, Comment, Button, VoteOption } from "../../Index";
import { renderStartFromNumber } from "../../../utils/helper";
import { useCallback, useState } from 'react';
import { apiRatings } from '../../../apis';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';

function TabInfo({ description, total, ratings, nameProduct, pid, setProduct }) {
  const { current } = useSelector(state => state.user);
  const [isVote, setIsVote] = useState(false);
  const toggleVote = useCallback(() => {
    setIsVote(!isVote);
  }, [isVote]);

  const [visibleComments, setVisibleComments] = useState(3);

  const handleSubmitVoteOption = async ({ comment, score }) => {
    const uid = current?._id ? current?._id : null;
    const postedByName = current?._id ? current?.name : `User-${nanoid(6)}`
    if (!comment || !pid || !score) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const response = await apiRatings({ star: score, comment, pid, uid, postedByName });

    if (response.status) {
      toast.success('Cảm ơn quý khách đã đánh giá');
      setProduct();
      setIsVote(false);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments(prev => prev + 3);
  };

  const returnComments = () => {
    setVisibleComments(3);  
  };

  return (
    <Tabs
      defaultActiveKey="profile"
      id="fill-tab-example"
      className="mb-3 custom-tab"
      variant="underline"
      fill
    >
      <Tab eventKey="home" title="Mô tả">
        {description && (
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
        )}
      </Tab>
      <Tab eventKey="profile" title="Đánh giá">
        {isVote && (
          <div className='vote position-fixed top-50 start-50 translate-middle shadow-sm'>
            <VoteOption
              setIsVote={setIsVote}
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
          </div>
        )}
        <div className='row'>
          <div className='col-5 border d-flex flex-column justify-content-center align-items-center'>
            <span className='mb-2'>{`${total}/5`}</span>
            <span className='mb-2'>{renderStartFromNumber(total)}</span>
            <span className='mb-2'>{`${ratings?.length} đánh giá`}</span>
          </div>
          <div className='col-7 border'>
            {Array.from(Array(5).keys()).reverse().map(el => (
              <VoteBar
                key={el}
                number={el + 1}
                ratingCount={ratings?.filter(i => i.star === el + 1)?.length}
                ratingTotal={ratings?.length}
              />
            ))}
          </div>
        </div>
        <div className='row text-center py-3'>
          <span>Bạn muốn đánh giá về sản phẩm?</span>
          <Button
            name='Đánh giá ngay'
            handleOnClick={toggleVote}
          />
        </div>
        <div>
          {ratings?.slice(0, visibleComments).map(el => (
            <Comment
              key={el?._id}
              productId={pid}
              setProduct={setProduct}
              comment={{
                id: el?._id,
                postedBy: el?.postedByName,
                star: el?.star,
                comment: el?.comment,
                updatedAt: el?.updatedAt,
                likes: el?.likes || 0,
                replies: el?.replies || []
              }}
            />
          ))}
        </div>

        {visibleComments < ratings?.length && (
          <div className="text-center">
            <button className="btn btn-primary" onClick={loadMoreComments}>Xem thêm</button>
          </div>
        )}
        {visibleComments === ratings?.length && (
          <div className="text-center">
            <button className="btn btn-secondary" onClick={returnComments}>Ẩn bình luận</button>
          </div>
        )}
      </Tab>
    </Tabs>
  );
}

export default TabInfo;
