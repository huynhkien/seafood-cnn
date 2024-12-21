import { useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const VoteBar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef();
    
    useEffect(() => {
        const percentage = (ratingCount / ratingTotal) * 100;
        percentRef.current.style.width = `${percentage}%`;
    }, [ratingCount, ratingTotal]);

    return (
        <div className="row d-flex py-3">
            <div className="col-2">
                <span className="px-2">{number}</span>
                <FaStar color='yellow' />
            </div>
            <div className="col-7 position-relative bg-white rounded">
                <div ref={percentRef} className="percent rounded"></div>
            </div>
            <div className="col-3">
                {`${ratingCount || 0} đánh giá`}
            </div>
        </div>
    );
};

export default VoteBar;
