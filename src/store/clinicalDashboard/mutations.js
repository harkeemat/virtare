import {  chartTimeCount } from '@/commonMethods/commonMethod';
import { dashBoard } from '.././dashboard/index';
import { common } from '.././common/index';

export const clicalTask = (state, record) => {
	let data = [];
	
	common.state.taskCategory.forEach((element) => {
		let object = record.find((e) => e.text == element.name);
		
		if (object == undefined) {
			data.push({ total: null, text: element.name });
		} else {
			data.push(object);
		}
	});
	
	state.clicalTask = data
}
export const patientsFlag = (state, record) => {
	let data = [];
	record.flags.forEach((element) => {
		let object = record.data.find((e) => e.text == element.name);
		if (object == undefined) {
			data.push({ total: null, text: element.name, color: element.color });
		} else {
			data.push(object);
		}
	});
	state.patientsFlag = data
};
export const escalationCount = (state, record) => {
	let data = [];
	common.state.escalationType.forEach((element) => {
		let object = record.find((e) => e.text == element.name);
		if (object == undefined) {
			data.push({ total: null, text: element.name });
		} else {
			data.push(object);
		}
	});
	state.escalationRecord = data;
};
export const appointmentCount = (state, count) => {
	let format = '';
	let type = '';
	if (dashBoard.state.timeLineButton.globalCodeId == 122) {
		type = 'time';
		format = 'hh';
	} else if (dashBoard.state.timeLineButton.globalCodeId == 123) {
		type = 'day';
		format = 'dddd';
	} else if (dashBoard.state.timeLineButton.globalCodeId == 124) {
		type = 'day';
		format = 'dd';
	} else {
		type = 'month';
		format = 'MM';
	}
	let categories = chartTimeCount(dashBoard.state.timeLineButton, count).map((item) => {
		return {text:item.duration}
	});
	let data = chartTimeCount(dashBoard.state.timeLineButton, count).map((item) => {
		return {total:item.total}
	});

	state.appointmentCount = {
		categories:categories,
		data:data,
		format:format,
		type:type
	}
}

export const widgetRecords = (state, data) => {
	state.widgetRecords = data.data
	
}
export const widgetName = (state, data) => {
	state.widgetName = data;
}
