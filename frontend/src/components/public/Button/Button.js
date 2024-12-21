import React, {memo} from 'react'
const Button = ({name, handleOnClick}) => {
  return (
    <div className="tptrack__btn text-center pt-3">
        <button
            type='button'
            className="tptrack__submition active"
            onClick={() => { handleOnClick && handleOnClick() }}
        >
        
            <span>{name}</span>
            
        </button>
    </div>
  )
}

export default memo(Button)