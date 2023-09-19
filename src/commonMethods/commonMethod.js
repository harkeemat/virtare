import Swal from 'sweetalert2';
import moment from 'moment';
import store from '@/store/index'
import Bowser from "bowser";
import FormData from "../config/FormData.json"
import dayjs from 'dayjs';
//This lib used for the timezone conversion
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
import router from '@/router'; 
import { computed, ref } from 'vue';
import CryptoJS from "crypto-js";
export const encrypt = "salt"
//key for the encription & decription
export const key = 'U2FsdGVkX1/6qt7GYEFuf1NN930FEyUPzAatgoldcGs='

// Convert date timezone
export function convertTimeZone(timestamp, zone){
  return dayjs.utc((timestamp)*1000).tz(zone)
 }

//Show the patient details modal
export function showPatientModal(id) {
  store.commit("patientUdid", id)
  store.dispatch("patientDetails", id)
  store.commit('showPatientDetailsModal')
}

//Show the staff details modal
export function showStaffModal(id) {
  store.dispatch("staffSummary", id)
  store.commit('showStaffDetailsModal')
}
//for all timeStamp to according date and time format
export function dateAndTimeFormate(timeStamp, format) {
  var date = moment.unix(new Date(timeStamp));
  return date.format(format);
}
export const globalDateFormat = "MMM DD, YYYY"
export const billingDateFormat = 'MM/DD/YYYY'
export const globalDateTimeFormat = 'MMM DD, YYYY hh:mm A'
export const globalTimeFormat = 'hh:mm a'
export const sessionTimeFormat = 'mm:ss'
export const showDate = (date) => {
  return moment(date).format("MM.DD.YYYY")
}

//Log the APIs error info
export function errorLogWithDeviceInfo(errorMessage) {
  let deviceInfo = Bowser.parse(window.navigator.userAgent)
  store.dispatch('errorLogWithDeviceInfo', {
    deviceInfo: JSON.stringify(deviceInfo),
    errorMessage: JSON.stringify(errorMessage)
  })
}

//Date & time format function
export function timeStampFormate(timeStamp, format) {
  return moment.unix(timeStamp).format(format);
}


// for all table export excel data
export function exportExcel(data, field = "?fromDate=&toDate=") {
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  // let timeZone = momentTimeZone.tz.guess();
  store.dispatch('exportReportRequest', {
    data: data,
    field: field,
    timezone: timeZone
  })
}

//action tracking when user click on any action
export function actionTrack(id, actionId, endPoint,config=null) {
  store.dispatch('actionTrack', {
    id: id,
    actionId: actionId,
    endPoint: endPoint,
    config:config
  })
}


//Common convert day week month date
export const dayWeekMonthdate = (data, without = false) => {
  let from = moment()
  let to = moment()
  if (data ?.globalCodeId && data ?.globalCodeId == 122) {
    from = moment()
    to = moment().subtract(data.number, data.intervalType);
  } else if (data ?.globalCodeId && data ?.globalCodeId == 123) {
    from = moment();
    to = moment().subtract(data ?.number, data ?.intervalType);
  } else if (data ?.globalCodeId && data ?.globalCodeId == 124) {
    from = moment();
    to = moment().subtract(data.number, data ?.intervalType);
  } else {
    from = moment();
    to = moment().subtract(data ?.number, data ?.intervalType);
  }
  let dateFormate = {
    fromDate: '',
    toDate: ''
  }
  if (data ?.globalCodeId && data ?.globalCodeId == 122) {
    dateFormate = {
      fromDate: from ? from : '',
      toDate: to ? to : ''
    }
  } else {
    dateFormate = {
      fromDate: to,
      toDate: from
    }
  }
  if (without) {
    return {
      fromDate: dateFormate.fromDate,
      toDate: dateFormate.toDate
    }
  } else {
    return {
      fromDate: timeStamp(startimeAdd(dateFormate.fromDate)),
      toDate: timeStamp(endTimeAdd(dateFormate.toDate))
    }
  }

}
var CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
    };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct)
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams;
  }
}


// encode a string for video call url
export function enCodeStringVideoURL(value) {
  return window.btoa(value);
}
// encode a string for video call url
export function deCodeStringVideoURL(value) {
  let decode = window.atob(value);
  return decode.replace('=', '');
}


// encode a string
export function enCodeString(keyString, value) {
  let encrypted = CryptoJS?.AES?.encrypt(JSON.stringify(value), keyString, {
    format: CryptoJSAesJson
  }).toString();
  var string = window.btoa(encrypted);
  return string
}
// decode a string
export function deCodeString(keyString, value) {
  // Decrypt
  if (value && value.length > 120) {
    var string1 = window.atob(value);
    let reco = string1.substring(1)
    return JSON?.parse(CryptoJS?.AES?.decrypt("{" + reco, keyString, {
      format: CryptoJSAesJson
    }).toString(CryptoJS.enc.Utf8))
  } else {
    return value
  }
}
//Capitalize a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// swal for success message
export function successSwal(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true
  });
  Toast.fire({
    icon: 'success',
    title: message ? message.split(' ').map(capitalize).join(' ') :''
  });
}

//Permission alert
export async function alertSwal(message) {
  const result = await Swal.fire({
    icon: 'error',
    text: message //.split(' ').map(capitalize).join(' ')
  });
  if (result.isConfirmed) {
    let permissions  = deCodeString(key,store.state.screenPermissions?.screensPermissions)
    if(permissions?.length > 0){
    let redirectUrl = localStorage.getItem("redirectUrl")
    redirectUrl ? router.push(redirectUrl) :''
    }else{
      store.dispatch("removeLocalStorage")
    }
    return true;
  } else {
    return false;
  }
}
// swal for error message
export async function errorSwal(message) {
  const result = await Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message //.split(' ').map(capitalize).join(' ')
  });
  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
}
// swal for  message
export async function messageSwal(message) {
  const result = await Swal.fire({
    title: 'Warning',
    text: message,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ok'
  });
  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
}
// swal for warning message
export async function warningSwal(message, title = null) {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: `No`,
  });
  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
}

