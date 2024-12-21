import React, { memo } from 'react'

const Select = ({name,label, options=[], register, errors, id, validate, style, defaultValue, onChange}) => {
  return (
    <div className='form-group w-100'>
      {label && <label className='mb-2' htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        className={style ? style : 'form-control'}
        id={id}
        {...register(id, validate)}
        onChange={onChange}  
      >
        <option value=''>{name}</option>
        {options?.map(el => (
          <option value={el.code}>{el.value}</option>
        ))}
      
      </select>
      {errors[id] && <small class='text-red'>{errors[id]?.message}</small>}
    </div>
  )
}

export default memo(Select);