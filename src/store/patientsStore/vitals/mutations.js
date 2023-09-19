import moment from "moment"
import {
  dateOnlyFormat,
  globalDateFormat,
  meridiemFormatFromTimestamp,
  convertTimeZone
} from "../../../commonMethods/commonMethod"

export const successMsg = (state, data) => {
  state.successMsg = data
}

export const errorPatientVitals = (state, data) => {
  state.errorPatientVitals = data
}

export const patientVitalsLoader = (state, data) => {
  state.patientVitalsLoader = data
}

export const buttonLoader = (state, data) => {
  state.buttonLoader = data
}

export const deviceTypes = (state, data) => {
  state.deviceTypes = data.map(deviceType => {
    if(deviceType.name == 'Blood Pressure') {
      deviceType.field = deviceType.name
    }
    if(deviceType.name == 'Oximeter') {
      deviceType.field = 'Oxygen Saturation'
    }
    if(deviceType.name == 'Glucose') {
      deviceType.field = deviceType.name
    }
    return deviceType
  })
}

export const reviewStatus = (state, data) => {
  state.reviewStatus = data
}

/* export const vitalComments = (state, data) => {
  state.vitalComments = data
} */

export const vitalStatus = (state, data) => {
  state.vitalStatus = data
}

export const vitalFeelingStatus = (state, data) => {
  state.vitalFeelingStatus = data
}

export const vitalFields = (state, data) => {
  state.vitalFields = data
}

export const glucoseRangeVitalFields = (state, data) => {
  state.glucoseRangeVitalFields = data
}

export const glucoseVitalFieldsDropdown = (state, data) => {
  state.glucoseVitalFieldsDropdown = data
}

export const patientVitalsTable = (state, result) => {
  let vitalsData = result.data
  state.graphsListMeta = result?.meta?.pagination
  let activeTab = result.activeTab
  const filteredVital = vitalsData.filter((item) => item?.vitals !== 0);
  state.patientVitalsTable = filteredVital.map((item) => {
    if(activeTab == 'heartRate' && (item.deviceType == 'Blood Pressure' || item.deviceType == 'Oxygen')) {
      item.bpm = item.vitals.bpm
    }
    else {
      if(item.deviceType == 'Blood Pressure') {
        item.systolic = item.vitals.systolic
        item.diastolic = item.vitals.diastolic
        item.bpm = item.vitals.bpm
      }
      else if(item.deviceType == 'Oxygen') {
        item.oxygen = item.vitals.spo2
      }
      else if(item.deviceType == 'Glucose') {
        let glucoseKeys = Object.keys(item.vitals)
        let keyName = glucoseKeys[0]
        item.state = keyName.charAt(0).toUpperCase() + keyName.slice(1);
        item.glucose = item?.vitals[keyName]
      }
    }
    item.takeDate = convertTimeZone(item.takeTime,item.timeZoneName).format(globalDateFormat)//dateOnlyFormat(item.takeTime, globalDateFormat)
    item.takeOnlyTime = convertTimeZone(item.takeTime,item.timeZoneName).format('hh:mm a') + ' '+item.timeZone //meridiemFormatFromTimestamp(item.takeTime)+' '+item.timeZone
    item.status = item.color
    item.color = item.flagColor
    item.isDeleted = item.isDelete
    return item
  })
}

export const patientBloodPressureGraph = (state, result) => {
  state.patientBloodPressureGraph = result
}
export const patientHeartRateGraph = (state, result) => {
  state.patientHeartRateGraph = result
}
export const patientOxygenSaturationGraph = (state, result) => {
  state.patientOxygenSaturationGraph = result
}
export const patientGlucoseGraph = (state, result) => {
  state.patientGlucoseGraph = result
}