// Date for getting this format yyyy-MM-DD pass timeStamp
export function dateOnlyFormatSImple(timeStamp) {
  var day = moment.unix(new Date(timeStamp));
  return day.format('yyyy-MM-DD');
}

// Date for getting this format yyyy-MM-DD pass timeStamp
export function fullDateTimeFormat(timeStamp) {
  var day = moment.unix(new Date(timeStamp));
  return day.format('yyyy-MM-DD HH:mm:ss');
  // return day.format('yyyy-MM-DD HH:mm:ss');
}

// Date for getting this format yyyy-MM-DD pass timeStamp
export function hoursDateTimeFormat(timeStamp) {
  var day = moment.unix(new Date(timeStamp));
  return day.format('yyyy-MM-DD HH');
  // return day.format('yyyy-MM-DD HH:mm:ss');
}

// Date for getting this format yyyy-MM-DD pass timeStamp
export function hourOnlyFormat(date) {
  var day = moment.unix(date);
  return day.format('HH');
}

export function timeFormatSimple(timeStamp) {
  var day = moment.unix(new Date(timeStamp));
  return day.format('HH:mm');
}

export function dateOnlyFormat(timeStamp) {
  var day = moment.unix(timeStamp);
  return day.format('MMM DD, yyyy');
}

export function timerFromTimestamp(timeStamp) {
  var day = moment.unix(new Date(timeStamp));
  return day.format('HH:mm:ss');
}

export function dateFormat(date) {
  return moment.unix(date).format('MMM DD, yyyy, hh:mm A');
}

export function dateTimeFormat(date) {
  return moment.unix(date).format('MMM DD hh:mm A');
}

export function meridiemFormat(time) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) {
    time = time.slice(1);
    time[4] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12;
    var newTime = (time[0] + time[1] + time[2] + time[4]).toString();
  }
  return newTime;
}

export function meridiemFormatFromTimestamp(time) {
  return moment.unix(time).format('hh:mm a');
}

export function dobFormat(date) {
  return moment(date).format('MMMM DD, YYYY');
}

export function globalDateFormatFromTimestamp(date) {
	return moment.unix(date).format(globalDateFormat);
}

export function globalDateFormatFromDate(date) {
	return moment(date).format(globalDateFormat);
}

export function dateFormatClient(date) {
	return moment.unix(date).format(globalDateFormat);
}

