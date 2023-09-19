import axios from 'axios';
import authHeader from './authHeader';
import store from "../store/index"
import qs from "qs";
import router from '@/router';
import {
  key,
  deCodeString
} from "@/commonMethods/commonMethod";
// base: import.meta.env.BASE_URL,
const API_URL = import.meta.env.VITE_APP_API_URL//process.env.VUE_APP_API_URL
let timeout;
let currentValue = "";
let request = "";
let requestType = ''
class ServiceMethodService {

  checkMethod(method) {
    if (method == 'get') {
      requestType = 'fetch'
      return axios.get
    } else if (method == 'post') {
      requestType = 'store'
      return axios.post
    } else if (method == 'put') {
      requestType = 'store'
      return axios.put
    } else if (method == 'patch') {
      requestType = 'store'
      return axios.patch
    } else if (method == 'delete') {
      requestType = 'fetch'
      return axios.delete
    }
  }

  common(method, endPoint, id, data, clearLast = null) {
    let requestId = ''
    let axiosMethod = this.checkMethod(method)
    if (requestType == 'fetch') {
      requestId = id != null ? '/' + id : ''
    } else if (requestType == 'store') {
      requestId = id != null ? '/' + id : ''
    }
    let requestUrl = endPoint + requestId;
    if (clearLast) {
      if (request != "") {

        request.cancel();
      }
      const axiosSource = axios.CancelToken.source();
      request = {
        cancel: axiosSource.cancel,
        msg: "Loading..."
      };
      if (requestId && !data) {

        return axiosMethod(API_URL + requestUrl, {
          cancelToken: axiosSource.token,
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })
      } else if (requestId && data) {

        return axiosMethod(API_URL + requestUrl, data, {
          cancelToken: axiosSource.token,
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })

      } else if (!requestId && data) {
        return axiosMethod(API_URL + requestUrl, data, {
          cancelToken: axiosSource.token,
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })
      } else {

        return axiosMethod(API_URL + requestUrl, {
          cancelToken: axiosSource.token,
          headers: authHeader()
        }).catch((error) => {
          if (error.response && error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })

      }
    } else {

      if (id && !data) {

        return axiosMethod(API_URL + requestUrl, {
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })
      } else if (requestId && data) {

        return axiosMethod(API_URL + requestUrl, data, {
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })

      } else if (!requestId && data) {
        return axiosMethod(API_URL + requestUrl, data, {
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })
      } else {

        return axiosMethod(API_URL + requestUrl, {
          headers: authHeader()
        }).catch((error) => {
          if (error.response.status === 401) {
            this.removeStorage()
            store.commit('errorMsg', error.response.data)

          }
          throw error
        })
      }
    }


  }
  //login method
  login(data) {
    data = {
      email: data.email,
      password: data.password,
      deviceType: 'web',
      deviceToken: data.fireBaseToken ? data.fireBaseToken : localStorage.getItem('fireBaseToken')
    }
    return axios.post(API_URL + "login", data, {
      headers: authHeader()
    })
  }



  //search method for dropdown
  singleDropdownSearch(value, callback, targetRecords, endpoint, deviceType, isAvailable, orderField, orderBy, entity) {
    if (timeout && value != '') {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      var str = {}
      if (endpoint == 'inventory') {
        str = qs.stringify({
          code: "utf-8",
          search: value,
          deviceType: deviceType ? deviceType : "",
          isAvailable: isAvailable ? isAvailable : "",
          orderField: orderField ? orderField : "",
          orderBy: orderBy ? orderBy : "",
        });
      } else {
        str = qs.stringify({
          code: "utf-8",
          search: value,
        });
      }
      const searchUrl = endpoint.includes('?') ? `${endpoint}` + '&isActive=1&' + `${str.trim()}` : `${endpoint}` + '?isActive=1&' + `${str.trim()}`
      axios.get(API_URL + searchUrl, {
          headers: authHeader()
        })
        .then((response) => response)
        .then((d) => {
          store.commit('dropdownListing', d.data.data)
          store.commit('dropdownLoadingStatus', false)
          if (currentValue === value) {
            const result = d.data.data.map(item => {
              if (item ?.firstName || item ?.middleName || item ?.lastName) {
                item.firstName = deCodeString(key, item.firstName)
                item.middleName = deCodeString(key, item.middleName)
                item.lastName = deCodeString(key, item.lastName)
                item.fullName = item.lastName + ', ' + item.firstName + ' ' + item.middleName
              }
              if (item.abbr) {

                item.fullName = item.abbr
              }
              if (item.code && item.description) {
                item.fullName = item.code + ' - ' + item.description
              } else if (item.macAddress) {
                item.MACAddress = item.macAddress
              }
              return item
            });

            const data = [];
            let label = ""
            result.forEach((item) => {
              if (targetRecords && targetRecords != null) {
                const isFound = targetRecords.some(element => {
                  if (item.id) {
                    if (element.targetUdid) {
                      if (element.targetUdid === item.id) {
                        return true
                      }
                    } else if (element.role) {
                      if (element.role.targetUdid === item.id) {
                        return true
                      }
                    } else {
                      return false
                    }
                  } else if (item.udid) {
                    if (element.targetUdid) {
                      if (element.targetUdid === item.udid) {
                        return true
                      }
                    } else if (element.role) {
                      if (element.role.targetUdid === item.udid) {
                        return true
                      }
                    } else {
                      return false
                    }
                  } else {
                    return false
                  }
                });
                if (!isFound) {
                  data.push({
                    profilePhoto: item ?.profilePhoto,
                    value: item.udid ? item.udid : item.id,
                    label: item.fullName ? item.fullName : item.name,
                  });
                }
              } else {
                if (item.fullName) {
                  label = item.fullName
                } else if (item.title) {
                  label = item.title
                } else if (item.name) {
                  label = item.name
                } else if (item.formName) {
                  label = item.formName + ' (' + item.formType + ')'
                } else if (item.macAddress) {
                  label = `${item.modelNumber} (${item.macAddress})`
                } else if (item.macAddress && item.fullName) {
                  label = `${item.modelNumber} (${item.macAddress})`
                }
                if (endpoint == 'inventory') {
                  data.push({
                    profilePhoto: item ?.profilePhoto,
                    value: item.udid ? item.udid : item.id,
                    label: label,
                    modelNumber: item.modelNumber,
                    macAddress: item.macAddress,
                    serialNumber: item.serialNumber,
                  });
                } else if (endpoint == 'provider' && entity == 'providerDropdown') {
                  data.push({
                    profilePhoto: item ?.profilePhoto,
                    value: item.udid ? item.udid : item.id,
                    label: label,
                  });
                } else {
                  data.push({
                    profilePhoto: item ?.profilePhoto,
                    value: item.udid ? item.udid : item.id,
                    label: label,
                    code:item?.code
                  });
                }
              }
            });
            const urlParams = new URLSearchParams(endpoint);
            const globalCodeCategoryId = urlParams.get('globalCodeCategoryId')
            let updatedData = []
            if (globalCodeCategoryId == 8) {
              data.map(item => {
                if (item.label != 'Self') {
                  updatedData.push(item)
                }
              })
            } else {
              updatedData = data
            }

            callback(updatedData);

          }
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 422) {
              store.commit('errorMsg', error.response.data)
              store.commit('dropdownLoadingStatus', false)
            } else if (error.response.status === 500) {
              // errorSwal(error.response.data.message)
              store.commit('dropdownLoadingStatus', false)
            } else if (error.response.status === 401) {
              this.removeStorage()
              // errorSwal(error.response.data.message)
              store.commit('dropdownLoadingStatus', false)
            }
          }
          store.commit('dropdownLoadingStatus', false)
        });
    }
    timeout = setTimeout(fake, 300);
  }


  headerSearch(value, callback, endpoint) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      callback('');
    }

    currentValue = value;
    if (value == '') {
      callback(null);
      return;
    }

    function fake() {
      const str = qs.stringify({
        code: "utf-8",
        search: value,
      });
      axios.get(API_URL + `${endpoint}` + '?' + `${str}`, {
          headers: authHeader()
        })
        .then((response) => response)
        .then(async (d) => {
          store.commit('dropdownLoadingStatus', false)
          if (currentValue === value) {
            const response = d.data.data;
            let result = response;
            if (response.lenght > 0) {
              return result.reduce(function (data, item) {
                (data[item["type"]] = data[item["type"]] || []).push(item)
                return data;
              }, []);

            } else {
              result
            }
            callback(result);
          }

        }).catch((error) => {
          if (error.response.status === 422) {
            store.commit('errorMsg', error.response.data)
            store.commit('dropdownLoadingStatus', false)
          } else if (error.response.status === 500) {
            // errorSwal(error.response.data.message)
            store.commit('dropdownLoadingStatus', false)
          } else if (error.response.status === 401) {
            this.removeStorage()
            // errorSwal(error.response.data.message)
            store.commit('dropdownLoadingStatus', false)
          }
          store.commit('dropdownLoadingStatus', false)
        });
    }

    timeout = setTimeout(fake, 300);

  }

  removeStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('barmenu');
    localStorage.removeItem('staff');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.removeItem('roleAuth');
    localStorage.removeItem('access');
    localStorage.removeItem('accessPermission');
    localStorage.removeItem('permission');
    localStorage.removeItem('screensPermission');
    localStorage.removeItem('widgetsPermission');
    localStorage.removeItem('fireBaseToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('checkLogin');
    router.go();
  }

}

export default new ServiceMethodService();
