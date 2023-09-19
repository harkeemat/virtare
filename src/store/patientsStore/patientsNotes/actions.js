
import { patientsNotes, searchTags, patientPinNote } from "@/config/apiConfig"
import { successSwal } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const patientNotesList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? patientsNotes(page?.id) + page?.filter : patientsNotes(page?.id)
  try {
    let { data } = await api.get(url, null, null)
    commit('patientNotesList', data)
  } catch (error) {
    console.warn(error)
  }
  commit('patientTabLoader', false)
}
//Add medical history 
export const addPatientNotes = async ({
  commit
}, record) => {
  commit('loading', true)
  let status = false
  commit('patientTabLoader', true)
  let url = patientsNotes(record?.id)
  //let method = data?.id ? api.post: api.post
  try {
    let { data } = await api.post(url, record?.data, null)
    successSwal(data?.message)
    status = true
  } catch (error) {
    console.warn(error)
  }
  commit('loading', false)
  commit('patientTabLoader', false)
  return status
}

//auto complete
export const autoCompleteCategory = async ({
  commit
}, record) => {
  let url = searchTags(record?.id)
  //let method = data?.id ? api.post: api.post
  try {
    const { data } = await api.get(url)
    commit('autoCompleteCategory', data?.data)
  } catch (error) {
    console.warn(error)
  }
}
//show Notes in pin or alert 
export const pinNotes = async ({
  commit
}, record) => {
  let url = patientPinNote(record?.id)
  try {
    const { data } = await api.get(url)
    commit('pinNotes', data)
  } catch (error) {
    console.warn(error)
  }
}
export const statusChangePinNotes = async ({
  commit
}, data) => {
  let status = false
  commit('loading', true)
  let url = patientPinNote(data?.id)
  try {
    await api.put(url, data?.data)
    status = true
  } catch (error) {
    console.warn(error)
  }
  commit('loading', false)
  return status
}