export function dobFormat2(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function timeOnly(date) {
  var day = moment.unix(new Date(date));
  return String(day.format('HH'));
}

// For the apexchart data
export function yaxis(title) {
  return {
    labels: {
      formatter: function (val) {
        return val?.toFixed(0);
      }
    },
    title: {
      text: title
    }
  };
}

export function dataLabels(value) {
  return {
    enabled: value
  };
}
export function plotOptions(borderRadius, columnWidth, barHeight, distributed, horizontal, position) {
  return {
    bar: {
      borderRadius: borderRadius,
      columnWidth: columnWidth,
      barHeight: barHeight,
      distributed: distributed,
      horizontal: horizontal,
      dataLabels: {
        position: position
      }
    }
  };
}
export function annotations(xname, seriesIndex, borderColor, offsetY, color, background) {
  return {
    points: [{
      x: xname,
      seriesIndex: seriesIndex,
      label: {
        borderColor: borderColor,
        offsetY: offsetY,
        style: {
          color: color,
          background: background
        }
      }
    }]
  };
}
//end apexchart

// Used for timeStamp for dateTime
export function timeStamp(date) {
  return moment(date).format('X');
  // return moment.utc(date).local().format('X');
}
export function timeStampLocal(date) {
  return moment.utc(date).local().format('X');
}
export function timeStampToTime(time, format) {
  return moment.unix(time).format(format);
}

// Used for pass array and get object of array
export function arrayToObjact(data, id = 0) {
  return data ?.find((o) => o.id === id);
}
//remove obj from array
export function objectRemoveFormArray(data, id = 0) {
  let temp = [];
  temp = data;
  return temp.filter(
    (item) => item.id !== id
  );
}
export function startimeAdd(value) {
  let timeStart = '00:00:00';
  return moment(value.format('MM/DD/YYYY') + ' ' + timeStart).format();
}

export function addTime(value) {
	let timeStart = '00:00:01';
	return moment(value.format('MM/DD/YYYY') + ' ' + timeStart).format();
}

export function createdAtDateFormat(dateTime) {
  return moment(dateTime).format(globalDateTimeFormat);
}

export function timestampToDate(timestamp, format) {
  var day = moment.unix(timestamp);
  return day.format(format);
}

export function endTimeAdd(value) {
  let endTime = '23:59:59';
  return moment(value.format('MM/DD/YYYY') + ' ' + endTime).format();
}

export function responseConvert(time, data, format) {
  let record = [];
  time.forEach((element) => {
    let recordList = [];
    data.forEach((value) => {
      if (moment(dateFormat(value.date)).format(format) === element) {
        recordList.push(value);
      }
    });
    if (recordList.length > 0) {
      let value_obj_get = {
        time: element,
        data: recordList
      };
      record.push(value_obj_get);
    } else {
      let value_obj = {
        time: element,
        data: []
      };
      record.push(value_obj);
    }
  });
  return record;
}
//modification chart array
export function findOcc(arr, key) {
  let arr2 = [];
  arr.forEach((x) => {
    let isFound = 0;
    arr2.forEach((k, index) => {
      if (k[key] === x[key]) {
        arr2[index]["total"] = x.total + arr2[index]["total"];
        isFound = 1;
      }
    })
    if (isFound == 0) {
      let a = {}
      a[key] = x[key]
      a['duration'] = x.duration
      a["total"] = x.total
      arr2.push(a);
    }
  })
  return arr2
}
//modification for time in chart according day ,month and year
export function chartTimeCount(timeLine, count) {

  let newPatient = [];
  if (timeLine ?.globalCodeId == 122) {
    let array = count.map((item) => {
      item.time = moment(dateFormat(item ?.duration)).format('hh:00 A')
      return item
    })
    let getTotal = findOcc(array, 'time')
    const time = timeArrayGlobal
    time.forEach((item, i) => {
      let obj = getTotal.find((o) => moment(dateFormat(o.duration)).format('hh:00 A') === item);
      if (typeof obj === 'undefined') {
        let value_obj = {
          key: i,
          duration: item,
          total: null
        };
        newPatient.push(value_obj);
      } else {
        let value_obj_get = {
          duration: moment(dateFormat(obj.duration)).format('hh:00 A'),
          total: obj.total
        };
        newPatient.push(value_obj_get);
      }
    });
  } else if (timeLine ?.globalCodeId == 123) {
    let today = moment();
    today.subtract(timeLine ?.number, timeLine ?.intervalType);
    today.subtract(1, timeLine.intervalType);
    for (let i = 0; i <= timeLine.number; i++) {
      var day = today.add(1, 'days');
      let obj = count.find((o) => moment(dateFormat(o.duration)).format('dddd') === day.format('dddd'));
      if (typeof obj === 'undefined') {
        let value_obj = {
          key: i,
          duration: day.format('ddd'),
          total: null
        };
        newPatient.push(value_obj);
      } else {
        let value_obj2 = {
          key: i,
          duration: day.format('ddd'),
          total: obj.total
        };
        newPatient.push(value_obj2);
      }
    }
  } else if (timeLine ?.globalCodeId == 124) {
    var startDate = moment();
    var endDate = moment().subtract(timeLine.number, timeLine.intervalType);
    var result = startDate.diff(endDate, 'days');
    for (let i = 0; i <= result; i++) {
      let day = endDate.add(1, 'days');
      let obj = count.find(
        (o) => moment(dateFormat(o.duration)).format('MMM DD, yyyy') === day.format('MMM DD, yyyy')
      );
      if (typeof obj === 'undefined') {
        let value_obj = {
          duration: day.format('MMM DD, yyyy'),
          total: null
        };
        newPatient.push(value_obj);
      } else {
        let value_obj2 = {
          duration: day.format('MMM DD, yyyy'),
          total: obj.total
        };
        newPatient.push(value_obj2);
      }
    }
  } else {
    let month = [];
    for (let k = 1; k < 13; k++) {
      month.push(moment(moment().toDate()).add(k, 'month').startOf('month').format('MMMM'));
    }
    month.forEach((item, i) => {
      let obj = count.find((o) => moment(dateFormat(o.duration)).format('MMMM') === item);
      if (typeof obj === 'undefined') {
        let value_obj = {
          key: i,
          duration: item,
          total: null
        };
        newPatient.push(value_obj);
      } else {
        let value_obj2 = {
          key: i,
          duration: item,
          total: obj.total
        };
        newPatient.push(value_obj2);
      }
    });
  }
  return newPatient;
}

export function convertResponse(timeArray, recordsArray) {
  let records = [];
  timeArray.forEach((time) => {
    let recordList = [];
    recordsArray.forEach((record) => {
      if (record.takeTime === time) {
        recordList.push(record);
      }
    });
    if (recordList.length > 0) {
      let valuesObject = {
        takeTime: time,
        data: recordList.map((item) => {
          var field = item.vitalField.replace(/ /g, '_').toLowerCase();
          item[field] = item.value;
          return item;
        })
      };
      records.push(valuesObject);
    }
  });
  return records;
}

export function convertData(patientVitals) {
  let records = [];
  patientVitals.forEach((element) => {
    let itemObject = {};
    element.data.forEach((item) => {
      var field = (item.deviceType + '_' + item.vitalField).replace(/ /g, '_').toLowerCase();
      var color = (item.deviceType + '_' + item.vitalField + '_color').replace(/ /g, '_').toLowerCase();
      element.data = [];
      itemObject['id'] = item.id;
      itemObject['takeTime'] = dateFormat(item.takeTime);
      itemObject['takeDate'] = dateOnlyFormat(item.takeTime, globalDateFormat);
      itemObject['takeOnlyTime'] = meridiemFormatFromTimestamp(item.takeTime);
      itemObject['vitalField'] = item.vitalField;
      itemObject['deviceType'] = item.deviceType;
      itemObject['addType'] = item.addType;
      itemObject[color] = item.color;
      itemObject[field] = item.value;
    });
    records.push(itemObject);
  });
  return records;
}

export function convertChartResponse(vitaldFieldsArray, recordsArray) {
  var timesArray = [];
  recordsArray.forEach((element) => {
    if (!timesArray.includes(timeFormatSimple(element.takeTime))) {
      timesArray.push(timeFormatSimple(element.takeTime));
    }
  });
  let records = [];
  vitaldFieldsArray.forEach((vitalField) => {
    let recordList = [];
    recordsArray.forEach((record) => {
      if (record.vitalField === vitalField) {
        recordList.push(record);
      }
    });
    if (recordList.length > 0) {
      let valuesObject = {
        name: vitalField,
        data: recordList.map((item) => {
          const value = {
            x: dateFormat(item.takeTime),
            y: item.value
          }
          return value
        })

      };
      records.push(valuesObject);
    }
  });

  // const recordsList = records.sort((a, b) => {
  // 	let fa = a.name.toLowerCase(),
  // 	fb = b.name.toLowerCase();
  // 	if (fa >fb) {
  // 		return -1;
  // 	}
  // 	if (fa<fb) {
  // 		return 1;
  // 	}
  // 	return 0;
  // })

  return {
    records: sortArrayByLength(records),
    timesArray
  };
}
//Array sorting by length
function sortArrayByLength(data) {
  return data.sort((a, b) => b.data.length - a.data.length)
}


// *** DO NOT DELETE THE FOLLOWING CODE ***

/* export function createDynamicColumns(patientVitals) {
  let itemObject = {
    tableName: '',
    columns: [{
      title: 'Time & Date Vitals Taken',
      dataIndex: 'takeTime',
      key: 'takeTime',
      slots: {
        customRender: 'takeTime'
      }
    }]
  };
  if (patientVitals.length > 0) {
    patientVitals.map((item) => {
      var field = (item.deviceType + '_' + item.vitalField).replace(/ /g, '_').toLowerCase();
      var exists = itemObject.columns.some(function (dataIndex) {
        return dataIndex.dataIndex === field;
      });
      if (!exists) {
        //
      }
    });
  }
  return itemObject;
} */

export function getSeconds(hms) {
  var a = hms.split(':'); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  return seconds;
}

export function secondsToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));
  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);
  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}

