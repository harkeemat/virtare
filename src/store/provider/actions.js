import serviceMethod from '@/services/serviceMethod'
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal, errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'

export const addProvider = async ({ commit }, data) => {
  let status = false
  await serviceMethod.common("post", API_ENDPOINTS['provider'], null, data).then((response) => {
    commit('providerData', response.data.data);
    status = true
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}

export const providerLocation = async ({commit}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", `provider/${data.id}/location`, null, data.data).then((response) => {
    successSwal(response.data.message)
    commit('providerLocation', response.data.data);
    status = true
    commit('loadingStatus', false)
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
      commit('errorMsg', error.response.data.message)
    }
    commit('loadingStatus', false)
  })
  return status
}


export const editProviderLocation = async ({commit}, data) => {
  commit('loadingStatus', true)
  let status = false
  await serviceMethod.common("get", `provider/${data.id}/location/${data.locationId}`, null, null).then((response) => {
    commit('editProviderLocation', response.data.data);
    commit("checkChangeInput", true)
    status = true
    commit('loadingStatus', false)
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
      commit('errorMsg', error.response.data.message)
    }
  })
  commit('loadingStatus', false)
  return status
}

export const providersListAll = async ({
  commit
},page) => {
  commit('loadingStatus', true)
  let link = page? "provider?active=1"+page : "provider?active=1"
  await serviceMethod.common("get", link, null, null).then((response) => {
    commit('provider', response.data);
    commit('providersListAll', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const headerProvidersListAll = async ({ commit }) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `provider?active=1`, null, null).then((response) => {
    commit('headerProvidersListAll', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const editSingleProvider = async ({ commit }, id) => {
  commit('loadingStatus', true)
  let status = false
  await serviceMethod.common("get", `provider/${id}`, null, null).then((response) => {
    commit('editSingleProvider', response.data.data);
    commit('loadingStatus', false)
    status =true
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      commit('loadingStatus', false)
    }
  })
  return status
}
export const providerLocationList = async ({
  commit
}, id) => {
  await serviceMethod.common("get", `provider/${id}/location`, null, null).then((response) => {
    commit('providerLocationList', response.data.data);
   commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const deleteSingleProvider = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", `provider/${data.id}`, null, null).then((response) => {
    successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const deleteProviderLocation = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}?entityType=${data.entityType}`, null, null).then((response) => {
    successSwal(response.data.message)
   
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })

}

export const updateSingleProvider = async ({ commit }, data) => {
  let status =false
  await serviceMethod.common("put",`provider`,data.id,data.data).then((response)=>{
    commit("providerCounterPlus");
    commit('updateSingleProvider', response.data.data);
    status =true
    if(data.data.showPopup){
      successSwal(response.data.message)
    }
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
      // errorSwal(error.response.data.message)
    }
  })
  return status
}

export const addProviderLocation = async ({ commit }, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['provider']+`/${data.providerId}/location`, null, data.data).then((response) => {
    commit('addProviderLocation', response.data.data)
    commit("providerCounterPlus");
    commit('errorMsg', null);
    successSwal(response.data.message)
  })
}

export const updateProviderLocation = async ({ commit }, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}`, null, data.data).then((response) => {
    commit('updateProviderLocation', response.data.data)
    successSwal(response.data.message)
  })
}

export const programProviders = async ({ commit }, programId) => {
  await serviceMethod.common("get", API_ENDPOINTS['program']+`/${programId}/provider`, null, null).then((response) => {
    commit('programProviders', response.data.data);
   commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const providerLocations = async ({ commit }, providerId) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${providerId}/location`, null, null).then((response) => {
    commit('providerLocations', response.data.data);
    commit('providerLocationsList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const headerProviderLocations = async ({ commit }, providerId) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${providerId}/location`, null, null).then((response) => {
    commit('headerProviderLocations', response.data.data);
    commit('providerLocationsList', response.data.data);
   commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const providerLocationById = async ({ commit }, data) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}`, null, null).then((response) => {
    commit('providerLocationById', response.data.data);
   commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const subLocationsByParentId = async ({ commit }, data) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}`, null, null).then((response) => {
    commit('subLocationsByParentId', response.data.data);
   commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const parentLocations = async ({ commit }, data) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location?level=${data.level}`, null, null).then((response) => {
    commit('parentLocations', response.data.data);
    commit('groupLocations', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    
  })
}

export const subLocationsList = async ({ commit }, data) => {
  commit('providerLocationsLoadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}?entityType=${data.entityType}`, null, null).then((response) => {
    commit('subLocationsList', {
      parentKey: data.parentKey,
      locationId: data.locationId,
      data: response.data.data
    })
    commit('providerLocationsLoadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('providerLocationsLoadingStatus', false)
    // errorSwal(error.response.data.message)
    
  })
}

export const dropdownSubLocationsList = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}?entityType=${data.entityType}`, null, null).then((response) => {
    commit('dropdownSubLocationsList', {
      parentKey: data.parentKey,
      locationId: data.locationId,
      data: response.data.data})
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const headerSubLocations = async ({ commit }, data) => {
  let status = false
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}?entityType=${data.entityType}`, null, null).then((response) => {
    commit('headerSubLocations', response.data.data);
    status = true
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
  return status
}

export const dropdownProviderLocations = async ({ commit }, providerId) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${providerId}/location`, null, null).then((response) => {
    commit('dropdownProviderLocations', response.data.data);
    commit('providerLocationsList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
   commit('loadingStatus', false)
  })
}

export const dropdownSubLocations = async ({ commit }, data) => {
  commit('loadingStatus', true)
  let status = false
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}?entityType=${data.entityType}`, null, null).then((response) => {
    commit('dropdownSubLocations', response.data.data);
    status = true
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
  return status
}

export const assignProgramToLocation = async ({ commit }, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}/program?entityType=${data.entityType}`, null, data.data).then((response) => {
    commit('assignProgramToLocation', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
        if (error.response.status === 422) {
          commit('errorMsg', error.response.data)
        }
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
  })
}

export const locationPrograms = async ({ commit }, data) => {
  let url = data.entityType != "" ? API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}/program?entityType=${data.entityType}` : API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}/program`
  await serviceMethod.common("get", url, null, null).then((response) => {
    commit('locationPrograms', {
      data: response.data.data,
      entityType: data.entityType
    });
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
  })
}

export const dropdownLocationPrograms = async ({ commit }, data) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}/program?entityType=${data.entityType}`, null, null).then((response) => {
    commit('dropdownLocationPrograms', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
  })
}

export const deleteLocationProgram = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['provider']+`/${data.providerID}/location/${data.locationID}/program/${data.programID}?entityType=${data.entityType}`, null, null).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
        if (error.response.status === 422) {
          commit('errorMsg', error.response.data)
        }
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })

}

export const providerContact = async ({ commit }, providerId) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${providerId}/contact`, null, null).then((response) => {
    if(response.data.data.length > 0) {
      commit('providerContact', response.data.data[0]);
    }
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const addProviderContact = async ({ commit }, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['provider']+`/${data.providerId}/contact`, null, data.data).then((response) => {
    commit("providerCounterPlus");
    commit('addProviderContact', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const updateProviderContact = async ({ commit }, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['provider']+`/${data.providerId}/contact/${data.contactId}`, null, data.data).then((response) => {
    commit("providerCounterPlus");
    commit('addProviderContact', response.data.data);
    commit('providerContact', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const addProviderSubLocation = async ({ commit }, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}/subLocation?entityType=${data.entityType}`, null, data.data).then((response) => {
    commit('addProviderSubLocation', response.data.data)
    successSwal(response.data.message)
  })
}

export const getProviderPrograms = async ({ commit }, providerId) => {
  await serviceMethod.common("get", API_ENDPOINTS['provider']+`/${providerId}`, null, null).then((response) => {
    commit('getProviderPrograms', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const staffProviders = async ({ commit }, staffId) => {
  let url = staffId != null ? API_ENDPOINTS['staff']+`/${staffId}/provider` : `provider?active=1`
  await serviceMethod.common("get", url, null, null).then((response) => {
 
    commit('staffProviders', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const increaseLocationCount = async ({ commit }, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['provider']+`/${data.providerId}/locationUpdate`, null, {
    countLocations: data.countLocations
  }).then(() => {
    
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const headerGroups = async ({ commit }, data) => {
  let url = ""
  if(data.staffId) {
    url = API_ENDPOINTS['staff']+`/${data.staffId}/group`
  }
  else if(data.providerId) {
    if(data.locationId) {
      url = API_ENDPOINTS['provider']+`/${data.providerId}/location/${data.locationId}/group`
    }
    else {
      url = API_ENDPOINTS['provider']+`/${data.providerId}/group`
    }
  }
  
  await serviceMethod.common("get", url, null).then((response) => {
    commit('headerGroups', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      }
      else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      }
      else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}