import {dateAndTimeFormate, deCodeString, key} from '@/commonMethods/commonMethod';
export const STAFF_DETAIL =(state, data) =>{
	state.staffDetail = data
}
export const STAFF_ERROR = (state, data) => {
	state.staffError = data;
};
export const staff = async (state, data) => {
	state.staffs = data.data.map(item => {
		item.firstName = deCodeString(key, item.firstName)
		item.lastName = deCodeString(key, item.lastName)
		item.middleName = deCodeString(key, item.middleName)
		item.dob = deCodeString(key, item.dob)
		return item
	});
	
	state.staffMeta = data.meta.pagination ? data.meta.pagination : null;
}
export const STAFF_LOADER = (state , data) =>{
	state.staffLoading = data
}


