  export const familyMemberList = (state, data) => {
  state.familyMemberList = data?.data
  state.familyMemberMeta = data?.meta ? data?.meta?.pagination : ''
}
export const familyMemberError = (state,data) =>{
  state.familyMemberError = data
}
export const detailOfFamilyMember = (state,data) =>{
  state.detailOfFamilyMember = data?.data
}