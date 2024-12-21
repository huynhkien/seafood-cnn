import { memo, useState } from "react";
import { voteOptions } from "../../../utils/contant";
import { FaStar } from "react-icons/fa";
import { Button } from "../../../components/Index";
import { MdCancel } from "react-icons/md";

const VoteOption = ({ nameProduct, handleSubmitVoteOption , setIsVote }) => {
  const [chosenScore, setChosenScore] = useState(null);
  const [comment, setComment] = useState('');

  return (
    <div className="vote-option-container">
      <button className='tpcart__vote' onClick={() =>setIsVote(null) } >
               <MdCancel />
            </button>
      <textarea
        className="comment-textarea"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Viết bình luận của bạn ở đây..."
      ></textarea>
      <div className="vote-section">
        <p className="vote-question">Bạn cảm thấy thế nào về sản phẩm này?</p>
        <div className="vote-options">
          {voteOptions.map(el => (
            <div
              onClick={() => setChosenScore(el.id)}
              key={el.id}
              className={`vote-option ${chosenScore === el.id ? 'selected' : ''}`}
            >
              <FaStar className="vote-star" color={chosenScore >= el.id ? "yellow" : "gray"} />
              <span className="vote-text">{el.text}</span>
            </div>
          ))}
        </div>
        <Button
          name='Submit'
          handleOnClick={() => handleSubmitVoteOption({comment, score: chosenScore})}
          className="submit-button"
        />
      </div>
    </div>
  );
};

export default memo(VoteOption);