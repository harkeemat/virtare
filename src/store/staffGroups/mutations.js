
import {
  createdAtDateFormat
} from '../../commonMethods/commonMethod';

/**
 * Groups
*/

export const createGroup = async(state, data) => {
  state.createGroup = data;
}

export const groupDetails = async(state, group) => {
  group.isActive = group.isActive == 1 ? true : false
  group.level = group.providerLocation.levelId
  // group.providerLocation = group.providerLocation.locationName
  state.groupDetails = group;
}

export const groupsList = async(state, data) => {
  state.groupsList = data.data.map(item => {
    item.createdAt = createdAtDateFormat(item.createdAt)
    item.isActive = item.isActive ? true : false
    item.name = item.group
    return item
  });
  state.groupsMeta = data?.meta?.pagination
}

/**
 * Group Staff
*/

export const searchStaff = async(state, data) => {
  state.searchStaff = data;
}

export const addStaffToGroup = async(state, data) => {
  state.addStaffToGroup = data;
}

export const groupStaffList = async(state, data) => {
  state.groupStaffList = data.map(item => {
    item.fullName = item.firstName+' '+item.lastName
    return item
  });
}

/**
 * Group Programs
*/

export const searchProgram = async(state, data) => {
  state.searchProgram = data;
}

export const addProgramToGroup = async(state, data) => {
  state.addProgramToGroup = data;
}

export const groupProgramsList = async(state, data) => {
  state.groupProgramsList = data
}

/**
 * Group Providers
*/

export const searchProvider = async(state, data) => {
  state.searchProvider = data;
}

export const addProviderToGroup = async(state, data) => {
  state.addProviderToGroup = data;
}

export const groupProvidersList = async(state, data) => {
  state.groupProvidersList = data
}

/**
 * Group Permissions
*/

export const addGroupPermissions = async(state, data) => {
  state.addGroupPermissions = data
}

export const groupPermissionsModules = async (state, data) => {
  state.groupPermissionsModules = data;
}

export const groupPermissions = async (state, data) => {
  state.groupPermissions = data;
}

/**
 * Stepper Counter
*/

export const counterPlus = (state) => {
  state.counter++
}

export const counterMinus = (state) => {
  state.counter--
}

export const resetCounter = (state) => {
  state.counter = 0
}

export const errorMsg = (state, data) => {
  state.errorMsg = data
}

export const dropdownList = (state, data) => {
  state.dropdownList = data
}

export const addGroupComposition = (state, data) => {
  state.compositionAlertInfo = []
  state.addGroupComposition = data
  if(data != null) {
    data.map(item => {
      let compositionData = item.composition
      state.compositionAlertInfo.push(compositionData.count+' '+compositionData.designation)
    })
  }
  else {
    state.addGroupComposition = data
  }
}

export const groupCompositionDetails = (state, data) => {
  if(data && data.length > 0) {
    let composition = []
    let patientCount = ""
    data.map(item => {
      item.composition.designationName = item.composition.designation
      item.composition.designation = item.composition.designationId
      composition.push(item.composition)
      patientCount = item.patientCount
    })
    state.groupCompositions = composition
    let finalComposition = [{
      composition: composition,
      patientCount: patientCount,
    }]
    finalComposition.map(item => {
      item.composition.map(element => {
        state.compositionAlertInfo.push(element.count+' '+element.designationName)
      })
    })
    state.groupCompositionDetails = finalComposition
  }
  else {
    state.groupCompositionDetails = null
  }
}

export const groupCompositions = (state, data) => {
  if(data && data != null && data.length > 0) {
    let composition = []
    data.map(item => {
      item.composition.designationName = item.composition.designation
      item.composition.designation = item.composition.designationId
      composition.push(item.composition)
    })
    state.groupCompositions = composition
  }
  else {
    state.groupCompositions = data
  }
}

export const groupLocationSelected = (state, data) => {
  state.groupLocationSelected = data
}
export const groupLoadingStatus = (state, data) => {
  state.groupLoadingStatus = data
}