import serviceMethod from '@/services/serviceMethod'
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'

export const questionnaireTemplateSectionList = async ({
  commit
},page) => {
  let link = page ? API_ENDPOINTS['questionnaireTemplateSection']+page : API_ENDPOINTS['questionnaireTemplateSection']
  commit('loadingStatus', true)
  await serviceMethod.common("get", link, null, null).then((response) => {

    commit('questionnaireSection', response.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    commit('loadingStatus', false)
  })
}
export const addQuestionnaireTemplateSection = async ({
  commit
},data) => {
  await serviceMethod.common("post", API_ENDPOINTS['questionnaireTemplateSection'], null, data.data).then((response) => {
    commit('questionnaireTemplateSection', response.data.data);
    if(data.show){
    successSwal(response.data.message)
    }
    commit('successMsg',response.data.message)
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    
    
  })
}
export const detailsQuestionnaireTemplateSection = async ({
  commit
},id) => {
  commit('loadingTableStatus', true)
 
  await serviceMethod.common("get", API_ENDPOINTS['questionnaireTemplateSection'], id, null).then((response) => {

    commit('detailsQuestionnaireTemplate', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    commit('loadingTableStatus', false)
    
    
  })
}
 
export const updateQuestionnaireTemplateSection = async ({
  commit
},data) => {
  await serviceMethod.common("put", API_ENDPOINTS['questionnaireTemplateSection'], data.id, data.data).then((response) => {
    if(data.show){
      successSwal(response.data.message)
    }
    
    commit('successMsg',response.data.message)
   
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    
    
    
  })


}
export const deleteQuestionnaireTemplateSection = async ({
  commit
},id) => {

  await serviceMethod.common("delete", API_ENDPOINTS['questionnaireTemplateSection'], id, null).then((response) => {
    successSwal(response.data.message)
    commit('successMsg',response.data.message)
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
  
    
    
  })


}
//assign question to section
export const templateSectionDetailsList = async ({
  commit
},id) => {
  commit('loadingTableStatus', true)
 
  await serviceMethod.common("get", API_ENDPOINTS['questionnaireTemplateSection']+'/'+id, null, null).then((response) => {


    commit('sectionDetailsList', response.data);
    
    commit('loadingTableStatus', false)
    
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    commit('loadingTableStatus', false)
    
    
  })
}
//Show all sections in drow down
export const allSections = async ({
  commit
},page) => {
  let link = page ? API_ENDPOINTS['questionnaireTemplateSection']+page : API_ENDPOINTS['questionnaireTemplateSection']
  commit('loadingStatus', true)
  await serviceMethod.common("get", link, null, null).then((response) => {

    commit('allSections', response.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    errorLogWithDeviceInfo(error)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data)
    }
    commit('loadingStatus', false)
  })
}

// export const scoreCount = async ({
//   commit
// },id) => {
//   await serviceMethod.common("post", 'questionnaire/response/score/'+id, null, null).then((response) => {

    
//     commit('scoreCount',response.data.data)
    
//   }).catch((error) => {
//     errorLogWithDeviceInfo(error)
//     if (error.response.status === 422) {
//       commit('errorMsg', error.response.data)
//     } else if (error.response.status === 500) {
//       errorSwal(error.response.data.message)
//     } else if (error.response.status === 401) {
//       errorSwal(error.response.data.message)
//     }
    
    
    
//   })
// }



