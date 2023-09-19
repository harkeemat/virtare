import router from '@/router';
import store from '@/store/index'
import { message } from 'ant-design-vue';
import {
    errorLogWithDeviceInfo,
} from '@/commonMethods/commonMethod'

export default function (error) {
    switch (error?.response?.status) {
        case 401:
            localStorage.removeItem('token')
            store.dispatch("removeLocalStorage")
            router.push({
                name: 'Login'
            })
            break
        case 500:
            message.error('Internal server error, please wait some time!!')
    }
    store.commit('errorClients',error?.response?.data)
    store.commit('loading',false)
    store.commit('loadingStatus',false)
    store.commit('patientsLoaderStatus',false)
    store.commit('AddClientLoadingStatus', false)
    store.commit('clientLoadingStatus', false)
    errorLogWithDeviceInfo(error?.response);
    return Promise.reject(error)
}