export function secondsToMinutes(secs) {
  return ('0' + Math.floor(secs / 60)).slice(-2) + ':' + ('0' + Math.floor(secs % 60)).slice(-2);
}

// *** DO NOT DELETE THE FOLLOWING CODE ***

/* export const disabledMinutes = (selectedHour) => {
  const minutes = [];
  const currentMinute = moment().minute();
  if (selectedHour === moment().hour()) {
    for (let i = currentMinute; i <= 30; i++) {
      minutes.push(i);
    }
  }
  return minutes;
}; */

//table height
export const tableYScroller = 'calc(100vh - 290px)'
//table height
export const tableYScrollerCounterPage = 'calc(100vh - 510px)'
export const disableHours = []
//Appintment time slot
export const timeArrayGlobal = [
  '12:00 AM',
  '01:00 AM',
  '02:00 AM',
  '03:00 AM',
  '04:00 AM',
  '05:00 AM',
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
]
export const customOption = (data) => {
  let record = ''
  if (data.dataTypeId == 243 || data.dataTypeId == 244) {

    let object = [{
      "id": '',
      "dataTypeId": data.dataTypeId,
      labelName: "Yes",
      program: [],
      labelScore: "0",
      defaultOption: 0,
      answer: 0,
    }, {
      "id": '',
      "dataTypeId": data.dataTypeId,
      labelName: "No",
      program: [],
      labelScore: "0",
      defaultOption: 0,
      answer: 0,

    }]
    record = {
      dataTypeId: data.dataTypeId,
      option: object,
    };
  } else if (data.dataTypeId == 242 && data.scoreTypeId == 333) {
    record = {
      dataTypeId: data.dataTypeId,
      questionnaireCustomField: {
        scoreTypeId: data.scoreTypeId,
        correctScore: 0,
        incorrectScore: 0,
        correctAnwer: 0
      }
    };
  }

  return record
}
export const randColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}
export const lineChartOption = (data = [], name) => {
  return {
    chart: {
      type: 'line'
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: data.length > 0 ? data.map((item) => {
        return item.text;
      }) : []
    },
    yaxis: yaxis(name)
  }


}
export const lineChartSeries = (data = [], name) => {
  return [{
    name: name,
    data: data.length > 0 ? data.map((item) => {
      return item.total;
    }) : []
  }]
}
export const barChartOption = (data = [], name, format = null, type = null) => {
  let colorRecord = []
  if (data.length > 0) {
    colorRecord = data.map((item) => {
      return item ?.color ? item ?.color : randColor()
    })
    //colorRecord.length ==0 ? colorRecord =data.map(() =>{ return randColor()}) : ''
  }
  return {
    annotations: annotations('In', 0, '#775DD0', 0, '#fff', '#775DD0'),
    chart: {
      type: 'bar'
    },
    tooltip: {
      x: {
        format: format
      }
    },
    plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
    dataLabels: dataLabels(false),
    colors: colorRecord,
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      type: type,
      categories: data.length > 0 ? data.map((item) => {
        return item.text;
      }) : []
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val?.toFixed(0);
        }
      },
      title: {
        text: name
      }
    }
  }
}
export const barChartSeries = (data = [], name) => {
  let record = data.length > 0 ? data.map((item) => {
    return item ?.total ? item ?.total : null;
  }) : []
  return [{
    name: name,
    data: record
  }]
}
export const pieChartOption = (data, color) => {
  return {
    chart: {
      type: 'pie',
    },
    indexLabel: data.map((item) => item.text),
    labels: data.map((item) => item.text),
    colors: color ? data.map((item) => item.color) : data.map(() => {
      return randColor()
    }),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
}
export const pieChartSeries = (data) => {
  let record = []
  record = data.map((item) => item.total)
  return record;
}
//Filter array data and return item (array,value,match,return)
export const arrayToObjectData = (data = [], name, match = null, string = null) => {
  let record = ''
  if (data.length > 0) {
    if (match) {
      record = data ?.find((item) => item[match] == name)
    } else {
      record = data ?.find((item) => item.name == name)
    }
    return string && record ? record[string] : record
  } else {
    return ''
  }

}

export const formTitleNames = FormData
//hide date filter in clinic Dashboard
export const hideFilterClinicDashboard = [{
  'name': 'Custom'
}]
//hide date filter in Business Dashboard
export const hideFilterBusinessDashboard = [{
  'name': 'Custom'
}]
//hide date filter in Escalation Modal
export const hideFilterEscalationModal = [{
  'name': 'Month'
}, {
  'name': 'Year'
}]
//hide date filter in Audit Log
export const hideFilterAuditLog = []
//hide date filter in Audit Log Approval
export const hideFilterAuditLogApproval = []
//hide date filter in Patients Vital
export const hideFilterPatientsVital = [{
  'name': 'Custom'
}]
//remove & from String Add ? in this string
export const RemoveAndAdd = (data) => {
  return '?' + data.slice(1)
}
//only type number
export const numbersOnly = (evt)=>{
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    evt.preventDefault();
  } else {
       return true;
  }
}
//Alpha letters
export const alphabetsOnly = (evt) =>{
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    return true;
  } else {
    evt.preventDefault();

  }
}

