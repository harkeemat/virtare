export const patientCareCoordinatorsList = (state, data) => {
  state.latestCareCoordinator = data[0]
  state.patientCareCoordinatorsList = data.map(item => {
    item.isPrimary = item.isPrimary ? true : false
    item.type = item.type ? 'Care Coordinator' : 'Health Team'
    return item
  })
}

export const careTeamList = (state, data) => {
  state.careTeamList = data.map(item => {
    item.isPrimary = item.isPrimary ? true : false
    item.type = item.type? 'Care Coordinator' : 'Health Team',
    item.designation = item.staffData.data?.designation
    item.specialization = item.staffData.data?.specialization
    return item
  })
 
  state.latestHealthTeam = data.data[0]
  
}
export const staffArray = (state, data) => {
  
  state.staffRecord = data.map(item => {
    item.id = item.staffId
    return item
  }) 
}

export const specialist = (state, data) => {
  state.specialist = data.map(item => {
    item.designation = item.staffData.data?.designation  
    item.organisation = item.staffData.data?.organisation
    item.specialization = item.staffData.data?.specialization
    return item
  })
}

export const physiciansList = (state, data) => {
  state.physiciansList = data.map(item => {
    item.isPrimary = item.isPrimary ? true : false
    item.type = item.type? 'Care Coordinator' : 'Health Team'
    item.designation = item.staffData.data?.designation
    item.specialization = item.staffData.data?.specialization
    return item
  })
  state.latestPhysician = data[0]
  state.latestHealthTeam = data[0]
}

export const deletePatientCareCoordinator = (state, data) => {
  state.deletePatientCareCoordinator = data
}

export const patientCareCoordinatorDetails = (state, data) => {
  data.isPrimary = data.isPrimary == 1 ? true : false
  state.patientCareCoordinatorDetails = data
}

export const updatePatientCareCoordinator = (state, data) => {
  state.updatePatientCareCoordinator = data
}

