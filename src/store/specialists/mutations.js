
export const SPECIALISTS = (state, data) => {
	state.specialists = data?.data;
	state.specialistsMeta = data?.meta?.pagination;
};

export const SPECIALIST_SUMMARY = (state, data) => {
	state.specialistSummary = data
}
export const SPECIALISTS_ERROR = (state, data) => {
	state.specialistError = data
}
export const loadingDetails = (state,data) => {
 state.loadingDetails = data;
}
