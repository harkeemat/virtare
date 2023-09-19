import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import {
	successSwal,
	// errorSwal,
	errorLogWithDeviceInfo
} from '@/commonMethods/commonMethod'

export const addNote = async ({ commit }, { id, data }) => {
  commit('loadingStatus', true)
	await ServiceMethodService.common("post", API_ENDPOINTS['patient'] + '/' + id + '/notes', null, data).then((response) => {
		commit('addNoteSuccess', response.data.data);
		commit('loadingStatus', false)
    successSwal(response.data.message)
    commit('errorMsg', null)
	}).catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if(error.response.status == 422) {
      commit('errorMsg', error.response.data)
		}
		else if(error.response.status == 500) {
    //   errorSwal(error.response.data.message)
		}
		else if (error.response.status == 401) {
			//AuthService.logout()
		}
		commit('failure', error.response.data)
	})
}

export const notesList = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['patient'] + '/' + id + '/notes', null, null).then((response) => {
		commit('notesListSuccess', response.data.data);
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
			commit('loadingStatus', false)
		})
}

export const latestNotes = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['patient'] + '/' + id + '/notes' + '?latest=latest', null, null).then((response) => {
		if (response.data.data.length > 0) {
			commit('latestNotesSuccess', response.data.data);
		}
		else {
			commit('latestNotesSuccess', null)
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
		})
}