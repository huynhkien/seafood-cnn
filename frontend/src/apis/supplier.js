import axios from './axios';

export const apiCreateSupplier = async (data) => axios({
    url: '/supplier/',
    method: 'post',
    data
}
)
export const apiGetSuppliers = async () => axios({
    url: '/supplier/',
    method: 'get',
}
)
export const apiGetSupplier = async (sid) => axios({
    url: '/supplier/' + sid,
    method: 'get'
}
)
export const apiUpdateSupplier = async (sid, data) => axios({
    url: '/supplier/' + sid,
    method: 'put',
    data
}
)
export const apiDeleteSupplier = async (sid) => axios({
    url: '/supplier/' + sid,
    method: 'delete',
}
)