import { yaxis, dataLabels, plotOptions } from '../../commonMethods/commonMethod'
export const counterCardSuccess = (state, count) => {
    state.grid = {
        xlGrid: parseInt(24 / count.length * 2),
        smGrid: parseInt(24 / parseInt(count.length / 2))
    }
    state.totalPatientcount = count
    state.patientsCondition ={
        option1: {
          annotations: {
            points: [
              {
                x: "In",
                seriesIndex: 0,
                label: {
                  borderColor: "#775DD0",
                  offsetY: 0,
                  style: {
                    color: "#fff",
                    background: "#775DD0",
                  },
                },
              },
            ],
          },
          chart: {
            type: "bar",
          },
          plotOptions: plotOptions(10,"20%","100%",true,false,"bottom"),
          dataLabels: dataLabels(false),
          colors: count.map((item) => { return item.color }),
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
          },
          yaxis: yaxis("Patients")
        },
        series1: [
          {
            name: "Patients",
            data: count.map((item) => { return item.total }),
          },
        ],
  
      };
}
export const failure = (state, error) => {
    state.errorMsg = error;
}
