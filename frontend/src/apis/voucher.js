import axios from './axios';

export const apiCreateVoucher = async (data) => axios({
    url: '/voucher/',
    method: 'post',
    data
}
)
export const apiGetVoucher = async (vid) => axios({
    url: '/voucher/' + vid,
    method: 'get',
}
)
export const apiGetVouchers = async () => axios({
    url: '/voucher/',
    method: 'get',
}
)
export const apiUpdateVoucher = async (vid, data) => axios({
    url: '/voucher/' + vid,
    method: 'put',
    data
}
)
export const apiDeleteVoucher = async (vid) => axios({
    url: '/voucher/' + vid,
    method: 'delete',
  
}
)
export const apiUpdateVoucherProductId = async (vid, _id, data) => {
    return axios({
      url: `/voucher/${vid}/update-voucher-product/${_id}`,  
      method: 'put',
      data
    });
  };
export const apiDeleteVoucherProductId = async (vid, _id) => {
    return axios({
      url: `/voucher/${vid}/update-voucher-product/${_id}`,  
      method: 'delete',
    });
  };
export const apiDeleteVoucherCategory = async (vid, _id) => {
    return axios({
      url: `/voucher/${vid}/update-voucher-category/${_id}`,  
      method: 'delete',
    });
  };
export const apiDeleteVoucherUser = async (vid, _id) => {
    return axios({
      url: `/voucher/${vid}/update-voucher-user/${_id}`,  
      method: 'delete',
    });
  };

  
