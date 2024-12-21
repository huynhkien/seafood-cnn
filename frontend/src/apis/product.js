import axios from './axios';

export const apiGetProducts = async (params) => axios({
    url: '/product/',
    method: 'get',
    params
})
export const apiGetProduct = async (pid) => axios({
    url: '/product/' + pid,
    method: 'get',
})
export const apiCreateProduct = async (data) => axios({
    url: '/product/' ,
    method: 'post',
    data
})
export const apiCreateVariant = async (data, pid) => axios({
    url: '/product/add-variant/' + pid ,
    method: 'put',
    data
})
export const apiUpdateProduct = async (data, pid) => axios({
    url: '/product/' + pid ,
    method: 'put',
    data
})
export const apiDeleteProduct = async (pid) => axios({
    url: '/product/' + pid ,
    method: 'delete',
})
export const apiDeleteVariant = async (pid, vid) => axios({
    url: `/product/add-variant/${pid}/${vid}`,
    method: 'delete',
});
export const apiUpdateVariantId = async (pid, _id, data) => axios({
    url: `/product/update-variant/${pid}/${_id}`,
    method: 'put',
    data
});
export const apiGetVariantId = async (pid, _id) => axios({
    url: `/product/get-variant/${pid}/${_id}`,
    method: 'get',
});
export const apiGetCountRatings = async () => axios({
    url: '/product/count/'  ,
    method: 'get',
});
export const apiRatings = async (data) => axios({
    url: '/product/ratings/'   ,
    method: 'put',
    data
});
export const apiUpdateCoupon = async (pid, data) => axios({
    url: '/product/add-coupon/' + pid  ,
    method: 'put',
    data
});
export const apiReplyToComment = async (pid, rid, data) => axios({
    url: `/product/reply/${pid}/${rid}`  ,
    method: 'post',
    data
});
export const apiReplyToCommentChild = async (pid, cid, data) => axios({
    url: `/product/reply-child/${pid}/${cid}`  ,
    method: 'post',
    data
});
export const apiDeleteReply = async (pid, rid, _id) => axios({
    url: `/product/reply/${pid}/${rid}/${_id}`  ,
    method: 'delete',
});
export const apiGetReplies = async (pid, rid) => axios({
    url: `/product/reply/${pid}/${rid}`  ,
    method: 'get',
});
export const apiGetReplyId = async (pid, rid, repId) => axios({
    url: `/product/reply-id/${pid}/${rid}/${repId}`  ,
    method: 'get',
});
export const apiGetRepliesAdmin = async (pid, rid, uid) => axios({
    url: `/product/reply-admin/${pid}/${rid}/${uid}`  ,
    method: 'get',
});
export const apiUpdateReply = async (pid, rid, repId, data) => axios({
    url: `/product/update-reply/${pid}/${rid}/${repId}`  ,
    method: 'put',
    data
});
export const apiDeleteReplyId = async (pid, rid, repId) => axios({
    url: `/product/reply-id/${pid}/${rid}/${repId}`  ,
    method: 'delete',
 
});
export const apiDeleteRating = async (pid, rid) => axios({
    url: `/product/rating/${pid}/${rid}`  ,
    method: 'delete',
 
});
export const apiGetAllVoucherProduct = async () => axios({
      url: '/product/get-all-product-voucher',  
      method: 'get',
});
export const apiDeleteDiscount = async (pid) => axios({
      url: '/product/update-discount/' + pid,  
      method: 'put',
});