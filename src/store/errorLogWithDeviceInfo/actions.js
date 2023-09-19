import serviceMethod from '@/services/serviceMethod'

export const errorLogWithDeviceInfo = async ({commit}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", `errorLog/with/deviceInfo`, null, data)
 }