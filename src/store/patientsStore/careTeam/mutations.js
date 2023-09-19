export const patietCareTeamList = (state, data) => {
  state.patietCareTeamList = data?.data
  state.careTeamMeta = data?.meta
}
export const patietSpecialistList = (state, data) => {
  state.patietSpecialistList = data?.data
}
export const membersFromCareTeam = (state, data) => {
  state.membersFromCareTeam = data?.data.map((item)=>{
    item.udid = item?.contactPerson?.udid
    // item.name = item?.contactPerson?.name
    item.name = item?.name
    return item
  })
}
export const careTeamError = (state, data) => {
  state.careTeamError = data
}
export const patientsCareTeamDetail = (state, data) => {
  state.patientsCareTeamDetail = data?.data
}
export const specialistListDrowpDown = (state,data)=>{
  state.specialistListDrowpDown =data?.data
}