export const checkAndQuesSymbol = (text) =>{
  let endParam = ''
      if (text) {
        //check filter first latter
        let firstWord = text.charAt(0)
        if (firstWord == '?' || firstWord == '&') {
            //if first latter is ? or & then remove first latter and add auto &
            endParam = '?' + text.slice(1)
        } else {
            //if first latter without ? or & then add &
            endParam = '?' + text.slice(1)
        }
     }
     return endParam
}
export const tableSortingCommon = (commit,endpoint,sorter,meta,filters,loader) =>{
  if (sorter?.order) {
    let order = sorter?.order == "ascend" ? "ASC":"DESC";
    let orderParam = "&orderField=" + sorter?.field + "&orderBy=" + order;
    store.dispatch("orderTable", {
      data: orderParam,
    })
  }else{
    store.dispatch("orderTable", {
      data: '',
    })
  }
  let endParam = '?page='+meta?.current_page+store.getters.orderTable.value?.data + filters+store.getters.searchTable.value
  store.dispatch('commonAction', { 'method': 'get', 'endPoint': endpoint + endParam, 'loader': loader, "commit": commit })
}


// *** DO NOT DELETE THE FOLLOWING CODE ***

// Handle Patient Vitals
/* export function convertVitalsResponse(timeArray, recordsArray) {
  let records = [];
  timeArray.forEach((time) => {
    let recordList = [];
    recordsArray.forEach((record) => {
      if (record.takeTime === time) {
        recordList.push(record);
      }
    });
    if (recordList.length > 0) {
      let valuesObject = {
        data: recordList.map((item) => {
          var field = item.vitalField.replace(/ /g, '_').toLowerCase();
          if(item.deviceType == 'Glucose') {
            item['glucose'] = item.value;
          }
          else if(item.deviceType == 'Oximeter') {
            item['oxygen'] = item.value;
          }
          else {
            item[field] = item.value;
          }
          return item;
        })
      };
      records.push(valuesObject);
    }
  });
  return records
} */


// *** DO NOT DELETE THE FOLLOWING CODE ***

/* export function convertVitalsToTable(records) {
  let vitals = []
  records.forEach((element) => {
    let itemObject = {};
    element.data.forEach((item) => {
      var field = (item.deviceType + '_' + item.vitalField).replace(/ /g, '_').toLowerCase();
      var color = (item.deviceType + '_' + item.vitalField + '_color').replace(/ /g, '_').toLowerCase();
      element.data = [];
      let takeDate = dateOnlyFormat(item.takeTime, globalDateFormat)

      itemObject['id'] = item.id;
      itemObject['takeTime'] = dateFormat(item.takeTime);
      itemObject['takeDate'] = dateOnlyFormat(item.takeTime, globalDateFormat);
      itemObject['takeDateOnly'] = moment(takeDate).format("D");
      itemObject['takeOnlyTime'] = meridiemFormatFromTimestamp(item.takeTime)+' IST';
      itemObject['vitalField'] = item.vitalField;
      itemObject['deviceType'] = item.deviceType;
      itemObject['addType'] = item.addType;
      itemObject['state'] = item.state;
      itemObject['status'] = item.color;
      itemObject['flagName'] = item.flagName;
      itemObject['reviewed'] = item.reviewed;
      itemObject['reviewedComment'] = item.reviewedComment;
      itemObject['reviewedStatus'] = item.reviewedStatus;
      itemObject['isDeleted'] = item.isDeleted;
      if(item.deviceType == 'Glucose') {
        itemObject['glucose'] = item.value;
        itemObject[field] = item.value;
        itemObject['color'] = item.color != "" ? item.color : '#7FF000';
      }
      else if(item.deviceType == 'Oximeter') {
        itemObject['oxygen'] = item.value;
        itemObject['color'] = item.color != "" ? item.color : '#7FF000';
      }
      else {
        itemObject[field] = item.value;
        itemObject[color] = item.color != "" ? item.color : '#7FF000';
      }
    });
    vitals.push(itemObject);
  });
  return vitals;
} */

// *** DO NOT DELETE THE FOLLOWING CODE ***

/* export const convertVitalsToGraph = (result) => {
  let dates = [];
  for (let i = 0; i <= 9; i++) {
    let date = moment();
    dates.push(Number(date.subtract(i, 'day').format('DD')));
  }
  dates.reverse()
  let series = []
  let vitalsData = result.data

  let systolicArray = []
  let diastolicArray = []
  let bpmArray = []

  if(result.activeTab == 'bloodPressure') {
    dates.map((date) => {
      vitalsData.map(vital => {
        let vitalsObject = vital.vitals
        let takeDate = dateOnlyFormat(vital.takeTime, globalDateFormat)
        vital.takeDateOnly = moment(takeDate).format("D")
        if(date == vital.takeDateOnly) {
          systolicArray.push(vitalsObject.systolic)
          diastolicArray.push(vitalsObject.diastolic)
          bpmArray.push(vitalsObject.bpm)
        }
        // else {
        //  systolicArray.push(null)
        //  diastolicArray.push(null)
        //  bpmArray.push(null)
        //}
      })
    })

    series = [{
      name: "Systolic",
      data: systolicArray,
    },
    {
      name: "Diastolic",
      data: diastolicArray,
    },
    {
      name: "BPM",
      data: bpmArray,
    }]
  }
} */

export const dobDate = current => current >= dayjs().subtract(18,'years')
export const featureDate = current => current > dayjs().subtract(1,'D')


const elapsedTime = ref(0)
const timer = ref(undefined)
const formattedElapsedTime = computed(() => {
  const date = new Date(null);
  date.setSeconds(elapsedTime.value / 1000);
  const utc = date.toUTCString();
  return utc.substr(utc.indexOf(":") -2, 8);
})

