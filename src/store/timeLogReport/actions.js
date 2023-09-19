import ServiceMethodService from '@/services/serviceMethod'
import { successSwal, errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'


export const timeLogReportList = async ({ commit }, page) => {
	commit('loadingTableStatus', true)
	let link = page ? "timeLog" + page : "timeLog"
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('timeLog', response.data);
		commit('loadingTableStatus', false)
	}).catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status === 422) {
			commit('errorMsg', error.response.data)
			commit('loadingTableStatus', false)
		} else if (error.response.status === 500) {
			// errorSwal(error.response.data.message)
			commit('loadingTableStatus', false)
		} else if (error.response.status === 401) {
			commit('loadingTableStatus', false)
		}
	})
}
export const timeLogView = async ({ commit }, data) => {
	commit('loadingTableStatus', true)
	await ServiceMethodService.common("get", 'changeAuditLog', data, null).then((response) => {
		commit('timeLogView', response.data);
		commit('loadingTableStatus', false)
		
	}).catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('loadingTableStatus', false)
		commit('errorMsg', error.response.data)
	})
}
export const reportExport = async ({ commit }, data) => {
	await ServiceMethodService.common("post", `export/report/request`, null, data).then((response) => {
		commit('reportExport', response.data);
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
}

export const editAuditTimeLog = async ({ commit }, id) => {
	await ServiceMethodService.common("get", `timeLog/${id}`, null, null).then((response) => {
		commit('editAuditTimeLog', response.data.data);
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
}

export const updateAuditTimeLog = async ({ commit }, data) => {
	await ServiceMethodService.common("put", `timeLog/${data.id}`, null, data.data).then((response) => {
		// commit('updateTimeLog', response.data.data);
		successSwal(response.data.message)
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
}

export const deleteTimeLog = async ({ commit }, uuid) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("delete", `timeLog/${uuid}`, null, null).then((response) => {
		commit('deleteTimeLog', response.data.data);
		successSwal(response.data.message)
		commit('loadingStatus', false)

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
}
export const auditTimeLogFilterDates = ({commit},date) =>{
	commit('auditTimeLogFilterDates', date);
}

