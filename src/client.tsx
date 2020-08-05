import axios from "axios"

export const api_url = "http://localhost:8080/"

const instance = axios.create({
    baseURL: api_url,
})
// request header
instance.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbmMiLCJleHAiOjE1OTc0ODc3MzYsInJvbGVzIjpbXX0.x-tIMqHGBLJHLRZr8GYIisABGIHbaDgFXlSDhP6NEZgSXPbGewwPalEzuG1m27fMVFeWOP3H3l7AWLgm63DWsw";
    return config
}, error => {
    return Promise.reject(error)
})

export default instance
