import {
  yaxis,
  dataLabels,
  plotOptions,
  annotations,
  dateFormat,
  dateOnlyFormat,
  meridiemFormatFromTimestamp,
  timeStampToTime
} from '../../commonMethods/commonMethod'
import moment from "moment"


export const communicationRoute = async (state, data) => {
  state.communicationRoute = data;
}
export const callPlannedSuccess = (state, count) => {
  state.callPlanned = {
    calloption: {
      annotations: annotations("In",0,"#775DD0",0,"#fff","#775DD0"),
      chart: {
        type: "bar",
      },
      plotOptions: plotOptions(10, "20%", "100%", true, false, "bottom"),
      dataLabels: dataLabels(false),
      colors: ["#269b8f", "#269b8f", "#121258", "#218421"],
      
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: count.map((item) => { return item.text }),
        ids: count.map((item) => { return item.staffId }),
      },
      yaxis: yaxis("Number of Calls"),
    },
    callseries: [
      {
        name: "Calls Planned",
        data:  count.map((item) => {return item.total }),
      },
    ]
  }
}

export const communicationTypesSuccess = (state, response) => {

  
 
  const time = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM']

  var callSeries = [];
  
  if(response.length > 0) {
    var array_list = [];
    var array_list_final = [];
    response.forEach(function(value) {
      if(typeof array_list[value.text] === 'undefined') {
        array_list[value.text] = [];
      }
      let value_obj = {
        "text":value.text,
        "total":value.count,
        "time":moment(dateFormat(value.duration)).format('hh:00 A'),
        "duration":moment(dateFormat(value.duration)).format('HH:00')
      };
      array_list[value.text].push(value_obj);
    });
    
    for (const key in array_list) {
      
      var array_value = [];
      array_value['text']=key;

      
      array_value['data']= array_list[key]
    
      array_list_final.push(array_value);
    
    }
    
    for (const key in array_list_final) {
      
      for (const key_next in time) { 
          
            
            let obj = array_list_final[key].data.find(o =>moment(o.duration,'HH:00').format('hh:00 A') === time[key_next]);
           
            if(typeof obj === 'undefined'){
              let value_obj = {
                "text":array_list_final[key].data[0].text,
                "total":0,
                "time":time[key_next],
                "duration":moment(time[key_next],"hh:00 A").format('HH:00')
              };

              array_list_final[key].data.push(value_obj);
            }
          
            array_list_final[key].data = array_list_final[key].data.sort(function(a, b) {

              return a.duration.localeCompare(b.duration);
            }); 
      }
    }

    callSeries = array_list_final.map((item) => {
      
      return {
        name: item.text, 
        data: item.data.map((data) => {
          
              return data.total
          
          
        })
      }
    })
  }
  state.communicationTypes = {
    calloption: {
      chart: {
       
        type: "area",
      },
      dataLabels: dataLabels(false),
      stroke: {
        curve: "straight",
      },
      xaxis: {
        categories: time,
      },
      yaxis: yaxis('Number of Count'),
    },
    callseries: callSeries,
    states: {
      active: {
        allowMultipleDataPointsSelection: false
      }
    }
  }
}

export const communication = async (state, communications) => {
  /* let data = [];
  data = state.communicationsList;
  state.communicationsList = data ? data.push(...communications) : communications; */
  state.communicationsList = communications.data.map(communication => {
    communication.createdAt = dateFormat(communication.createdAt);
    return communication
  })
  state.communicationMeta=communications.meta.pagination
}

export const callDetails = async (state, data) => {
  state.callDetails = data.map(item => {
    item.date = item.date ? dateOnlyFormat(item.date) : ""
    item.startTime = item.startTime ? meridiemFormatFromTimestamp(item.startTime) : ""
    item.endTime = item.endTime ? meridiemFormatFromTimestamp(item.endTime) : ""
    return item
  })
}

export const addCommunication = async (state, addCommunication) => {
  state.addCommunication = addCommunication;
}
export const patientsListSuccess = async (state, patients) => {
  state.patientsList = patients;
}

export const patientDetailsSuccess = async (state, patient) => {
  state.patientDetails = patient;
}

export const futureAppointmentsSuccess = async (state, futureAppointments) => {
  state.futureAppointments = futureAppointments.map(appointment => {
    appointment.startTime = meridiemFormatFromTimestamp(appointment.startTime);
    return appointment
  });
}
export const newRequestsSuccess = async (state, newRequests) => {
  state.newRequests = newRequests.map(appointment => {
    appointment.startTime = meridiemFormatFromTimestamp(appointment.startTime);
    return appointment
  });
}
export const communicationsCountSuccess = async (state, count) => {
  state.communicationsCount = count;
}
export const searchCommunicationsSuccess = async (state, result) => {
  state.communicationsList = result;
}


export const conferenceId = async (state, data) => {
  state.conferenceId = data;
}
export const conversation = async (state, data) => {
  data.data.map(item => {
    const todayDate = moment().format('MM/DD/YYYY');
    // const yesterdayDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
    const createdAt = timeStampToTime(item.createdAt, 'MM/DD/YYYY');
    if(todayDate == createdAt) {
      item.createdAt = 'Today, '+meridiemFormatFromTimestamp(item.createdAt)
    }
    // else if(yesterdayDate == createdAt) {
    //   item.createdAt = 'Yesterday, '+meridiemFormatFromTimestamp(item.createdAt)
    // }
    else {
      item.createdAt = dateFormat(item.createdAt)
    }
    // item.createdAt = dateFormat(item.createdAt)
  })
  
  state.conversationList = data.data
  state.conversationsList = data.data

  state.messagesMeta=data.meta.pagination
}
export const latestmessage = async (state, data) => {
  data.map(item => {
    const todayDate = moment().format('MM/DD/YYYY');
    // const yesterdayDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
    const createdAt = timeStampToTime(item.createdAt, 'MM/DD/YYYY');
    if(todayDate == createdAt) {
      item.createdAt = 'Today, '+meridiemFormatFromTimestamp(item.createdAt)
    }
    // else if(yesterdayDate == createdAt) {
    //   item.createdAt = 'Yesterday, '+meridiemFormatFromTimestamp(item.createdAt)
    // }
    else {
      item.createdAt = dateFormat(item.createdAt)
    }
    // item.createdAt = dateFormat(item.createdAt)
  })
  state.latestmessage = data;
}
export const conversationSend = async (state, data) => {
  state.conversationSend = data;
}
export const communicationsView = async (state, data) => {
  state.communicationsView = data.map(item => {
    item.message.map(message => {
      message.time = dateFormat(message.time)
    })
    return item
  });
}

export const conversationWithPatient = async (state, data) => {
  state.conversationWithPatient = data;
}


export const showSmsData = async (state, data) => {
  let showSmsData = data.map(item => {
    item.message.map(message => {
      message.time = dateFormat(message.time)
    })
    return item
  });
  state.showSmsData = showSmsData[0]
}