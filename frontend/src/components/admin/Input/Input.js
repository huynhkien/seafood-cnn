import React, { memo } from 'react';

export const InputForm = ({ label, disabled, register, errors, id, validate, placeholder, defaultValue, style, type, onChange=null }) => {
  return (
    <div className="form-group w-100 ">
      <label className='mb-2' htmlFor={id}>{label} </label>
      <input
        type={type || 'text'}
        id={id}  
        {...register(id, validate)} 
        disabled={disabled}
        className={style ? style : 'form-control'}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      {errors[id] && <small>{errors[id]?.message}</small>}
    </div>
  );
};

export default memo(InputForm);
