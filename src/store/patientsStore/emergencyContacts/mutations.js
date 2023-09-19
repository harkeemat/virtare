
export const successMsg = (state, data) => {
  state.successMsg = data
}

export const errorEmergencyContact = (state, data) => {
  state.errorEmergencyContact = data
}

export const addEmergencyContact = (state, data) => {
  state.addEmergencyContact = data
}

export const emergencyContacts = (state, data) => {
  state.emergencyContacts = data
}

export const emergencyContactDetails = (state, data) => {
  data.contactTime = JSON.parse(data.contactTimeId)
  data.contactType = JSON.parse(data.contactType)
  state.emergencyContactDetails = data
}

export const updateEmergencyContact = (state, data) => {
  state.updateEmergencyContact = data
}

