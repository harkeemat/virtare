import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "../../config/apiConfig"
import { errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'
export const widgetName = async ({ commit }) => {
    // let widget =[
    //     {
    //       id: 1,
    //       order: 1,
    //       direction: "left",
    //       name: "Patient Status",
    //       type: "bar",
    //     },
    //     {
    //       id: 2,
    //       order: 2,
    //       direction: "left",
    //       name: "My Appointments",
    //       type: "bar",
    //     },
    //     {
    //       id: 3,
    //       order: 3,
    //       direction: "left",
    //       name: "Call State",
    //       type: "bar",
    //     },
    //     {
    //       id: 5,
    //       order: 1,
    //       direction: "right",
    //       name: "My Tasks",
    //       type: "table",
    //     },
    //     {
    //       id: 6,
    //       order: 1,
    //       direction: "right",
    //       name: "My Tasks List",
    //       type: "table",
    //     },
    //     {
    //       id: 7,
    //       order: 1,
    //       direction: "right",
    //       name: "Financial Stats",
    //       type: "pie",
    //     },
    //     {
    //         id: 8,
    //         order: 1,
    //         direction: "right",
    //         name: "Timelog Summary ",
    //         type: "bar",
    //       },
    //       {
    //         id: 9,
    //         order: 1,
    //         direction: "right",
    //         name: "Referrals",
    //         type: "bar",
    //       },
    //       {
    //         id: 13,
    //         order: 1,
    //         direction: "right",
    //         name: "Escalation",
    //         type: "bar",
    //       },
    //       {
    //         id: 14,
    //         order: 1,
    //         direction: "right",
    //         name: "Escalations List",
    //         type: "bar",
    //       },
    //   ];
    
    await ServiceMethodService.common("get", API_ENDPOINTS['dashboardWidgetList'], null, null).then((response) => {
        commit('widgetName', response.data.data);
    })
        .catch((error) => {
            errorLogWithDeviceInfo(error.response)
            commit('failure', error.response.data);
        })

}
export const userSetting = async ({ commit }, data) => {

    await ServiceMethodService.common("post", API_ENDPOINTS['setting'], null, data).then(() => {
       
       
    })
        .catch((error) => {
            errorLogWithDeviceInfo(error.response)
            commit('failure', error.response.data);
        })

}
export const getUserSetting = async ({ commit },config) => {
  
    await ServiceMethodService.common("get", API_ENDPOINTS['setting'], null, null).then((response) => {
        commit('widgetRecords', {data:response.data.data,config:config.config});
        
    })
        .catch((error) => {
            errorLogWithDeviceInfo(error.response)
            commit('failure', error.response.data);
        })

}

// export const callStatus = async ({ commit }, from) => {
//     await ServiceMethodService.common("get", API_ENDPOINTS['callStatus'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
//         commit('callStatusSuccess', response.data.data)

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }

// export const specialization = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['specialization'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
//         commit('specializationSuccess', response.data.data);
//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }


// export const network = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['network'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

//         commit('networkSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }

// export const cptCode = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['cptCodeGraph'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

//         commit('cptCodeSuccess', response.data.data);

//         //commit('cptCodeSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }
// export const financial = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['financial'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
//         commit('financialSuccess', response.data.data);


//         //commit('cptCodeSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }

// export const totalPatientsChart = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['totalPatientsChart'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

//         commit('totalPatientsChartSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }
// export const appointmentChart = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['appointmentChart'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

//         commit('appointmentChartSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
//}
export const clicalTask = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['clinicalTask'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

        commit('clicalTask', response.data);

    }).catch((error) => {
        if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status == 401) {
            //AuthService.logout();
        }
        commit('failure', error.response.data);
    })
}
export const appointmentCount = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['appointmentCount'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

        commit('appointmentCount', response.data.data);

    }).catch((error) => {
        if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status == 401) {
            //AuthService.logout();
        }
        commit('failure', error.response.data);
    })
}
export const patientsFlag = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['flag']+`?type=patient` , null, null).then((response) => {
        ServiceMethodService.common("get", API_ENDPOINTS['patientsFlag']+ "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((flags) => {
            commit('patientsFlag', {
                flags: response.data.data,
                data: flags.data
            });
            
        })
    }).catch((error) => {
        if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status == 401) {
            //AuthService.logout();
        }
        commit('failure', error.response.data);
    })
}
export const escalationCount = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['escalationCount'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('escalationCount', response.data.data);
        
    }).catch((error) => {
        if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status == 401) {
            //AuthService.logout();
        }
        commit('failure', error.response.data);
    })
}