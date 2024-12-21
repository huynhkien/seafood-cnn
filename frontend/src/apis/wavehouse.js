import axios from './axios';

export const apiCreateReceiptImport = async (data) => axios({
    url: '/receipt/',
    method: 'post',
    data
}
)
export const apiGetReceipts = async () => axios({
    url: '/receipt/',
    method: 'get',
}
)
export const apiGetReceipt = async (rid) => axios({
    url: '/receipt/' + rid,
    method: 'get'
}
)
export const apiDeleteReceipt = async (rid) => axios({
    url: '/receipt/' + rid,
    method: 'delete'
}
)
export const apiUpdateReceiptProductId = async (rid, _id, data) => {
    return axios({
      url: `/receipt/${rid}/update-receipt-product/${_id}`,  
      method: 'put',
      data
    });
  };
  
export const apiUpdateReceiptInfo = async (rid, data) => {
    return axios({
      url: '/receipt/update-receipt-info/' + rid,  
      method: 'put',
      data
    });
  };
export const apiUpdateReceiptProducts = async (rid, data) => {
    return axios({
      url: '/receipt/update-receipt/' + rid,  
      method: 'put',
      data
    });
  };
  
export const apiDeleteReceiptProductId = async (rid, _id) => {
    return axios({
      url: `/receipt/${rid}/update-receipt-product/${_id}`,  
      method: 'delete',
    
    });
  };
  