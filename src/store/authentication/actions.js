import ServiceMethodService from '@/services/serviceMethod';
import serviceMethod from '@/services/serviceMethod';
import { enCodeString, key } from "@/commonMethods/commonMethod";
import api from "@/services/api";
import {
  API_ENDPOINTS,
} from '@/config/apiConfig';
import {
  messages
} from '@/config/messages';
import {
  errorSwal,
  errorLogWithDeviceInfo,
  successSwal,
  rolesPermissionFind
} from '@/commonMethods/commonMethod';
import router from '@/router';
import store from '@/store/index'
let date = new Date();
export const login = async ({
  commit,
  dispatch
}, user) => {
  let status = false
  try {
    const { data } = await ServiceMethodService.login(user)
    commit('logoutLoader', true)
    status = true
    localStorage.setItem('auth', JSON.stringify(data));
    localStorage.setItem('checkLogin', true);
    localStorage.setItem(
      'expiresIn',
      date.setSeconds(date.getSeconds() + (data.expiresIn / 100 - 10))
    );

    commit('loginSuccess', data);
    await dispatch('roleAccess', user)
    //store.dispatch("filterDateDataGet")
    // setInterval for refresh token api
    setInterval(async () => {
      await ServiceMethodService.common('post', API_ENDPOINTS['refreshToken'], null, true)
        .then((response) => {
          commit('refreshTokenSuccess', response.data)
          setToken(response.data.token)
          commit('expiresIn', date.setSeconds(date.getSeconds() + (response.data.expiresIn / 100 - 10)));
          localStorage.setItem(
            'expiresIn',
            date.setSeconds(date.getSeconds() + (response.data.expiresIn / 100 - 10))
          );
        })
        .catch((error) => {
          errorLogWithDeviceInfo(error.response)
        });
    }, (data.expiresIn / 100 - 10) * 1000)
    // end setInterval
  } catch (error) {
    commit('logoutLoader', false)
    if (error.response) {
      if (error.response.status == 422) {
        commit('logoutLoader', false)
        commit('loginFailure', error.response.data)
        commit('failure', error.response.data)
      }
      else if (error.response.status == 401) {
        commit('loginFailure', error.response.data)
        commit('failure', error.response.data)
      }
      else {
        commit('loginFailure', error)
      }
      errorLogWithDeviceInfo(error.response)
    }
    else {
      errorLogWithDeviceInfo(error)
    }
  }

  return status
}




export const roleAccess = async ({ commit }, user) => {
  try {
    const { data } = await api.get('staff/access')
    commit('accessPermissions', data.data);
    //commit('accessPermission', data.data.length);
    // localStorage.setItem('accessPermission', data.data.length);
    //localStorage.setItem('access', true);
    //localStorage.setItem('roleAuth', data.data[0] ? data.data[0].roleId : '');
    permission({
      commit
    }, user);
  } catch (e) {

  }
}

export const permission = async ({ commit }, user) => {
  const authUser = JSON.parse(localStorage.getItem("auth"));
  const authStaff = authUser?.user.staff
  const authStaffId = authStaff?.id
  const authStaffGroupId = authStaff?.groupId

  let apiUrl = ''
  if (authStaffGroupId != "" && authStaffGroupId != null) {
    apiUrl = `actionPermission?staff=${authStaffId}&group=${authStaffGroupId}`
  }
  else {
    apiUrl = `staff/access/action`
  }
  try {
    const { data } = await api.get(apiUrl)
    if (data.actionId.length == 0 && data.widgetId.length == 0) {
      errorSwal(messages.permissionsError).then((response) => {
        commit('failure', 'true')
        if (response == true) {
          logoutUser({ commit })
        }
        else {
          logoutUser({ commit })
        }
      });
    }
    else {
      //encode permission array to string
      data.actionId = enCodeString(key, data.actionId)
      localStorage.setItem('screensPermission', JSON.stringify(data.actionId))
      localStorage.setItem('widgetsPermission', JSON.stringify(data.widgetId))
      //localStorage.setItem('permission', JSON.stringify(response.data));
      /**
       * Get route url from permission array 
       * And redirect after login 
       */
      if (user?.password) {
        let urlFound = router?.options?.routes?.find(item => getFirstUrlFromPermissions(data.actionId, item))
        localStorage.setItem('redirectUrl', urlFound?.path)
        commit('permissions', data)
        urlFound?.path ? router.push(urlFound?.path) : ''
      }
      //if(user?.password){
      //router?.currentRoute.value?.redirectedFrom?.fullPath ? router.push(router?.currentRoute.value?.redirectedFrom?.fullPath) : router.push('Dashboard')
      //}else{
      // router.push(router.currentRoute.value?.path=='/'?'Dashboard':router.currentRoute.value?.path );
      //}
      commit('logoutLoader', false)
    }
  } catch (error) {
    errorLogWithDeviceInfo(error);
  }
};
/**
 * 
 * @param {*} actions  permission array 
 * @param {*} item   url permission array 
 * @returns  true or false
 * Check permission match with url permissions 
 */