export const patientVitalsGraph = (state, result) => {
  let vitalsData = result.data
  let datesArray = []
  vitalsData?.date?.map(item => {
    let today = moment().format("DD")
    datesArray.push(today != item ? item : 'Today')
  })
  let vitalsArray = {
    categories: datesArray,
    series: [],
  }
  if(vitalsData?.data != null) {
    if(result.activeTab == 'bloodPressure') {
      vitalsData?.data.map(item => {
        let name = item.name
        if(name != 'bpm') {
          const nameUppercase = name.charAt(0).toUpperCase() + name.slice(1);
          vitalsArray.series.push({
            name: nameUppercase,
            data: item.data
          })
        }
      })
      state.patientBloodPressureGraph = vitalsArray
    }
    if(result.activeTab == 'heartRate') {
      state.patientHeartRateGraph = {
        categories: datesArray,
        series: vitalsData?.data.map(item => {
          let name = item.name
          const nameUppercase = name.toUpperCase();
          return {
            name: nameUppercase,
            data: item.data
          }
        }),
      }
    }
    if(result.activeTab == 'oxygenLevels') {
      vitalsArray = {
        categories: datesArray,
        series: [],
      }
      vitalsData?.data.map(item => {
        let name = item.name
        if(name != 'bpm') {
          const nameUppercase = name.toUpperCase();
          vitalsArray.series.push({
            name: nameUppercase,
            data: item.data
          })
        }
      })
      state.patientOxygenSaturationGraph = vitalsArray
    }
    if(result.activeTab == 'glucoseLevels') {
      vitalsArray = {
        categories: datesArray,
        series: [],
      }
      vitalsData?.data.map(item => {
        let name = item.name
        const nameUppercase = name.charAt(0).toUpperCase() + name.slice(1);
        vitalsArray.series.push({
          name: nameUppercase,
          data: item.data
        })
      })
      state.patientGlucoseGraph = vitalsArray

      /* state.patientGlucoseGraph = {
        categories: datesArray,
        series: vitalsData?.data.map(item => {
          let name = item.name
          const nameUppercase = name.charAt(0).toUpperCase() + name.slice(1);
          return {
            name: nameUppercase,
            data: item.data
          }
        }),
      } */
    }
  }
  else if(vitalsData.length == 0) {
    let datesArray = []
    for (let i = 0; i <= 9; i++) {
      let date = moment();
      let today = moment().format("DD")
      let dateVal = Number(date.subtract(i, 'day').format('DD'))
      if(today != dateVal) {
        datesArray.push(dateVal);
      }
      else {
        datesArray.push('Today');
      }
    }

    if(result.activeTab == 'glucoseLevels') {
      state.patientGlucoseGraph = {
        categories: datesArray.reverse(),
        series: [{
          name: 'Glucose',
          data: [null, null, null, null, null, null, null, null, null, null]
        }],
      }
    }
  }
}

export const patientLatestVitals = (state, data) => {
  state.patientLatestVitals = data
}

export const patientVitalId = (state, data) => {
  state.patientVitalId = data
}

export const patientsVitalDetails = (state, data) => {
  data.date = convertTimeZone(data?.readingDateTime,data?.timeZoneName).format(globalDateFormat)//dateOnlyFormat(data?.readingDateTime, globalDateFormat)
  data.time = convertTimeZone(data?.readingDateTime,data?.timeZoneName).format('hh:mm a')//meridiemFormatFromTimestamp(data?.readingDateTime, globalDateFormat)
  if(data.deviceType.includes('DeviceName')) {
    data.deviceType = (JSON.parse(data.deviceType)).DeviceName
  }
  data.reviewedStatus = data?.reviewedComment != "" || data?.reviewedComment != '' || data?.reviewedComment != null ? true : false
  state.patientsVitalDetails = data
}
// vitals tab  active key
export const vitalTabs = (state, data) => {
  state.vitalTabs = data
}
export const vitalTypeValue = (state, data) => {
  state.vitalTypeValue = data
}

export const endParams = (state, data) => {
  state.endParams = data
}

export const addVitalDefaults = (state, data) => {
  state.addVitalDefaults = data
}

export const getBPVitalDefaults = (state, data) => {
  state.getBPVitalDefaults = data
}

export const getBPBaselineValues = (state, data) => {
  state.getBPBaselineValues = data
}

export const getOxygenVitalDefaults = (state, data) => {
  state.getOxygenVitalDefaults = data
}

export const getOxygenBaselineValues = (state, data) => {
  state.getOxygenBaselineValues = data
}

export const getHeartRateVitalDefaults = (state, data) => {
  state.getHeartRateVitalDefaults = data
}

export const getHeartRateBaselineValues = (state, data) => {
  state.getHeartRateBaselineValues = data
}

export const getGlucoseVitalDefaults = (state, data) => {
  if(data?.vitalType == 0) {
    data.vitalType = 1
  }
  state.getGlucoseVitalDefaults = data
}

export const glucoseVitalDefaultsList = (state, data) => {
  state.glucoseVitalDefaultsList = data
}

export const defaultPatientVitals = (state, data) => {
  if(data?.vitalType == 0 || data?.vitalType == '0') {
    data.vitalType = 1
  }
  state.defaultPatientVitals = data
}

export const downloadVitals = (state, data) => {
  state.downloadVitals = data
}

export const glucoseVitalsRanges = (state, response) => {
  let localData = JSON.parse(localStorage.getItem('localGlucoseVitalsRanges'))
  localData.push(response)
  localStorage.setItem('localGlucoseVitalsRanges', JSON.stringify(localData))
}

export const localGlucoseVitalsRanges = (state, data) => {
  state.localGlucoseVitalsRanges = data
}