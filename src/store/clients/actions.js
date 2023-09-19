
import { API_ENDPOINTS, clientProgram, sitePrograms } from "@/config/apiConfig"
import api from '@/services/api';
import {
  successSwal,
  checkAndQuesSymbol
} from '@/commonMethods/commonMethod'

export const addClient = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  let url = API_ENDPOINTS['addClient']
  try {
    const { data } = await api.post(url, record, null)
    commit('addClient', data?.data)
    successSwal(data?.message)
    commit('clientLoadingStatus', false)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
    commit('loading', false)
    commit('clientLoadingStatus', false)
  }
  return status
}

export const clientsList = async ({ commit }, filter) => {
  commit('clientLoadingStatus', true)
  let url = filter?.filter ? API_ENDPOINTS['getClient'] + checkAndQuesSymbol(filter?.filter) : API_ENDPOINTS['getClient']
  try {
    const { data } = await api.get(url, null, null)
    commit('clientsList', data)
    
  } catch (error) {
    commit('CLIENTS_ERROR', error)
    //commit('clientLoadingSerrorClientstatus', false)
  }
  commit('clientLoadingStatus', false)
}

export const clientInformation = async ({ commit }, clientId) => {
  commit('clientLoadingStatus', true)
  let url = API_ENDPOINTS['getClient'] + `/${clientId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('clientInformation', data?.data)
    commit('clientLoadingStatus', false)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
    commit('clientLoadingStatus', false)

  }

}

export const updateClient = async ({ commit }, record) => {
  let status = false
  commit('AddClientLoadingStatus', true)
  commit('loading', true)
  let url = API_ENDPOINTS['updateClient'] + `/${record.clientId}`
  try {
    const { data } = await api.put(url, record?.data, null)
    commit('updateClient', data?.data)
    successSwal(data?.message)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('AddClientLoadingStatus', false)
  commit('loading', false)
  return status
}

export const updateClientStatus = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  let reqData = {
    statusId: record.statusId
  }
  let url = API_ENDPOINTS['updateStatus'] + `/${record.clientId}?statusId=${record.statusId}`
  try {
    const { data } = await api.put(url, reqData, null)
    commit('clientInformation', data?.data)
    commit('clientLoadingStatus', false)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
    commit('clientLoadingStatus', false)
  }
  return status

}

export const addClientSite = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  try {
    const { data } = await api.post(API_ENDPOINTS['client'] + `/${record.clientId}/` + API_ENDPOINTS['site'], record.data)
    successSwal(data.message)
    commit('addClientSite', data.data);
    status = true
  } catch (error) {
    commit('errorClients', error.response.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const sitesList = async ({ commit }, clientId) => {
  commit('clientLoadingStatus', true)
  let url = clientId?.filter ? API_ENDPOINTS['client'] + `/${clientId?.clientId}/` + API_ENDPOINTS['site'] + checkAndQuesSymbol(clientId?.filter) : API_ENDPOINTS['client'] + `/${clientId?.clientId}/` + API_ENDPOINTS['site']
  try {
    const { data } = await api.get(url)
    commit('sitesList', data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
}

export const sitesListDropdown = async ({ commit }, clientId) => {
  let status = false
  commit('clientLoadingStatus', true)
  try {
    const { data } = await api.get(API_ENDPOINTS['client'] + `/${clientId}/` + API_ENDPOINTS['siteList'])
    commit('sitesListDropdown', data.data);
    status = true
  } catch (error) {
    commit('CLIENTS_ERROR', error)
    commit('errorClients', error.response.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const clientSiteDetails = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  try {
    const { data } = await api.get(API_ENDPOINTS['client'] + `/${record.clientId}/` + API_ENDPOINTS['site'] + `/${record.siteId}`)
    status = true
    commit('clientSiteDetails', data.data);
  } catch (error) {
    commit('errorClients', error.response.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const updateClientSite = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  try {
    const { data } = await api.put(API_ENDPOINTS['client'] + `/${record.clientId}/` + API_ENDPOINTS['site'] + `/${record.siteId}`, record.data)
    successSwal(data.message)
    commit('updateClientSite', data.data);
    status = true
  } catch (error) {
    commit('errorClients', error.response.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const deleteSite = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  try {
    await api.delete(API_ENDPOINTS['client'] + `/${record.clientId}/` + API_ENDPOINTS['site'] + `/${record.siteId}`)
    commit('clientLoadingStatus', false)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const addPeople = async ({ commit }, record) => {
  let status = false
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['people']
  try {
    const { data } = await api.post(url, record.data)
    status = true
    commit('addPeople', data?.data)
    successSwal(data?.message)
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('loading', false)
  commit('AddClientLoadingStatus', false)
  return status

}

export const peopleList = async ({ commit }, record) => {
  commit('clientLoadingStatus', true)
  let url = record?.filter ? API_ENDPOINTS['peopleListing'] + `/${record?.clientId}` + checkAndQuesSymbol(record?.filter) : API_ENDPOINTS['peopleListing'] + `/${record?.clientId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('peopleList', data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
}

export const peopleListDropdown = async ({ commit }, record) => {
  let url = API_ENDPOINTS['teamHead'] + `/${record?.clientId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('peopleListDropdown', data?.data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
}

export const peopleDetails = async ({ commit }, record) => {
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['peopleDetail'] + `/${record?.id}/${record?.clientId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('peopleDetails', data?.data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('AddClientLoadingStatus', false)
  return true

}
export const updatePeople = async ({ commit }, record) => {
  let status = false
  commit('AddClientLoadingStatus', false)
  commit('loading', true)
  let url = API_ENDPOINTS['peopleUpdate'] + `/${record?.id}`
  try {
    const { data } = await api.put(url, record?.data)
    successSwal(data?.message)
    status = true
  } catch (error) {

    commit('errorClients', error?.response?.data)
  }
  commit('loading', false)
  commit('AddClientLoadingStatus', false)
  return status

}
export const siteHead = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  let url = record?.status ? API_ENDPOINTS['teamHead'] + `/${record?.id}/${record?.status}` : API_ENDPOINTS['teamHead'] + `/${record?.id}`
  try {
    const { data } = await api.get(url)
    commit('siteHead', data?.data);
    status = true

  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
  return status
}
export const removePeople = async ({ commit }, record) => {
  let status = false
  commit('clientLoadingStatus', true)
  let url = API_ENDPOINTS['client'] + `/${record?.clientId}/` + API_ENDPOINTS['people'] + `/${record?.peopleId}/`
  try {
    const { data } = await api.put(url, record?.data)
    successSwal(data?.message)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

// Care Team APIs

export const addCareTeam = async ({ commit }, record) => {
  let status = false
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['createCareTeam']
  try {
    const { data } = await api.post(url, record)
    successSwal(data?.message)
    commit('addCareTeam', data?.message);
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('AddClientLoadingStatus', false)
  return status
}

export const careTeamListByClient = async ({ commit }, record) => {
  commit('clientLoadingStatus', true)
  let url = record?.filter ? API_ENDPOINTS['careTeamListByClient'] + `/${record?.clientId}` + checkAndQuesSymbol(record?.filter) : API_ENDPOINTS['careTeamListByClient'] + `/${record?.clientId}`
  try {
    const { data } = await api.get(url)
    commit('careTeamListByClient', data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
}

export const careTeamDetails = async ({ commit }, careTeamId) => {
  let status = false
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['careTeamDetails'] + `/${careTeamId}`
  try {
    const { data } = await api.get(url)
    commit('careTeamDetails', data?.data);
    status = true
  } catch (error) {
    commit('errorClients', error.response.data)
  }
  commit('AddClientLoadingStatus', false)
  return status
}

export const updateCareTeam = async ({ commit }, record) => {
  let status = false
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['updateCareTeam'] + `/${record.careTeamId}`
  try {
    const { data } = await api.put(url, record?.data)
    successSwal(data?.message)
    commit('updateCareTeam', data?.data);
    status = true
  } catch (error) {
    commit('errorClients', error.response.data)
  }
  commit('AddClientLoadingStatus', false)
  return status
}

export const deleteCareTeam = async ({ commit }, careTeamId) => {
  let status = false
  commit('clientLoadingStatus', true)
  let url = API_ENDPOINTS['destroyCareTeam'] + `/${careTeamId}`
  try {
    const { data } = await api.delete(url, null)
    successSwal(data.message)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('clientLoadingStatus', false)
  return status
}

export const careTeamMembersList = async ({ commit }, careTeamId) => {
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['careTeamMembersList'] + `/${careTeamId}`
  try {
    const { data } = await api.get(url)
    commit('careTeamMembersList', data?.data)
    commit('AddClientLoadingStatus', false)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('AddClientLoadingStatus', false)
}

export const destroyCareTeamMember = async ({ commit }, careTeamId) => {
  let status = false
  commit('clientLoadingStatus', true)
  let url = API_ENDPOINTS['destroyCareTeamMember'] + `/${careTeamId}`
  try {
    const { data } = await api.delete(url, null, null)
    successSwal(data?.message)
    status = true
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
  return status
}

//clients program
export const clientProgramRecord = async ({
  commit
}, record) => {
  try {
    const { data } = await api.get(clientProgram(record?.id))
    commit('clientProgramRecord', data?.data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
}

export const addCareTeamMember = async ({ commit }, record) => {
  let status = false
  commit('loading', true)
  commit('AddClientLoadingStatus', true)
  let url = API_ENDPOINTS['addCareTeamMember']
  try {
    const { data } = await api.post(url, record)
    successSwal(data?.message)
    status = true
  } catch (error) {
    commit('errorClients', error?.response?.data)
  }
  commit('AddClientLoadingStatus', false)
  commit('loading', false)
  return status
}

export const siteProgramsList = async ({ commit }, siteId) => {
  commit('AddClientLoadingStatus', true)
  try {
    const { data } = await api.get(sitePrograms(siteId), null, null)
    commit('siteProgramsList', data.data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('AddClientLoadingStatus', false)
}
export const clientPatientsRecord = async ({ commit }, record) => {
  commit('clientLoadingStatus', true)
  let url = record?.filter ? API_ENDPOINTS['clientPatients'] + `/${record?.clientId}` + checkAndQuesSymbol(record?.filter) : API_ENDPOINTS['clientPatients'] + `/${record?.clientId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('clientPatientsRecord', data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
}

//address
export const addressRecord = async ({ commit }, clientId) => {
  commit('clientLoadingStatus', true)
  let url = clientId?.clientId ? API_ENDPOINTS['addressGet'] + `/${clientId?.clientId}` : API_ENDPOINTS['addressGet']
  try {
    const { data } = await api.get(url, null, null)
    commit('addressRecord', data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
  commit('clientLoadingStatus', false)
}
export const staffSites = async ({ commit }) => {
  let url = API_ENDPOINTS['staffSites']
  try {
    const { data } = await api.get(url, null, null)
    commit('staffSites', data.data)
  } catch (error) {
    commit('CLIENTS_ERROR', error)
  }
}
//Client billing tab 
export const clientBillingList = async ({ commit }, param) => {
  commit("CLIENT_BILLING_LOADING", true);
  try {
    const { data } = await api.get(`list/patient/billingReport?clientId=${param}`)
    commit('CLIENT_BILLING_LIST', data)
  } catch (error) {
    const { data, status } = error.response;
    if (typeof status !== 'undefined' && status === 422)
      commit('CLIENT_BILLING_ERROR', data)
  }
  commit("CLIENT_BILLING_LOADING", false)
}
 
export const allPeopleList = async ({ commit }, clientId) => {
  let apiStatus = false
  commit("AddClientLoadingStatus", true);
  try {
    const { data } = await api.get(`people/getMemberList/${clientId}`)
    commit('allPeopleList', data?.data)
    apiStatus = true
  } catch (error) {
    const { data, status } = error.response;
    if (typeof status !== 'undefined' && status === 422) {
      commit('CLIENT_BILLING_ERROR', data)
    }
  }
  commit("AddClientLoadingStatus", false)
  return apiStatus
}

export const addExistingPerson = async ({ commit }, data) => {
  let apiStatus = false
  commit("AddClientLoadingStatus", true);
  try {
    await api.put(`people/updateClientStaff/${data.clientId}`, {
      staffId: data.staffId,
      type: data.type,
    })
    apiStatus = true
  }
  catch (error) {
    const { data, status } = error.response;
    if (typeof status !== 'undefined' && status === 422) {
      commit('CLIENT_BILLING_ERROR', data)
    }
  }
  commit("AddClientLoadingStatus", false)
  return apiStatus
}