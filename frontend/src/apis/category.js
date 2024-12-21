import axios from './axios';

export const apiCreateCategory = async (data) => axios({
    url: '/category/',
    method: 'post',
    data
}
)

export const apiGetCategory = async () => axios({
    url: '/category/',
    method: 'get',
}
)
export const apiGetOneCategory = async (cid) => axios({
    url: '/category/' + cid,
    method: 'get'
}
)
export const apiUpdateCategory = async (cid, data) => axios({
    url: '/category/' + cid,
    method: 'put',
    data
}
)
export const apiDeleteCategory = async (cid) => axios({
    url: '/category/' + cid,
    method: 'delete',
}
)
export const apiGetCategoryName = async (slug) => axios({
    url: '/category/' + slug,
    method: 'get',
}
)