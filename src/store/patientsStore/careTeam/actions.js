
import { careTeamAssign, API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const patietCareTeamList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? careTeamAssign(page?.id) + page?.filter : careTeamAssign(page?.id)
  try{
  const { data }=await api.get(url, null, null)
    commit('patietCareTeamList', data)
    commit('patientTabLoader', false)
  }catch(error){
    console.warn(error)
  }
  commit('patientTabLoader', false)
}

export const assignCareTeam = async ({
  commit
}, record) => {
  let status = false
  commit('loading', true)
  commit('patientTabLoader', true)
  let url = careTeamAssign(record?.id)
  let methode =  api.put 
  try{
    if(record?.data?.specialist){
      record.data.specialist.phoneNumber = record?.data?.specialist?.phoneNumber ? record?.data?.specialist?.phoneNumber.replace(/-/g, ''): ''
    }
  let specialistRecord = {
    "careTeamId": record?.data?.careTeamId,
    "nurseId": record?.data?.nurseId,
    "specialist": record?.data?.specialist?.specialistId ? record?.data?.specialist : ''
}
  const { data }=await methode(url, specialistRecord, null)
   //await api.post(API_ENDPOINTS['assignSpecialistToPatient'], record?.data?.specialist, null)
    successSwal(data?.message)
    status = true
  }catch(error) {
    commit('careTeamError', error?.response?.data)
  }
  commit('patientTabLoader', false)
  commit('loading', false)
  return status
}
export const membersFromCareTeam = async ({
  commit
}, record) => {
  try{
  const { data }=await api.post(API_ENDPOINTS['membersFromCareTeam'], record, null)
    commit('membersFromCareTeam', data)
  }catch(error){
   console.log(error)
  }
}
export const patientsCareTeamDetail = async ({
  commit
}, record) => {
  try{
  const {data} = await api.get(API_ENDPOINTS['patientsCareTeamDetail']+`/${record?.id}`, null, null)
    commit('patientsCareTeamDetail', data)
  }catch(error){
    console.log(error)
  }
}
//Specialist in patient
export const patietSpecialistList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
   
  try{
  const { data }=await api.get(API_ENDPOINTS['specialistsList']+`/${page?.id}`, null, null)
    commit('patietSpecialistList', data)
    commit('patientTabLoader', false)
  }catch(error){
    console.warn(error)
  }
  commit('patientTabLoader', false)
}

export const specialistListDrowpDown = async ({commit}) =>{
  try{
  const {data} = await api.get(API_ENDPOINTS['allSpecialists'], null, null)
  commit('specialistListDrowpDown', data)
  }catch(error){
    console.warn(error)
  }
}

