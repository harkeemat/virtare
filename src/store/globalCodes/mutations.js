import { dateFormat } from '../../commonMethods/commonMethod';

export const globalCode = async (state, globalCodes) => {
  state.globalCodesList = globalCodes.data.map(codes => {
   
      codes.isActive = codes.isActive == 1 ? true : false
  return codes
  });
 

  
  state.globalMeta = globalCodes.meta.pagination
}

export const searchGlobalCodesSuccess = async (state, globalCodes) => {
  state.globalCodesList = globalCodes.map(globalCode => {
    globalCode.createdAt = dateFormat(globalCode.createdAt);
    return globalCode;
  })
}

export const addGlobalCodeSuccess = async (state, globalCode) => {
  state.addGlobalCode = globalCode;
}

export const deleteGlobalCodeSuccess = async (state, globalCode) => {
  state.deleteGlobalCode = globalCode;
}

export const globalCodeDetailsSuccess = async (state, globalCode) => {
  state.globalCodeDetails = globalCode
}

export const updateGlobalCodeSuccess = async (state, globalCode) => {
  state.updateGlobalCode = globalCode;
}