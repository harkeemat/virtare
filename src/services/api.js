import axios from 'axios'
import success from './resources/success'
import failure from './resources/failure'

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL//process.env.VITE_APP_API_URL
})

api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('auth'))?.token
    config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(success, failure)

export default api