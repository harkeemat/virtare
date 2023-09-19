export const cptCodeActivities = async (state, cptCodes) => {

  state.cptCodesList = cptCodes.data.map(element => {
    
      element.billingAmout = '$ ' + element.cptCode.billingAmout
      element.cptCode = element.cptCode.name
      element.friendlyName = element.name1
      

      return element

})

  state.cptMeta=cptCodes.meta ? cptCodes.meta.pagination : ''
}

export const addCptCode = async (state, cptCode) => {
  state.addCptCode = cptCode;
}

export const deleteCptCode = async (state, cptCode) => {
  state.deleteCptCode = cptCode;
}

export const cptCodeDetails = async (state, cptCode) => {
  state.cptCodeDetails = cptCode;
}

export const updateCptCode = async (state, cptCode) => {
  state.updateCptCode = cptCode;
}
export const service = async (state, service) => {
  state.service = service;
}

export const timeLogLoaderStatus = async (state, data) => {
  state.timeLogLoaderStatus = data;
}

export const activitiesList = async (state, data) => {
  state.activitiesList = data.map(element => {
    element.friendlyName = element.name
    return element
  })
}
