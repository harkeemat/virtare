export const questionnaireSection = async (state, data) => {
	state.questionnaireSection = data.data;
	state.questionnaireSectionMeta = data.meta ? data.meta.pagination : ''
};
export const questionnaireTemplateSection = async (state, data) => {
	state.questionnaireTemplateSection = data;
};
export const detailsQuestionnaireSection = async (state, data) => {
	let tags = [];

	data.tags.map((record) => {
		tags.push(record.tag);
	});
	data.tags = tags;
	state.detailsQuestionnaireSection = data;
};
export const sectionDetailsList = async (state, data) => {
	
	state.sectionDetailsList = data.data;
};
export const allSections = async (state, data) => {
	state.allSections = data.data.map((item)=>{
		item.name = item.sectionName
		return item
	});
};

