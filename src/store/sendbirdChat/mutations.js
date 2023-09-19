
export const createChannel = (state,data) => {
  state.createChannel = data
}


export const timerStatus = (state, data) => {
  state.timerStatus = data
}

export const chatTimerValue = (state, data) => {
  state.chatTimerValue = data
}

export const msgUnreadCount = (state, data) => {
  state.unReadCount = data?.unreadMessageCount
  state.patientId = data?.patientId
}


