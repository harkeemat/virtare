import { yaxis, dataLabels, plotOptions, annotations } from '../../commonMethods/commonMethod';

export const cptCodeSuccess = (state, data) => {
	let cptResult = [];
	data.data.forEach((element) => {
		if (element.name == 99453 || element.name == 99454 || element.name == 99457 || element.name == 99458) {
			let object = data.cpt.find((e) => e.text == element.name);

			if (object == undefined) {
				cptResult.push({ total: null, text: element.name });
			} else {
				cptResult.push(object);
			}
		}
	});

	state.cptCodeValue = {
		code: {
			annotations: annotations('In', 0, '#775DD0', 0, '#fff', '#775DD0'),
			chart: {
				type: 'bar'
			},
			plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
			dataLabels: dataLabels(false),
			colors: [ '#3b72c5', '#ffb526', '#419541', '#343470' ],
			stroke: {
				width: 1,
				colors: [ '#fff' ]
			},

			grid: {
				row: {
					colors: [ '#fff', '#f2f2f2' ]
				}
			},
			xaxis: {
				labels: {
					rotate: -45
				},
				categories: cptResult.map((item) => {
					return item.text;
				})
			},
			
			labels: {
				formatter: function (val) {
					return val;
				}
			},
			title: {
				text: 'Amount ($)'
			} 
		},
		value: [
			{
				name: 'Amount',
				data: cptResult.map((item) => {
					return item.total;
				})
			}
		]
	};
};
export const businessFiletr = (state,data) =>{
	state.businessFiletr = data
}
export const referalCount = (state, data) => {
	const topFive = [];
	data.map((item, index) => {
		if (index < 4) {
			topFive.push(item);
		}
	});
	state.referalCountRecord = data;
	state.referalCount = {
		code: {
			annotations: annotations('In', 0, '#775DD0', 0, '#fff', '#775DD0'),
			chart: {
				type: 'bar'
			},
			plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
			dataLabels: dataLabels(false),
			colors: [ '#3b72c5', '#ffb526', '#419541', '#343470' ],
			stroke: {
				width: 1,
				colors: [ '#fff' ]
			},

			grid: {
				row: {
					colors: [ '#fff', '#f2f2f2' ]
				}
			},
			xaxis: {
				labels: {
					rotate: -45
				},
				categories: topFive.map((item) => {
					return item.text;
				})
			},
			yaxis: yaxis('Referral Count'),
			noData: {
				text: 'No data',
				align: 'center',
				verticalAlign: 'middle',
				offsetX: 0,
				offsetY: 0,
				style: {
					color: undefined,
					fontSize: '24px',
					fontWeight: 'bold'
					//fontFamily: undefined
				}
			}
		},

		value: [
			{
				name: 'Name',
				data: topFive.map((item) => {
					return item.total;
				})
			}
		]
	};
};
export const financialSuccess = (state, data) => {
	state.financialValue = {
		due: [ data.Due != null ? Math.round(data.Due) : 100, data.Billed != null ? Math.round(data.Billed) : 0 ],
		billed: {
			chart: {
				type: 'pie',
				height: '400px'
			},
			labels: [ 'Due', 'Billed' ],
			colors: [ '#E30D2A', '#267dff' ],
			responsive: [
				{
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom'
						}
					}
				}
			]
		}
	};
};
export const callStatusSuccess = (state, count) => {
	let categories = [];
	let data = [];
	let barColors = [];

	if(count.length > 0) {
		count.map((item) => {
			categories.push(item.text);
			data.push(item.total);
			barColors.push(item.color);
		})
	}
	else {
		categories.push('Completed', 'In Queue', 'Going On')
		data.push(0, 0, 0)
		barColors.push('#121258', '#ffb526', '#218421')
	}
	
	state.callStatus = {
		calloption: {
			annotations: annotations('In', 0, '#775DD0', 0, '#fff', '#775DD0'),
			chart: {
				type: 'bar'
			},
			plotOptions: plotOptions(10, '20%', '100%', true, false, 'bottom'),
			dataLabels: dataLabels(false),
			colors: barColors,
			stroke: {
				width: 1,
				colors: [ '#fff' ]
			},
			grid: {
				row: {
					colors: [ '#fff', '#f2f2f2' ]
				}
			},

			xaxis: {
				labels: {
					rotate: -45
				},
				categories: categories
			},
			yaxis: yaxis('Number of Count')
		},
		callseries: [
			{
				name: 'Call Queue',
				data: data
			}
		]
	};
};
