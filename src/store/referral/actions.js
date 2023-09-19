
import { API_ENDPOINTS } from "@/config/apiConfig"
import api from "@/services/api";
export const referral = async ({ commit }, page) => {
	commit('loadingTableStatus', true)
	let link = page ? API_ENDPOINTS['referralList'] + page : API_ENDPOINTS['referralList']
	try {	
		const { data } = await api.get(link)
		commit('referral', data);
	} catch (error) {
		commit('errorMsg', error)
	}
	commit('loadingTableStatus', false)
}

