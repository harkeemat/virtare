
import { familyMemberListing,addFamilyMember,API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const familyMemberList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? familyMemberListing(page?.id) + page?.filter : familyMemberListing(page?.id)
  try{
  const {data } = await api.get(url)
  commit('familyMemberList', data)
  }catch(error){
    commit('familyMemberError',error)
  }
  commit('patientTabLoader', false)
}
//add family member for patient
export const addfamilyMember = async ({
  commit
}, record) => {
  let status = false
  commit('patientTabLoader', true)
  commit('loading',true)
  let url = record?.familyMemberId ? addFamilyMember(record?.id)+'/'+record?.familyMemberId : addFamilyMember(record?.id)
  try{
 const {data} =   record?.familyMemberId ? await api.put(url,record?.data): await api.post(url,record?.data)
  successSwal(data?.message)
  status = true
  }catch(error){
    commit('familyMemberError',error?.response?.data)
  }
  commit('patientTabLoader', false)  
  commit('loading',false)
  return status
}
//Get detail of famliy member by udid
export const detailOfFamilyMember = async ({
  commit
}, record) => {
  commit('patientTabLoader', true)
  let url = API_ENDPOINTS['familyMemberDetail']+'/'+record?.familyMemberId
  try{
      const {data } = await api.get(url)
    commit('detailOfFamilyMember',data)
  }catch(error){
    commit('familyMemberError',error?.response?.data)
  }
  commit('patientTabLoader', false)  
}
//Delete patient family member 
export const deleteFamilyMemberFromPatients = async ({
  commit
}, record) => {
  commit('patientTabLoader', true)
  let url = API_ENDPOINTS['deleteFamilyMember']+'/'+record?.familyMemberId
  try{
  const {data } =  await api.delete(url)
    successSwal(data?.message)
  }catch(error){
    commit('familyMemberError',error)
  }
  commit('patientTabLoader', false)  
}
