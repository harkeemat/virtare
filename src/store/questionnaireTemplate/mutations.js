import {
	
	globalDateTimeFormat,
	dateAndTimeFormate,
	
  } from '@/commonMethods/commonMethod';
  import store from "@/store/index"
export const questionnaire = async (state, data) => {
	state.questionnaireTemplateList = data.data.map(item=>{
		item.name = item.templateName
		return item
	});
	state.questionnaireTemplateMeta = data.meta ? data.meta.pagination :''
	setTimeout(()=>{
		store.commit('questionnaireLoadingStatus', false)
	},400)
	
};
export const addQuestionnaireTemplate = async (state, data) => {
	state.addQuestionnaireTemplate = data;
};
export const detailsQuestionnaireTemplate = async (state, data) => {
	let tags = [];

	data.tags ? data.tags.map((record) => {
		tags.push(record.tag);
	}):''
	data.tags = tags;
	state.detailsQuestionnaireTemplate = data;
	
	setTimeout(() => {
		store.commit('questionnaireLoadingStatus', false)
	}, 1000);
	
};
export const templateDetailsList = async (state, data) => {

	state.templateDetailsList = data;
};
export const scoreCount = async (state, data) => {
	state.scoreCount = data;
};
export const questionnaireResponse = async (state, data) => {

	let array = data.data.filter(myFilter);

	state.questionnaireResponse = array.map((item) => {
		
			item.createdAt = dateAndTimeFormate(item.createdAt,globalDateTimeFormat);
			return item;
		
		
	});
	state.questionnaireResponseMeta = data.meta ? data.meta.pagination :''
		store.commit('questionnaireLoadingStatus', false)
	
};
export const questionnaireResponseDetails = async (state, data) => {
	state.questionnaireResponseDetails = data.data 
	state.questionnaireResponseDetails.createdAt = dateAndTimeFormate(data.data.createdAt,globalDateTimeFormat);
	// if(data.data){
	// 	state.questionnaireResponseDetails.clientQuestionResponse = state.questionnaireResponseDetails.clientQuestionResponse.reduce((acc, d) => {
	// 		if (Object.keys(acc).includes(d.sectionName)) return acc;
		
	// 		acc[d.sectionName] = state.questionnaireResponseDetails.clientQuestionResponse.filter(g => g.sectionName === d.sectionName); 
	// 		return acc;
	// 	}, {})
	// }

	

}
export const clientResponse = async (state, data) => {
	state.clientResponse = data.data 
	state.clientResponse.createdAt = dateAndTimeFormate(data.data.createdAt,globalDateTimeFormat);
	// if(data.data){
	// 	state.questionnaireResponseDetails.clientQuestionResponse = state.questionnaireResponseDetails.clientQuestionResponse.reduce((acc, d) => {
	// 		if (Object.keys(acc).includes(d.sectionName)) return acc;
		
	// 		acc[d.sectionName] = state.questionnaireResponseDetails.clientQuestionResponse.filter(g => g.sectionName === d.sectionName); 
	// 		return acc;
	// 	}, {})
	// }	
}
export const  nestedQuestion = async (state, data) => {
	state.nestedQuestion = data.data
	
};
export const  assignAllTemplates = async (state, data) => {
	state.assignAllTemplates = data?.data
	state.assignMeta = data?.meta?.pagination
	
};
export const  assignedUsers = async (state, data) => {
	state.assignedUsers = data.data
}
export const  userAssignList = async (state, data) => {
	state.userAssignList = data.data
}
export const  fillBy = async (state, data) => {
	
	state.fillBy = data.data
};
export const  categoryType = async (state, data) => {
	
	state.categoryType = data.data
};
export const  actionData = async (state, data) => {
	
	state.actionData = data.data
};
function myFilter(elm){
    return (elm.templateName !== "");
}