function getFirstUrlFromPermissions(actions, item) {
  return rolesPermissionFind(actions, item?.meta?.role) ? item : false

}
export const logoutUser = async ({ commit }) => {
  commit('logoutLoader', true)
  try {
    await api.post('logout', [])
    //if(response){
    successSwal('Logout Successfully ');
    removeLocalStorage()
    // sessionStorage.removeItem('noteSession')
    //}
  } catch (error) {
    if(error.response.status == 401) {
      store.dispatch("removeLocalStorage")
    }
    //commit('logoutLoader', true) 
  }
  commit('logoutLoader', false)
};
export const removeLocalStorage =()=>{
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
  localStorage.removeItem('taskRoute')
  localStorage.removeItem('communicationRoute')
  localStorage.removeItem('redirectUrl')
  sessionStorage.removeItem('chatSession')
  router.push('/');
    setTimeout(() => {
      router.go();

    }, 1000);
}
export const refreshToken = async ({
  commit
}) => {
  try {
    const { data } = await api.post(API_ENDPOINTS['refreshToken'], true)
    commit('refreshTokenSuccess', data);
    setToken(data.token)
    commit('expiresIn', date.setSeconds(date.getSeconds() + (data.expiresIn / 100 - 10)));
    localStorage.setItem(
      'expiresIn',
      date.setSeconds(date.getSeconds() + (data.expiresIn / 100 - 10))
    );
    // setInterval for refresh token api
    setInterval(async () => {
      await ServiceMethodService.common('post', API_ENDPOINTS['refreshToken'], null, true)
        .then((response) => {
          commit('refreshTokenSuccess', response.data);
          setToken(response.data.token)
          commit('expiresIn', date.setSeconds(date.getSeconds() + (response.data.expiresIn / 100 - 10)));
          localStorage.setItem(
            'expiresIn',
            date.setSeconds(date.getSeconds() + (response.data.expiresIn / 100 - 10))
          );
        })
        .catch((error) => {
          if (error.response) {
            errorLogWithDeviceInfo(error.response);
          } else {
            errorLogWithDeviceInfo(error);
          }
        });
    }, (data.expiresIn / 100 - 10) * 1000);
    //console.log("token",data)
    // end setInterval
  } catch (error) {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status == 401) {
      //AuthService.logout();
    }
    commit('failure', error.response.data);
  }
};

export const escalationAuth = async ({ commit }, data) => {
  let status = false
  await serviceMethod.common("post", `escalation/${data.id}/verify`, null, data).then((response) => {
    setToken(response.data.token)
    status = true
    ServiceMethodService.common('get', 'staff/access/action', null, null)
      .then((response) => {
        localStorage.setItem('screensPermission', JSON.stringify(response.data.actionId));
        localStorage.setItem('widgetsPermission', JSON.stringify(response.data.widgetId));
        localStorage.setItem('permission', JSON.stringify(response.data));
        commit('permissions', response.data);
      })
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
  return status
}
const setToken = (token) => {
  let auth = JSON.parse(localStorage.getItem("auth"))
  auth.token = token
  localStorage.setItem('auth', JSON.stringify(auth))
}
// export const accessPermissions = async ({ commit }) => {
//   await ServiceMethodService.common('get', 'staff/access', null, null).then((response) => {
//     commit('accessPermissions', response.data.data);
//   })
//     .catch((error) => {
//       commit('logoutLoader', false)
//       if (error.response) {
//         errorLogWithDeviceInfo(error.response);
//       } else {
//         errorLogWithDeviceInfo(error);
//       }
//       // errorSwal(error.response.data.message);
//     });
// };