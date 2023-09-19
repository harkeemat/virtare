// import {
//   dateFormatClient
// } from '@/commonMethods/commonMethod';
export const patientNotesList = (state, data) => {
  state.patientNotesList = data?.data
  state.notesMeta = data?.meta ? data?.meta?.pagination : ''
}
export const autoCompleteCategory = (state, data) => {
  state.autoCompleteCategory = data?.tags
}
export const pinNotes = (state, data) => {
  state.pinNotes = data?.data
}
//const sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});


