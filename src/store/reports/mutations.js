import {
  dateOnlyFormat,
  globalDateFormat,
  convertResponse,
  convertData,
  timerFromTimestamp,
  secondsToTime
  // convertChartResponse,
} from "@/commonMethods/commonMethod";
export const cptTimeline = (state, data) => {

  state.cptTimeline = data
}
export const cptCodes = (state, data) => {
  state.cptCodesMeta = data.meta ? data.meta.pagination : ''
  state.cptCodes = data.data.map(item => {
    item.billingDate = dateOnlyFormat(item.billingDate, globalDateFormat)
    return item
  })
}

let totalMinutes =null
export const reportDetailList = (state, data) => {
  state.reportDetailList = data
  if (state.reportDetailList.device.length > 0) {
    state.reportDetailList.device[0]['issueDate'] = dateOnlyFormat(data.device[0].issueDate, globalDateFormat)
    state.reportDetailList.device[0]['setupDate'] = dateOnlyFormat(data.device[0].setupDate, globalDateFormat)
  }
  totalMinutes = null
  if (state.reportDetailList.call.length > 0) {
    state.reportDetailList.call.map(item=>{
      // const seconds = item.endTime-item.startTime;
      // totalMinutes+=seconds
      // item.minutes = secondsToTime(seconds)
      item.date = dateOnlyFormat(item.date, globalDateFormat)
      item.minutes = secondsToTime(item.endTime-item.startTime)
      item.startTime = timerFromTimestamp(item.startTime,'HH:mm:ss A')
      item.endTime = timerFromTimestamp(item.endTime,'HH:mm:ss A')
      item.chargeTime = secondsToTime(item.spendTime)
      totalMinutes+=item.spendTime
      
      return item
    })

    state.reportDetailList['totalMinutes'] = secondsToTime(totalMinutes)
  }


}



export const patientReportVitals = (state, vitals) => {
  var timeArray = [];
  var vitalFieldsArray = [];
  var vitalsArray = [];
  if (vitals && (vitals.length > 0 || vitals != null)) {
    vitals.map(vital => {
      vitalsArray.push({
        id: vital.id,
        takeTime: vital.takeTime,
        vitalField: vital.vitalField,
        deviceType: vital.deviceType,
        value: vital.value,
        color: vital.color,
      })
      if (!timeArray.includes(vital.takeTime)) {
        timeArray.push(vital.takeTime);
      }
     
        
      
      if (!vitalFieldsArray.includes(vital.vitalField)) {
        vitalFieldsArray.push(vital.vitalField);
      }
    })

    

    const convertedResponse = convertResponse(timeArray, vitalsArray)
    const patientVitals = convertData(convertedResponse)
    // const patientGraphData = convertChartResponse(vitalFieldsArray, vitalsArray)

    
    //days counter
    state.takeDateTime = []
    state.takeDateTime = timeArray.map(item => {
      item = dateOnlyFormat(item, globalDateFormat)
      return item
    })

    state.takeLength = []
    state.takeDateTime.map(item => {
      if (!state.takeLength.includes(item)) {
        state.takeLength.push(item)
      }
    })
    //days counter end

    //datewise sorting 
    patientVitals.sort(function(a, b) {
      return a.takeDate.localeCompare(b.takeDate)
    });
    
    var map = {};
    patientVitals.forEach(function(val) {
      var date = val.takeDate;
      map[date] = map[date] || [];
      map[date].push(val)
    });
    
    //datewise sorting end
    vitalsArray.forEach(vital => {
      switch (vital.deviceType) {
        case 'Blood Pressure':
          state.bloodPressure = patientVitals.length > 0 ? patientVitals : null
          state.bloodPressureData = map
          break;
        case 'Oximeter':
          state.bloodOxygen = patientVitals.length > 0 ? patientVitals : null
          state.bloodOxygenData = map
          break;
        case 'Glucose':
          state.bloodGlucose = patientVitals.length > 0 ? patientVitals : null
          state.bloodGlucoseData = map
          break;
        default:
          break;
      }
    });
  
    state.bloodPressureColumns = [
      {
        title: "Time Recorded",
        dataIndex: "takeOnlyTime",
        key: "takeTime",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "Systolic",
        dataIndex: "blood_pressure_systolic",
        key: "blood_pressure_systolic",
        slots: {
          customRender: "blood_pressure_systolic",
        },
      },
      {
        title: "Diastolic",
        dataIndex: "blood_pressure_diastolic",
        key: "blood_pressure_diastolic",
        slots: {
          customRender: "blood_pressure_diastolic",
        },
      },
      {
        title: "BPM",
        dataIndex: "blood_pressure_bpm",
        key: "blood_pressure_bpm",
        slots: {
          customRender: "blood_pressure_bpm",
        },
      },
    ];

    state.bloodOxygenColumns = [
      {
        title: "Time Recorded",
        dataIndex: "takeOnlyTime",
        key: "takeTime",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "SPO2",
        dataIndex: "oximeter_spo2",
        key: "oximeter_spo2",
        slots: {
          customRender: "oximeter_spo2",
        },
      },
      {
        title: "BPM",
        dataIndex: "oximeter_bpm",
        key: "oximeter_bpm",
        slots: {
          customRender: "oximeter_bpm",
        },
      },
    ];

    state.bloodGlucoseColumns = [
      {
        title: "Time Recorded",
        dataIndex: "takeOnlyTime",
        key: "takeTime",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "Random Blood Sugar",
        dataIndex: "glucose_random_blood_sugar",
        key: "glucose_random_blood_sugar",
        slots: {
          customRender: "glucose_random_blood_sugar",
        },
      },
      {
        title: "Fasting Blood Sugar",
        dataIndex: "glucose_fasting_blood_sugar",
        key: "glucose_fasting_blood_sugar",
        slots: {
          customRender: "glucose_fasting_blood_sugar",
        },
      },
      {
        title: "Fasting",
        dataIndex: "glucose_fasting",
        key: "glucose_fasting",
        slots: {
          customRender: "glucose_fasting",
        },
      },
      {
        title: "Pre Meal",
        dataIndex: "glucose_pre_meal",
        key: "glucose_pre_meal",
        slots: {
          customRender: "glucose_pre_meal",
        },
      },
      {
        title: "Post Meal",
        dataIndex: "glucose_post_meal",
        key: "glucose_post_meal",
        slots: {
          customRender: "glucose_post_meal",
        },
      },
      {
        title: "Before Sleep",
        dataIndex: "glucose_before_sleep",
        key: "glucose_before_sleep",
        slots: {
          customRender: "glucose_before_sleep",
        },
      },
      {
        title: "General",
        dataIndex: "glucose_general",
        key: "glucose_general",
        slots: {
          customRender: "glucose_general",
        },
      },
    ];
  } else {
    state.bloodPressure = null;
    //   state.bloodPressureGraph = null;
    state.bloodOxygen = null;
    //   state.bloodOxygenGraph = null;
    state.bloodGlucose = null;
    //   state.bloodGlucoseGraph = null;
  }
}

export const cptCodeFilterDates = (state, date) => {
  state.cptCodeFilterDates = date
  }