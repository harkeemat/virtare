import api from '@/services/api';



export const createChannel = async ({
  commit
}, data) => {
  try {

    let response = await api.get(`get-chanel/${data.patientId}`, null, null)
    commit('createChannel', response.data.data)
    commit('loadingTableStatus', false)
    return response
  } catch {
    commit('loadingTableStatus', false)
  }
}

export const getMsgUnreadCount = async ({
  commit
}, id) => {
  try {
    let response = await api.get(`sendbird/${id}/message-count`, null, null)
    commit('msgUnreadCount', response.data.data)
    commit('loadingTableStatus', false)
    return response
  } catch {
    commit('loadingTableStatus', false)
  }
}


export const readChat = async ({
  commit
}, id) => {
  try {
    let response = await api.get(`read-chat/${id}`, null, null)
    // commit('msgUnreadCount', response.data.data)
    commit('loadingTableStatus', false)
    return response
  } catch {
    commit('loadingTableStatus', false)
  }
}
