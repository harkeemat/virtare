import {
	responseConvert,
	dateFormat,
	dateOnlyFormat,
	meridiemFormatFromTimestamp,
	timeArrayGlobal
} from '../../commonMethods/commonMethod';
import dayjs from 'dayjs';

export const addStaff = async (state, data) => {
	state.addStaff = data;
};

export const errorMsg = (state, data) => {
	state.errorMsg = data;
};

export const searchAppointmentSuccess = async (state, data) => {
	state.searchAppointmentRecords = '';
	if (data.key == 3) {
		// data = data.data.map((item) => {
		// 	item.staff = deCodeString(key, item.staffLastName) + ' '+ deCodeString(key, item.staffFirstName)
		// 	item.patient = deCodeString(key, item.patientLastName) + ' '+ deCodeString(key, item.patientFirstName)
		// 	return { ...item };
		// });
		state.searchAppointmentRecords = responseConvert(state.weekName, data.data, 'dddd');
	} else if (data.key == 4) {
		state.searchAppointmentRecords = data.data.map((item) => {
			item.title = item.appointmentType;
			item.timeGet = item.duration;
			// item.staff = deCodeString(key, item.staffLastName) + ' '+ deCodeString(key, item.staffFirstName)
			// item.patient = deCodeString(key, item.patientLastName) + ' '+ deCodeString(key, item.patientFirstName)
			item.date = dayjs(dateFormat(item.date)).format('YYYY-MM-DD');
			return { ...item };
		});
	} else {
		let officeTime = timeArrayGlobal
		// data = data.data.map((item) => {
		// 	item.staff = deCodeString(key, item.staffLastName) + ' '+ deCodeString(key, item.staffFirstName)
		// 	item.patient = deCodeString(key, item.patientLastName) + ' '+ deCodeString(key, item.patientFirstName)
		// 	return { ...item };
		// });
		state.searchAppointmentRecords = responseConvert(officeTime, data.data, 'hh:00 A');
	}
};
export const GetWeekName = (state) => {
	
	state.weekName = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};
export const calendarDateSelect = (state, date) => {
	state.calendarDate = date;
};
export const showMoreRecords = (state, data) => {
	let getRecord = [];
	data.data.forEach((element, index) => {
		if (index > data.to - 1) {
			element['key'] = index;
			//element['satartTime']=dateAndTimeFormate(element.date,'hh:mm A')
			// element['date']=dateAndTimeFormate(element.date,'MMM DD, yyyy')
			getRecord.push(element);
		}
	});
	state.showMoreRecords = getRecord;
};

export const latestAppointmentSuccess = (state, response) => {
	if (response && response.length > 0) {
		const data = response[0].value;
		data[0].date = dateOnlyFormat(data[0].date);
		state.latestAppointment = data;
	} else {
		state.latestAppointment = null;
	}
};

export const appointmentConference = (state, data) => {
	state.appointmentConference = data;
};
export const appointmentSuccessMsg = (state, data) => {
	state.appointmentSuccessMsg = data;
};
export const getStaffs = async (state, data) => {
	state.getStaff = data;
};


export const appointmentDetails = (state, data) => {
	state.appointmentDetails = data;
}

export const patientAppointmentsList = (state, appointments) => {
	state.patientAppointmentsList = appointments.map(data => {
		
		data.date = dateOnlyFormat(data.date)
		data.time = meridiemFormatFromTimestamp(data.time)
		data.dateTime = data.date+' '+data.time
		return data
	});
};



export const requestCall = (state, data) => {
	state.requestCall = data;
}

export const patientStaff = (state, data) => {
	state.patientStaff = data;
}


