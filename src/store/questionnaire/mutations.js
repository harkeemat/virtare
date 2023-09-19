export const addQuestionnaire = async (state, data) => {
  state.addQuestionnaire = data
}
export const addOptions = async (state, data) => {
  state.addOptions = data
}
export const questionnaireList = async (state, data) => {
  state.questionnaireList = data.data
  state.questionMeta = data.meta ? data.meta.pagination :''
}
export const allQuestionnaireListing = async (state, data) => {
  state.allQuestionnaireListing = data.data

}
export const addOptionsDetails = async (state, data) => {
  state.addOptionsDetails = data.data
}
export const questionnaireErrorMsg = async (state, data) => {
  state.questionnaireErrorMsg = data
}
//search question list from common store

export const detailsQuestionnaire = async (state, data) => {
  let tags = [];

	data?.data?.tags ? data.data.tags.map((record) => {
		tags.push(record.tag);
	}):''
	data.data.tags = tags;
  state.detailsQuestionnaire = data.data
}
export const scoreTypeData = async (state, data) => {
  state.scoreTypeData = data.data
}

