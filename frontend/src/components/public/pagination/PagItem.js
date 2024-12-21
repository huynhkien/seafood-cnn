import React from 'react';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const PagItem = ({children}) => {
  const navigate = useNavigate();
  let [params] = useSearchParams();
  const location = useLocation();
  const handlePagination = () => {
    const queries = Object.fromEntries([...params]);
    if(Number(children)) queries.page = children;
    navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString()
     })
  }
  return (
    <li onClick={handlePagination}>
      <span>
          {children}
          </span>
    </li>
  )
}

export default PagItem