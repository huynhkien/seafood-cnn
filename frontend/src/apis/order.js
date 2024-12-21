import axios from './axios';


export const apiCreateOrder = async (data) => axios({
    url: '/order/' ,
    method: 'post',
    data
})
export const apiGetOrderByUser = async () => axios({
    url: '/order/' ,
    method: 'get',
    
})
export const apiGetOrderById = async (oid) => axios({
    url: '/order/' + oid ,
    method: 'get',
    
})
export const apiUpdateStatus = async (oid, data) => axios({
            url: '/order/status/' + oid,
            method: 'put',
            data: data
})
export const apiGetCountStatus = async () => axios({
            url: '/order/count/',
            method: 'get',
          
})
export const apiGetTotalDay = async () => axios({
            url: '/order/day/',
            method: 'get',
          
})
export const apiGetTotalMonth = async () => axios({
            url: '/order/month/',
            method: 'get',
          
})
export const apiGetTotalYear = async () => axios({
            url: '/order/year/',
            method: 'get',
          
})
export const apiGetCountOrder = async () => axios({
            url: '/order/get-count/',
            method: 'get',
          
})