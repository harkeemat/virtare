import ServiceMethodService from '@/services/serviceMethod';
import { successSwal} from '@/commonMethods/commonMethod';
import { API_ENDPOINTS } from '@/config/apiConfig';

export const addQuestionnaire = async ({ commit }, data) => {
	await ServiceMethodService.common('post', API_ENDPOINTS['questionnaire'], null, data)
		.then((response) => {

commit('addQuestionnaire', response.data.data);
			successSwal(response.data.message);

			commit('successMsg', response.data.message);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);

			//errorSwal(error.response.data.message);
		});
};
export const assignNestedQuestion = async ({ commit }, data) => {
	await ServiceMethodService.common(data.method, 'question/option/assign', null, data.data)
		.then((response) => {
			if(data.show){
				successSwal(response.data.message);
			}
			commit('successMsg', response.data.message);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
};
export const addOptions = async ({ commit }, data) => {
	await ServiceMethodService.common(data?.method, "question/options/"+data.id, null, data.data)
		.then((response) => {
			commit('addOptions', response.data.data);
			successSwal(response.data.message);
			commit('successMsg', response.data.message);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
}
export const updateOptionsDetails = async ({ commit }, data) => {
	
	await ServiceMethodService.common('put', "question/options/"+data.questionId, null, data.data)
		.then((response) => {
			commit('addOptionsDetails', response.data);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
}
export const questionnaireList = async ({ commit }, data) => {
	commit('questionnaireLoadingStatus', true)
	let url = data ? API_ENDPOINTS['questionnaire']+'?'+data : API_ENDPOINTS['questionnaire']
	await ServiceMethodService.common('get', url, null, null)
		.then((response) => {
			if(data.commit){
				commit('questionnaireList', response.data)
			}else{
				commit('questionnaireList', response.data)
			}
			commit('questionnaireLoadingStatus', false)
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message)
			commit('questionnaireLoadingStatus', false)
		});
};
export const detailsQuestionnaire = async ({ commit }, data) => {
	
	await ServiceMethodService.common('get', API_ENDPOINTS['questionnaire']+data, null, null)
		.then((response) => {
			commit('detailsQuestionnaire', response.data);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
};
export const updateQuestionnaire = async ({ commit }, data) => {
	await ServiceMethodService.common('put', API_ENDPOINTS['questionnaire']+'/'+data.id, null, data.data)
		.then((response) => {
			commit('successMsg', response.data.message);
			successSwal(response.data.message);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
};
export const deleteQuestionnaire = async ({ commit }, id) => {
	await ServiceMethodService.common('delete', API_ENDPOINTS['questionnaire'], id, null)
		.then((response) => {
			commit('successMsg', response.data.message);
			successSwal(response.data.message);
		})
		.catch((error) => {
			commit('questionnaireErrorMsg', error.response.data.message);
			//errorSwal(error.response.data.message);
		});
};