export const startTimer = () => {
  timer.value = setInterval(() => {
    elapsedTime.value += 1000;
    store.commit('patientActionTimerStatus', 'running');
  }, 1000)
}

export const pauseTimer = (saveTimer, activity) => {
  clearInterval(timer.value);
  store.commit('patientActionTimerStatus', 'stopped')
  if(saveTimer) {
    store.commit('patientActionTimerValue', formattedElapsedTime.value)
  }
}

export const stopTimer = (status) => {
  clearInterval(timer.value)
  elapsedTime.value = 0
  store.commit('patientActionTimerStatus', 'stopped')
  store.commit('patientActionTimerValue', null)
  store.commit('patientTimerStatus', status == 'leavingPage' ? 'stopped' : '')
  store.commit('patientTimerValue', null)
  sessionStorage.removeItem("chatSession");
  // sessionStorage.removeItem("noteSession");
  sessionStorage.removeItem("vitalReviewSession");
  sessionStorage.removeItem("vitalUploadSession");
  sessionStorage.removeItem('deviceSetupSession')
}

export const openAction = () => {
  var startTime = moment().format('hh:mm:ss')
  store.commit('patientActionTime', startTime)
}

export const closeAction = (actionName) => {
  const patientActionTime = computed(() => {
    return store.state.common.patientActionTime
  })
  var startTime = hmsToSeconds(patientActionTime.value)
  var endTime = hmsToSeconds(moment().format('hh:mm:ss'))

  var timeSpentInSeconds = endTime - startTime
  if(actionName == 'deviceSetup') {
    let deviceSetupSession = JSON.parse(sessionStorage.getItem('deviceSetupSession'))
    sessionStorage.setItem('deviceSetupSession', JSON.stringify({ totalTime: deviceSetupSession ? timeSpentInSeconds+deviceSetupSession.totalTime : timeSpentInSeconds }))
  }
  if(actionName == 'uploadVitals') {
    let vitalUploadSession = JSON.parse(sessionStorage.getItem('vitalUploadSession'))
    sessionStorage.setItem('vitalUploadSession', JSON.stringify({ totalTime: vitalUploadSession ? timeSpentInSeconds+vitalUploadSession.totalTime : timeSpentInSeconds }))
  }
  if(actionName == 'reviewVitals') {
    let vitalReviewSession = JSON.parse(sessionStorage.getItem('vitalReviewSession'))
    sessionStorage.setItem('vitalReviewSession', JSON.stringify({ totalTime: vitalReviewSession ? timeSpentInSeconds+vitalReviewSession.totalTime : timeSpentInSeconds }))
  }
}

/* export const convertVitalsToGraph = (vitalsArray, tabName) => {

  let dates = [];
  let vitalsData = vitalsArray;
  let vitalsSeries = []
  for (let i = 0; i <= 9; i++) {
    let date = moment();
    dates.push(Number(date.subtract(i, 'day').format('DD')));
  }

  dates.reverse()

  let series = []

  if(tabName == 'bloodPressure') {
    for (let i = 0; i < dates.length; i++) {
      let found = false
      const date = dates[i];
      for (let j = 0; j < vitalsData.length; j++) {
        const vital = vitalsData[j];
        if (vital.takeDateOnly == date) {
          vitalsSeries.push(vital)
          found = true
        }
      }

      if(!found) {
        vitalsSeries.push({
          addType: null,
          blood_pressure_bpm: null,
          blood_pressure_bpm_color: null,
          blood_pressure_diastolic: null,
          blood_pressure_diastolic_color: null,
          blood_pressure_systolic: null,
          blood_pressure_systolic_color: null,
          deviceType: null,
          flagName: null,
          id: null,
          state: null,
          status: null,
          takeDate: null,
          takeDateOnly: date,
          takeOnlyTime: null,
          takeTime: null,
          vitalField: null,
        })
      }
    }

    series = [
      {
        name: "Systolic",
        data: vitalsSeries.map(vital => {
          return vital.blood_pressure_systolic ? Number(vital.blood_pressure_systolic) : null
        }),
      },
      {
        name: "Diastolic",
        data: vitalsSeries.map(vital => {
          return vital.blood_pressure_diastolic ? Number(vital.blood_pressure_diastolic) : null
        }),
      },
      {
        name: "BPM",
        data: vitalsSeries.map(vital => {
          return vital.blood_pressure_bpm ? Number(vital.blood_pressure_bpm) : null
        }),
      },
    ]
  }
  if(tabName == 'heartRate') {
    for (let i = 0; i < dates.length; i++) {
      let found = false
      const date = dates[i];
      for (let j = 0; j < vitalsData.length; j++) {
        const vital = vitalsData[j];
        if (vital.takeDateOnly == date) {
          vitalsSeries.push(vital)
          found = true
        }
      }

      if(!found) {
        vitalsSeries.push({
          addType: null,
          blood_pressure_bpm: null,
          blood_pressure_bpm_color: null,
          deviceType: null,
          flagName: null,
          id: null,
          state: null,
          status: null,
          takeDate: null,
          takeDateOnly: date,
          takeOnlyTime: null,
          takeTime: null,
          vitalField: null,
        })
      }
    }
    series = [
      {
        name: "BPM",
        data: vitalsSeries.map(vital => {
          return vital.blood_pressure_bpm ? Number(vital.blood_pressure_bpm) : null
        }),
      }
    ]
  }
  if(tabName == 'oxygenLevels') {
    for (let i = 0; i < dates.length; i++) {
      let found = false
      const date = dates[i];
      for (let j = 0; j < vitalsData.length; j++) {
        const vital = vitalsData[j];
        if (vital.takeDateOnly == date) {
          vitalsSeries.push(vital)
          found = true
        }
      }

      if(!found) {
        vitalsSeries.push({
          addType: null,
          oxygen: null,
          color: null,
          deviceType: null,
          flagName: null,
          id: null,
          state: null,
          status: null,
          takeDate: null,
          takeDateOnly: date,
          takeOnlyTime: null,
          takeTime: null,
          vitalField: null,
        })
      }
    }
    series = [
      {
        name: "SPO2",
        data: vitalsSeries.map(vital => {
          return vital.oxygen ? Number(vital.oxygen) : null
        }),
      }
    ]
  }
  if(tabName == 'glucoseLevels') {
    for (let i = 0; i < dates.length; i++) {
      let found = false
      const date = dates[i];
      for (let j = 0; j < vitalsData.length; j++) {
        const vital = vitalsData[j];
        if (vital.takeDateOnly == date) {
          vitalsSeries.push(vital)
          found = true
        }
      }

      if(!found) {
        vitalsSeries.push({
          addType: null,
          glucose: null,
          glucose_fasting: null,
          glucose_random: null,
          glucose_pre_meal: null,
          glucose_post_meal: null,
          glucose_before_sleep: null,
          color: null,
          deviceType: null,
          flagName: null,
          id: null,
          state: null,
          status: null,
          takeDate: null,
          takeDateOnly: date,
          takeOnlyTime: null,
          takeTime: null,
          vitalField: null,
        })
      }
    }
    series = [
      {
        name: "Fasting",
        data: vitalsSeries.map(vital => {
          return vital.glucose_fasting && vital.vitalField == 'Fasting' ? Number(vital.glucose_fasting) : null
        }),
      },
      {
        name: "Random",
        data: vitalsSeries.map(vital => {
          return vital.glucose_random && vital.vitalField == 'Random' ? Number(vital.glucose_random) : null
        }),
      },
      {
        name: "Pre Meal",
        data: vitalsSeries.map(vital => {
          return vital.glucose_pre_meal && vital.vitalField == 'Pre Meal' ? Number(vital.glucose_pre_meal) : null
        }),
      },
      {
        name: "Post Meal",
        data: vitalsSeries.map(vital => {
          return vital.glucose_post_meal && vital.vitalField == 'Post Meal' ? Number(vital.glucose_post_meal) : null
        }),
      },
      {
        name: "Before Sleep",
        data: vitalsSeries.map(vital => {
          return vital.glucose_before_sleep && vital.vitalField == 'Before Sleep' ? Number(vital.glucose_before_sleep) : null
        }),
      },
    ]
  }

  return {
    series: series,
    categories: dates
  }
} */

