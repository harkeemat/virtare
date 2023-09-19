import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal, startimeAdd, endTimeAdd, timeStamp,errorLogWithDeviceInfo} from '@/commonMethods/commonMethod'

export const callPlanned = async ({ commit },from) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['CallPlanned']+"?fromDate=" + timeStamp(startimeAdd(from.fromDate)) + "&toDate=" + timeStamp(endTimeAdd(from.toDate)), null, null).then((response) => {
		
		commit('callPlannedSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const addCommunication = async ({ commit }, data) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("post", API_ENDPOINTS['communication'], null, data).then((response) => {
		commit('addCommunication', response.data.data);
		commit('loadingStatus', false)
		if(data.entityType == 'staff') {
			successSwal(response.data.message)
		}
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
		// errorSwal(error.response.data.message)
		commit('loadingStatus', false)
	})
}

export const communicationsView = async ({ commit },id) => {
	commit('loadingTableStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['communicationsView'], id, null).then((response) => {
		
		commit('communicationsView', response.data.data);
		commit('loadingTableStatus', false)
	})
	.catch((error) => {
		commit('loadingTableStatus', false)
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const communicationTypes = async ({ commit },from) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['communicationTypes']+"?fromDate=" + timeStamp(startimeAdd(from.fromDate)) + "&toDate=" + timeStamp(endTimeAdd(from.toDate)), null, null).then((response) => {
		commit('communicationTypesSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('failure', error);
	})
}

export const communicationsList = async ({ commit }, page) => {
	let link = page ?API_ENDPOINTS['communicationsList']+page : API_ENDPOINTS['communicationsList']
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('communication', response.data);
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const callDetails = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['communication']+`/${id}/call`, null, null).then((response) => {
		commit('callDetails', response.data.data);
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const patientsList = async ({ commit }) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['patientsList'], null, null).then((response) => {
		commit('patientsListSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const futureAppointments = async ({ commit }) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['futureAppointments'], null, null).then((response) => {
		commit('futureAppointmentsSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const newRequests = async ({ commit }) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['newRequests'], null, null).then((response) => {
		commit('newRequestsSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const communicationsCount = async ({ commit }, from) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['communicationsCount']+"?fromDate=" + timeStamp(startimeAdd(from.fromDate)) + "&toDate=" + timeStamp(endTimeAdd(from.toDate)), null).then((response) => {
		commit('communicationsCountSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const searchCommunications = async ({ commit }, params) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['communicationsList']+'?search='+params, null, null).then((response) => {
		commit('searchCommunicationsSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const conversation = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['getConversation']+"?conversationId="+id, null, null).then((response) => {
		commit('conversation', response.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const conversationSend = async ({ commit },data) => {
	await ServiceMethodService.common("post", API_ENDPOINTS['conversationSend'], null, data).then((response) => {
		commit('conversationSend', response.data.data);
		commit('toScroll', true)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const latestmessage = async ({ commit },id) => {
	await ServiceMethodService.common("get", 'latest-message?conversationId='+id, null, null).then((response) => {
		commit('latestmessage', response.data.data);
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const status = async ({ commit },from) => {
    await ServiceMethodService.common("get", API_ENDPOINTS['callStatus'] +"?fromDate=" + timeStamp(startimeAdd(from.fromDate)) + "&toDate=" + timeStamp(endTimeAdd(from.toDate)), null, null).then((response) => {
        commit('callStatusSuccess', response.data.data)

    }).catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status == 401) {
            //AuthService.logout();
        }
        commit('failure', error.response.data);
    })
}

export const conversationWithPatient = async ({ commit }, receiverId) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['conversation']+`?receiverId=${receiverId}`, null, null).then((response) => {
		commit('conversationWithPatient', response.data.data)
	}).catch((error) => {
		if(error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			errorLogWithDeviceInfo(error);
		}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const replyCommunication = async ({ commit }, data) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("post", API_ENDPOINTS['communication']+`/${data.communicationId}/reply`, null, data.data).then((response) => {
		commit('loadingStatus', false)
		console.log(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
			if (error.response.status == 401) {
				//AuthService.logout();
			}
			errorLogWithDeviceInfo(error.response);
		}
		else {
			errorLogWithDeviceInfo(error);
		}
		commit('failure', error.response.data);
		commit('loadingStatus', false)
		// errorSwal(error.response.data.message)
	})
}

export const timeApproval = async ({ commit }, data) => {
	await ServiceMethodService.common("post", API_ENDPOINTS['timeApproval'], null, data).then((response) => {
		if(data.isAutomatic) {
			localStorage.setItem('timeApprovalId', response.data.data.id)
		}
	})
	.catch((error) => {
		if (error.response) {
			if (error.response.status == 401) {
				//AuthService.logout();
			}
			errorLogWithDeviceInfo(error.response);
		}
		else {
			errorLogWithDeviceInfo(error);
		}
		commit('failure', error.response.data);
	})
}

export const updateTimeApproval = async ({ commit }, data) => {
	await ServiceMethodService.common("put", API_ENDPOINTS['timeApproval'], data.timeApprovalId, data.data).then((response) => {
		if(data.isAutomatic) {
			localStorage.setItem('timeApprovalId', response.data.data.id)
		}
	})
	.catch((error) => {
		if (error.response) {
			if(error.response.status == 401) {
				//AuthService.logout();
			}
			errorLogWithDeviceInfo(error.response);
		}
		else {
			errorLogWithDeviceInfo(error);
		}
		commit('failure', error.response.data);
	})
}


export const showSmsData = async ({ commit }, id) => {
	await ServiceMethodService.common("get", `communication/messages/${id}`, null, null).then((response) => {
		commit('showSmsData', response.data.data)
	}).catch((error) => {
		if(error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			errorLogWithDeviceInfo(error);
		}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}