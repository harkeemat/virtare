
import { yaxis, dataLabels, plotOptions, annotations, dateFormat } from '../../commonMethods/commonMethod'
export const timelineSuccess = (state, data) => {
  state.timeLineButton = data;
}
export const todayAppointmentSuccess = (state, count) => {
  let i = 1;
  state.todayAppointmentState = count.map(el => {
    el.key = i
    el.date = dateFormat(el.date);
    i++

    return el

  })
}
export const failure = (state, error) => {
  state.errorMsg = error;
}


export const specializationSuccess = (state, count) => {
  let categories= count.length > 0 ? count.map((item) => { return item.text }) : ['Wellness','Behaviour']
  let data = count.length > 0 ? count.map((item) => { return item.total }) : [0,0]
  state.specialization = {
    wellness: {
      annotations: annotations("Wellness", 0, "#ff0000", 0, "#fff", "#ff0000"),
      chart: {
        type: "bar",
      },
      plotOptions: plotOptions(10, "20%", "100%", true, false, "bottom"),
      dataLabels: dataLabels(false),
      colors: ["#8e60ff", "#ffa800"],

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
        categories: categories,
      },
      yaxis: yaxis("Specialization")
    },
    behavior: [
      {
        name: "Specialization",
        data: data,
      },
    ],
  };
}


export const networkSuccess = (state, count) => {
  
  let categories= count.length > 0 ? count.map((item) => { return item.text }) : ['In','Out']
  let data = count.length > 0 ? count.map((item) => { return item.total }) : [0,0]
  state.network = {
    In: {
      annotations: annotations("In", 0, "#775DD0", 0, "#fff", "#775DD0"),

      plotOptions: plotOptions(10, "20%", "100%", true, false, "bottom"),
      dataLabels: dataLabels(false),
      colors: ["#267dff", "#0fb5c2"],
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
        categories: categories,
      },
      yaxis: yaxis("Network")
    },
    Out: [
      {
        name: "Network",
        data: data,
      },
    ],
  };
}

// export const cptCodeSuccess = (state,data) => {

//   state.cptCodeValue = {
//     code: {
//       annotations: annotations("In", 0, "#775DD0", 0, "#fff", "#775DD0"),
//       chart: {
//         type: "bar",

//       },
//       plotOptions: plotOptions(10, "20%", "100%", true, false, "bottom"),
//       dataLabels: dataLabels(false),
//       colors: ["#3b72c5", "#ffb526", "#419541", "#343470"],
//       stroke: {
//         width: 1,
//         colors: ["#fff"],
//       },

//       grid: {
//         row: {
//           colors: ["#fff", "#f2f2f2"],
//         },
//       },
//       xaxis: {
//         labels: {
//           rotate: -45,
//         },
//         categories: data.map((item)=>{return item.text}),
//       },
//       yaxis: yaxis("Amount")
//     },
//     value: [
//       {
//         name: "Amount",
//         data: data.map((item)=>{return item.total}),
//       },

//     ],
//   };
// }
// export const financialSuccess = (state,data) => {

//   state.financialValue = {
//     due: [data.Due!=null ? Math.round(data.Due): 0,data.Billed!=null ? Math.round(data.Billed):0],
//     billed: {
//       chart: {
//         type: "pie",
//         height:"400px"
//       },
//       labels: ["Billed", "Due"],
//       colors: ["#267dff", "#E30D2A"],
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {

//             legend: {
//               position: "bottom",
//             },
//           },
//         },
//       ],
//     },
//   };
// }
