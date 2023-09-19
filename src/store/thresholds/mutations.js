
export const getVitals = async (state, data) => {
  state.vitalData = ''
  state.vitalData = data

}
export const vitalSuccessMsg = async (state, data) => {

  state.vitalSuccessMsg = data

}
export const vitalNull = async (state) => {
  state.vitalData = ''
}
export const generalParameterGroup = async (state, vitalRecord) => {
  state.generalParameterMeta = vitalRecord.meta.pagination
  state.vitalList = ''
  let record = []
  vitalRecord.data.map(element => {
    let count = element.generalparameter.data.length
    element.generalparameter.data.forEach((data, index) => {
      data['generalparameterId'] = element.id
      data['deviceType'] = element.deviceType
      data['key'] = index
      if (index == 0)
        data['data'] = count
      else {
        data['data'] = 0
      }
      record.push(data)
    })
  });
  state.vitalList = record
  

}
export const vitalEdit = async (state, vitaledit) => {
  state.vitalEdit = ''
  let record = []
  let high = []
  let low = []
  let udid = []

  vitaledit.generalparameter.data.forEach((data) => {
    let index = data.vitalFieldId
    high[index] =data.highLimit;
    low[index] = data.lowLimit;
    udid[index]= data.id;
   
  })
 
  record['generalParametersGroup'] = vitaledit.name
  record['generalParametershigh'] = high
  record['generalParameterslow'] = low
  record['udid'] = udid
  record['deviceTypeId'] = vitaledit.deviceTypeId
  record.push(record)
  state.vitalEdit = {...record}

}


export const billingReportTable = (state, data) => {
	state.billingReportTable = data;
};