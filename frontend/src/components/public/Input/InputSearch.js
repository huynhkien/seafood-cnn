import React, { memo, useEffect, useState } from 'react';
import { FaChevronDown } from "react-icons/fa6";
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { apiGetProducts } from '../../../apis';
import useDebounce from   '../../../hook/useDebounce';

const InputSearch = ({name, activeClick, changeActiveFilter, type = 'input'}) => {
  const navigate = useNavigate();
  const {category, search} = useParams();
  const [selected, setSelected] = useState([]);
  const [bestPrice, setBestPrice] = useState(null);
  const [price, setPrice] = useState({
    from: '',
    to: '',
  });
  const fetchBestPriceProduct = async() => {
    if(selected){
      const response = await apiGetProducts({ sort: '-price', limit: 1 });
      if (response.success && response.productData && response.productData.length > 0) {
        setBestPrice(response.productData[0]?.price);
      } else {
        setBestPrice(null);  
      }
    }else{
      setBestPrice(null);
    }
  }
  
  useEffect(() => {
    if(type === 'input') fetchBestPriceProduct();
  },[type]);
 

 const debouncedPriceFrom = useDebounce(price.from, 500);
 const debouncedPriceTo = useDebounce(price.to, 500);

  useEffect(() => {
    const data = {};
    if (Number(debouncedPriceFrom) > 0) data.from = debouncedPriceFrom;
    if (Number(debouncedPriceTo) > 0) data.to = debouncedPriceTo;
    
    if(category){
      navigate({
        pathname: `/category/${category}`,
        search: createSearchParams(data).toString(),
      });
    }else{
      navigate({
        pathname: `/product/${search}`,
        search: createSearchParams(data).toString(),
      });
    }
  }, [debouncedPriceFrom, debouncedPriceTo]);

  return (
    <div
      onClick={() => changeActiveFilter(name)}
      className='input-search-container'
    >
      <span className="input-search-name">{name}</span>
      <FaChevronDown className="input-search-icon" />
      {activeClick === name && (
        <div className='input-search-dropdown'>
          {type === 'input' && (
            <div onClick={e => e.stopPropagation()}>
              <div className='input-search-price-info'>
                <span className='input-search-price-text'>
                  {`Giá cao nhất là ${Number(bestPrice).toLocaleString()} VNĐ`}
                </span>
                <span
                  className='input-search-reset'
                  onClick={e => {
                    e.stopPropagation()
                    setSelected({from: '', to: ''})
                    changeActiveFilter(null)
                  }}
                >
                  Reset
                </span>
              </div>
              <div className='input-search-inputs'>
                <div className='input-search-field'>
                  <label className='input-search-label' htmlFor='from'>From</label>
                  <input 
                    className='input-search-input'
                    type='number'
                    id='from'
                    value={price.from}
                    onChange={e => setPrice(prev => ({...prev, from: e.target.value}))}
                  />
                </div>
                <div className='input-search-field'>
                  <label className='input-search-label' htmlFor='to'>To</label>
                  <input
                    className='input-search-input'
                    type='number'
                    id='to'
                    value={price.to}
                    onChange={e => setPrice(prev => ({...prev, to: e.target.value}))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(InputSearch)