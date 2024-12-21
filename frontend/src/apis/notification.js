import axios from './axios';

export const apiCreateNotification = async (data) => axios({
    url: '/notification/',
    method: 'post',
    data
}
)
export const apiGetNotification = async (nid) => axios({
    url: '/notification/' + nid,
    method: 'get',
}
)
export const apiGetNotifications = async () => axios({
    url: '/notification/',
    method: 'get',
}
)
export const apiDeleteNotification = async (nid) => axios({
    url: '/notification/' + nid,
    method: 'delete',
}
)