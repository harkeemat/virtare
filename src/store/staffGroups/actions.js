import ServiceMethodService from '@/services/serviceMethod';
import {
	successSwal,
	// errorSwal,
	errorLogWithDeviceInfo
} from '@/commonMethods/commonMethod';
import { API_ENDPOINTS } from '@/config/apiConfig';

/**
 * Groups
*/

export const createGroup = async ({ commit }, data) => {
	await ServiceMethodService.common('post', API_ENDPOINTS['group'], null, data).then((response) => {
		commit("counterPlus");
		commit('createGroup', response.data.data);
		commit('groupDetails', response.data.data);
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const updateGroup = async ({ commit }, data) => {
	await ServiceMethodService.common('put', API_ENDPOINTS['group'], data.id, data.data).then((response) => {
		commit('createGroup', response.data.data);
		commit('groupDetails', response.data.data);
		successSwal(response.data.message);
		commit("counterPlus");
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const groupsList = async ({ commit },page) => {
	commit("groupLoadingStatus",true)
	let link = page ?API_ENDPOINTS['group']+page : API_ENDPOINTS['group']
	await ServiceMethodService.common('get', link, null, null).then((response) => {
		commit('groupsList', response.data);
		commit("groupLoadingStatus",false)
	})
	.catch((error) => {
		commit("groupLoadingStatus",false)
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}

	});
};

export const groupDetails = async ({ commit }, id) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['group'], id, null).then((response) => {
		commit('groupDetails', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const deleteGroup = async ({ commit }, id) => {
	await ServiceMethodService.common('delete', API_ENDPOINTS['group'], id, null).then((response) => {
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

/**
 * Groups Staff
*/

export const searchStaff = async ({ commit }, staff) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['staff']+`?search=${staff}`, null, null).then((response) => {
		commit('searchStaff', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const addStaffToGroup = async ({ commit }, data) => {
	await ServiceMethodService.common('post', API_ENDPOINTS['group']+`/${data.groupId}/staff`, null, data.data).then((response) => {
		successSwal(response.data.message);
		commit('addStaffToGroup', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const groupStaffList = async ({ commit }, groupId) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['group']+`/${groupId}/staff`, null, null).then((response) => {
		commit('groupStaffList', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const deleteGroupStaff = async ({ commit }, data) => {
	await ServiceMethodService.common('delete', API_ENDPOINTS['group']+`/${data.groupUdid}/staff/${data.id}`, null, null).then((response) => {
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

/**
 * Groups Programs
*/

export const searchProgram = async ({ commit }, program) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['program']+`?active=1&search=${program}`, null, null).then((response) => {
		commit('searchProgram', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const addProgramToGroup = async ({ commit }, data) => {
	await ServiceMethodService.common('post', API_ENDPOINTS['group']+`/${data.id}/program`, null, data.data).then((response) => {
		successSwal(response.data.message);
		commit('addProgramToGroup', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const groupProgramsList = async ({ commit }, id) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['group']+`/${id}/program`, null, null).then((response) => {
		commit('groupProgramsList', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const deleteGroupProgram = async ({ commit }, data) => {
	await ServiceMethodService.common('delete', API_ENDPOINTS['group']+`/${data.groupUdid}/program/${data.programUdid}`, null, null).then((response) => {
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

/**
 * Groups Providers
*/

export const searchProvider = async ({ commit }, provider) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['provider']+`?active=1&search=${provider}`, null, null).then((response) => {
		commit('searchProvider', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const addProviderToGroup = async ({ commit }, data) => {
	await ServiceMethodService.common('post', API_ENDPOINTS['group']+`/${data.id}/provider`, null, data.data).then((response) => {
		successSwal(response.data.message);
		commit('addProviderToGroup', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const groupProvidersList = async ({ commit }, id) => {
	await ServiceMethodService.common('get', API_ENDPOINTS['group']+`/${id}/provider`, null, null).then((response) => {
		commit('groupProvidersList', response.data.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const deleteGroupProvider = async ({ commit }, data) => {
	await ServiceMethodService.common('delete', API_ENDPOINTS['group']+`/${data.groupUdid}/provider/${data.providerUdid}`, null, null).then((response) => {
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

/**
 * Groups Permissions
*/

export const addGroupPermissions = async ({ commit }, data) => {

	await ServiceMethodService.common('post', API_ENDPOINTS['group']+`/${data.groupId}/permission`, null, data.actions).then((response) => {
		successSwal(response.data.message);
		commit('addGroupPermissions', response.status);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error)
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				// errorSwal(error.response.data.message);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				// commit('errorMsg', error.response.data.message)
				commit('loadingStatus', false);
			}
		}
	});
};

export const groupPermissions = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['group']+`/${id}/permission`, null, null).then((response) => {
		commit('groupPermissionsModules', response.data.data);
		commit('groupPermissions', response.data);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error.response)
		// errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}

export const addGroupComposition = async ({ commit }, data) => {
	await ServiceMethodService.common("post", API_ENDPOINTS['group']+`/${data.groupId}/composition`, null, data.data).then((response) => {
		commit('addGroupComposition', response.data.data);
		commit('groupCompositions', response.data.data);
		successSwal(response.data.message);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error.response)
		commit('failure', error.response.data);
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				commit('loadingStatus', false);
			}
		}
	})
}

export const groupCompositionDetails = async ({ commit }, groupId) => {
	commit('loadingStatus', true);
	await ServiceMethodService.common("get", API_ENDPOINTS['group']+`/${groupId}/composition`, null, null).then((response) => {
		commit('groupCompositionDetails', response.data.data);
		commit('loadingStatus', false);
	})
	.catch((error) => {
		errorLogWithDeviceInfo(error.response)
		commit('failure', error.response.data);
		if(error.response) {
			if(error.response.status === 422) {
				commit('errorMsg', error.response.data);
				commit('loadingStatus', false);
			}
			else if (error.response.status === 500) {
				commit('loadingStatus', false);
			}
			else if (error.response.status === 401) {
				commit('loadingStatus', false);
			}
		}
	})
}