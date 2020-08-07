import axios from "axios"

export const api_url = "http://localhost:8083/"

const instance = axios.create({
    baseURL: api_url,
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token') || ''
    return config
}, error => {
    return Promise.reject(error)
})

export default instance