// export function convertVitalsToGraph(vitaldFieldsArray, recordsArray) {
//   var timesArray = [];
//   var dataArray = [];
//   recordsArray.forEach((element) => {
//     if (!timesArray.includes(moment(element.takeDate).format("DD")) && (moment(element.takeDate).format("DD") != 'Invalid date')) {
//       timesArray.push(moment(element.takeDate).format("DD"));
//       dataArray.push(element.value);
//     }
//     /* if (!timesArray.includes(hourOnlyFormat(element.takeTime)) && (hourOnlyFormat(element.takeTime) != 'Invalid date')) {
//       timesArray.push(hourOnlyFormat(element.takeTime));
//       dataArray.push(element.value);
//     } */
//   });

//   let records = [];
//   vitaldFieldsArray.forEach((vitalField) => {
//     let recordList = [];
//     recordsArray.forEach((record) => {
//       if (record.vitalField === vitalField) {
//         recordList.push(record);
//       }
//     });
//     if (recordList.length > 0) {
//       let valuesObject = {
//         name: vitalField,
//         data: recordList.map((item) => {
//           const value = {
//             x: hourOnlyFormat(item.takeDate),
//             y: item.value ? item.value : null
//           }
//           return value
//         })

//       };
//       records.push(valuesObject);
//     }
//   });

//   return {
//     records: sortArrayByLength(records),
//     timesArray,
//     dataArray
//   };
// }

/**
 * This function checks the permission of the logged in user.
 * If permission, it will return true, false otherwise.
 * @param {*} data Screen Permissions List
 * @param {*} ids Ids to be matched
 * @returns 
 */
export const rolesPermissionFind = (data, ids) => {
  if(data) {
    // Decode permission string to array
    let permissions  = deCodeString(key, data)
    const permIds = permissions.map(({id}) => id);
    let  check = false
    if(ids?.filter(id => permIds.includes(id))?.length > 0) {
      check = true;
    }
    return check
  }
}

/** preventing for 000-000-0000 in phone number input */
export const invalidPhoneNumber = {
  trigger: 'change',
  async validator(rule,value) {
    if(value === "000-000-0000")
      return Promise.reject();
    else
      return Promise.resolve();
  }
}

/** alphanumeric value allowed instead of pure numeric  */
export const alphanumeric = {
  trigger: 'change',
  async validator(rule,value)
  {
     if(value.length > 0)
     {
      if(/^(?![0-9]*$)[a-zA-Z0-9 ]+$/.test(value))
       return Promise.resolve();
      else
        return Promise.reject();
    }
  }
}

/** check whitespace issue  */
export const whiteSpace = {
  trigger:'change',
  async validator(rule,value) {
    if(value.length > 0) {
      if(!value.replace(/\s/g, '').length)
        return Promise.reject();
      else
        return Promise.resolve();
    }
  }
}

/**
 * Function to convert time from h:m:s to seconds
 * @param {*} hms time in h:m:s format
 * @returns 
 */
export const hmsToSeconds = (hms) => {
  if(hms != undefined) {
    let seconds = hms.split(':');
    return seconds[0]*3600 + seconds[1]*60 + (+seconds[2] || 0);
  }
}

/**
 * Function to convert time from minutes to seconds
 * @param {*} time minutes to be converted
 * @returns 
 */
export const minutesToSeconds = (time) => {
  if(time != undefined) {
    let seconds = time.split(':');
    return seconds[0]*60 + (+seconds[1] || 0);
  }
}

/**
 * Function to convert time from seconds to h:m:s
 * @param {*} seconds seconds to be converted
 * @returns 
 */
