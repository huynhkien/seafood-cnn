import React from 'react'
import usePagination from '../../../hook/usePagination'
import PagItem from './PagItem';
const Pagination = ({totalCount}) => {
    const pagination = usePagination(totalCount,1);
  return (
    <div className="basic-pagination text-center mt-35">
      <ul>
          {pagination?.map(el => (
              <PagItem key={el}>
                  {el}
              </PagItem>
          ))}
          </ul>
        </div>
  )
}

export default Pagination