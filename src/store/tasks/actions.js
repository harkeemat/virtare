import ServiceMethodService from '@/services/serviceMethod';
import { successSwal, errorLogWithDeviceInfo,RemoveAndAdd } from '@/commonMethods/commonMethod';
import { API_ENDPOINTS } from '@/config/apiConfig';

export const tasksList = async ({ commit }, page) => {
	let link = page ? API_ENDPOINTS['task'] + page : API_ENDPOINTS['task'];
	commit('loadingTableStatus', true)
	await ServiceMethodService.common('get', link, null, null)
		.then((response) => {
			commit('task', response.data);
			// commit('tasksList', response.data.data);
		commit('loadingTableStatus', false)
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingTableStatus', false);
			}
		});
};

export const addTask = async ({ commit }, data) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common('post', API_ENDPOINTS['task'], null, data)
		.then((response) => {
			successSwal(response.data.message);
			commit('addTask', response.data.data);
			commit('loadingStatus', false)
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
			commit('loadingStatus', false)
		});
};

export const editTask = async ({ commit }, id) => {

	commit('loadingStatus', true);

	await ServiceMethodService.common('get', `task/` + id.id, null, null)
		.then((response) => {
			commit('editTask', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};

export const tasksDelete = async ({ commit }, id) => {
	commit('loadingTableStatus', true);
	await ServiceMethodService.common('delete', `task/${id}`, null, null)
		.then((response) => {
			successSwal(response.data.message);
			commit('tasksDelete', response.data.data);
			commit('loadingTableStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingTableStatus', false);
			}
		});
};

export const updateTask = async ({ commit }, data) => {
	commit('loadingTableStatus', true);

	await ServiceMethodService.common('put', `task/${data.id}`, null, data.data)
		.then((response) => {
			commit('updateTask', response.data.data);
			successSwal(response.data.message);
			commit('loadingTableStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingTableStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingTableStatus', false);
			}
		});
};

export const taskStatus = async ({ commit },page) => {
	commit('loadingStatus', true);
	let url = page ? API_ENDPOINTS['taskStatus']+RemoveAndAdd(page) : API_ENDPOINTS['taskStatus']
	await ServiceMethodService.common('get', url, null, null)
		.then((response) => {
			commit('taskStatusSuccess', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};
export const allTaskStatus = async ({ commit }) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', API_ENDPOINTS['allTaskStatus'], null, null)
		.then((response) => {
			commit('allTaskStatusSuccess', response.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};
export const completeTaskRate = async ({ commit }) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', API_ENDPOINTS['completeTaskRate'], null, null)
		.then((response) => {
		
			commit('completeTaskRate', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
			}
			commit('loadingStatus', false);
		});
};
export const taskPriority = async ({ commit }) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', API_ENDPOINTS['taskPriority'], null, null)
		.then((response) => {
			commit('taskPriority', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};

export const taskTeamMember = async ({ commit }) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', API_ENDPOINTS['taskTeamMember'], null, null)
		.then((response) => {
			commit('taskTeamMember', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};

export const taskCategory = async ({ commit }) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', API_ENDPOINTS['taskCategory'], null, null)
		.then((response) => {
			commit('taskCategory', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};

export const searchTasks = async ({ commit }, params) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['task']+`?active=1${params}`, null, null)
		.then((response) => {
			commit('searchTasks', response.data.data);
			commit('tasksList', response.data.data);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			if (error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			} else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			} else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		});
};

export const latestTask = async ({ commit }, id) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['patient'] + '/' + id + '/task', null, null)
		.then((response) => {
			if (response.data.data.length > 0) {
				commit('latestTaskSuccess', response.data.data);
			} else {
				commit('latestTaskSuccess', null);
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
		});
};



export const showTaskModalData = async ({ commit }, data) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common('get', `patient/${data.id}/taskAssigned${data.filters}`, null, null)
		.then((response) => {
			
			commit('showTaskModalData', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});
};


// export const timeLine = async ( { commit },id) => {
    
// 	let status = false
// 	if(store.state.common?.filterDateDataGet?.length>0){
// 		let object = arrayToObjectData(store.state.common?.filterDateDataGet,id?.id,'globalCodeId') 
// 		commit(id?.commit,object);   
// 		status = true
// 		return status
// 	}else{
// 		return status
// 	}
	

// }