export const secondsToHMS = (seconds) => {
  function z(n){
    return (n<10?'0':'') + n;
  }
  var sign = seconds < 0? '-':'';
  seconds = Math.abs(seconds);
  return sign + z(seconds/3600 |0) + ':' + z((seconds%3600) / 60 |0) + ':' + z(seconds%60);
}

/**
 * Function to convert time from seconds to m:s
 * @param {*} seconds seconds to be converted
 * @returns 
 */
export const secondsToMS = (seconds) => {
  function z(n){
    return (n<10?'0':'') + n;
  }
  var sign = seconds < 0? '-':'';
  seconds = Math.abs(seconds);
  return sign + z((seconds%3600) / 60 |0) + ':' + z(seconds%60);
}

export const defaultOption = {
  label:'Choose an option',
  value:'',
  disabled:true,
}

/**
 * Function to Create & Download CSV from JSON
 * @param {*} data Data for which CSV needs to be created & downloaded
 */
export const getCsvFile = async function (data) {
  const csvdata = createCSVFromJson(data.data);
  downloadCSV(csvdata, data.fileName);
}

/**
 * Function to Create CSV from JSON
 * @param {*} data Data for which CSV needs to be created
 */
const createCSVFromJson = function (data) {
  let csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  data.map(element => {
    csvRows.push(Object.values(element).join(','))
  });
  let finalArray = []
  csvRows.map((item, index) => {
    if(index > 0) {
      finalArray.push(item)
    }
  })
  return finalArray.join('\n')
}

/**
 * Function to Download CSV
 * @param {*} data Data for which CSV needs to be downloaded
 * @param {*} fileName Name to be given to the CSV File
 */
const downloadCSV = function (data, fileName) {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob)
  const downloadBtn = document.createElement('a')
  downloadBtn.setAttribute('href', url)
  downloadBtn.setAttribute('download', fileName+'.csv');
  downloadBtn.click()
}

/**
 * Function to Create & Download PDF from Base64
 * @param {*} data Data for which PDF needs to be downloaded
 */
export const downloadPdfFromBase64 = async function (data) {
  var base64String = data.data;
  var downloadLink = document.createElement('a');
  downloadLink.href = 'data:application/octet-stream;base64,' + base64String;
  downloadLink.download = data.fileName;
  downloadLink.click()
}


//Two object merge with overwriting and without  overwriting
export const deepMergeObjects = (target, source, isMergingArrays = false) => {
  target = ((obj) => {
      let cloneObj;
      try {
          cloneObj = JSON.parse(JSON.stringify(obj));
      } catch(err) {
          // If the stringify fails due to circular reference, the merge defaults
          //   to a less-safe assignment that may still mutate elements in the target.
          // You can change this part to throw an error for a truly safe deep merge.
          cloneObj = Object.assign({}, obj);
      }
      return cloneObj;
  })(target);
  const isObject = (obj) => obj && typeof obj === "object";
  if (!isObject(target) || !isObject(source))
      return source;
  Object.keys(source).forEach(key => {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Array.isArray(targetValue) && Array.isArray(sourceValue))
          if (isMergingArrays) {
              target[key] = targetValue.map((x, i) => sourceValue.length <= i
                                                          ? x
                                                          : mergeDeep(x, sourceValue[i], isMergingArrays));
              if (sourceValue.length > targetValue.length)
                  target[key] = target[key].concat(sourceValue.slice(targetValue.length));
          } else {
              target[key] = targetValue.concat(sourceValue);
          }
      else if (isObject(targetValue) && isObject(sourceValue))
          target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue, isMergingArrays);
      else
          target[key] = sourceValue;
  });

  return target;
};

/**
 * Calculates & returns minimum value of vitals graph Y-axis
 * on the basis of baseline minimum value(s) and patient vital values.
 * @param {*} dataArray 
 * @param {*} baselineMin 
 * @param {*} baselineArray 
 * @returns Minimum Y-axis value for vitals graph
 */
export const getMinValue = (dataArray, baselineMin, baselineArray) => {
  let minValue = null
  let newBaselineMin = baselineMin-10
  if(dataArray.length > 0) {
    let minValueOfArray = Math.min.apply(Math, dataArray)
    if(baselineMin < minValueOfArray) {
      minValue = newBaselineMin >= 0 ? newBaselineMin : 0
    }
    else {
      minValue = minValueOfArray-10 >= 0 ? minValueOfArray-10 : 0
    }
  }
  else {
    if(baselineArray != null) {
      minValue = newBaselineMin >= 0 ? newBaselineMin : 0
    }
  }
  return minValue
}

/**
 * Calculates & returns maximum value of vitals graph Y-axis
 * on the basis of baseline maximum value(s) and patient vital values.
 * @param {*} dataArray 
 * @param {*} baselineMax 
 * @param {*} baselineArray 
 * @returns Maximum Y-axis value for vitals graph
 */
export const getMaxValue = (dataArray, baselineMax, baselineArray) => {
  let maxValue = null
  let newBaselineMax = baselineMax+10
  if(dataArray.length > 0) {
    let maxValueOfArray = Math.max.apply(Math, dataArray)
    if(baselineMax < maxValueOfArray) {
      maxValue = maxValueOfArray+10
    }
    else {
      maxValue = newBaselineMax
    }
  }
  else {
    if(baselineArray != null) {
      maxValue = newBaselineMax
    }
  }
  return maxValue
}

/**
 * 
 * @param {*} noOfDays Number of days for which the dates are to be returned
 * @param {*} dateFormat Format in which the dates are to be returned
 * @returns Array of dates for given no. of days and a given format
 */
export const getDates = (noOfDays, dateFormat) => {
  let datesArray = []
  for (let i = 0; i <= noOfDays-1; i++) {
    let date = moment();
    let today = moment().format(dateFormat)
    let dateVal = date.subtract(i, 'day').format(dateFormat)
    datesArray.push(today != dateVal ? dateVal : 'Today')
  }
  datesArray.reverse()
  return datesArray
}
