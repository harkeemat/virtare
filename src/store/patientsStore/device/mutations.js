export const deviceList = (state, data) => {
  let result = data?.data
  result.map(item => {
    if(item.deviceType == 'Oximeter') {
      item.field = 'Oxygen Saturation'
    }
    else {
      item.field = item.deviceType
    }
    return item
  })
  state.deviceList = result
  state.deviceMeta = data?.meta ? data?.meta?.pagination : ''
}
export const serialNo = (state, data) => {
  state.serialNo = data?.data
}
export const deviceEror = (state, data) => {
  state.deviceEror = data
}