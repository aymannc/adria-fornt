import axios from "axios"
export const api_url = "http://localhost:8080/"

export default axios.create({
    baseURL: api_url
})
