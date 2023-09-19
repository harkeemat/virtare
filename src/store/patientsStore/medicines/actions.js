
import { medicinesAdd } from "@/config/apiConfig"
//import { successSwal } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const medicinesList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? medicinesAdd(page?.id) + page?.filter : medicinesAdd(page?.id)
  await api.get(url, null, null).then((response)=>{
  commit('medicinesList', response?.data)
  
  }).catch(()=>{
  })
  commit('patientTabLoader', false)
}




