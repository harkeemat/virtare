import {
  dateFormat,
} from '@/commonMethods/commonMethod';

export const flagsList = (state, flags) => {
  state.flagsList = flags;
}

export const patientFlagsList = (state, flags) => {
  state.latestFlag = flags[0]
  state.patientFlagsList = flags.map((item)=>{
    item.createdAt=dateFormat(item.createdAt)
    return item
  })
}

export const patientFlagsListCat2 = (state, flags) => {
  state.latestFlagCat2 = flags[0]
  state.patientFlagsList = flags.map((item)=>{
    item.createdAt=dateFormat(item.createdAt)
    return item
  })
}

export const flagsForPatients = (state, flags) => {
  state.flagsForPatients = flags
}
export const clearFlag = (state,data)=>{
  state.clearFlag = data
}