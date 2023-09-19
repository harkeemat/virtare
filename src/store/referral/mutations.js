
export const referral = async (state, referral) => {
  state.globalReferral = referral.data.map(item => {
		item.phoneNumber = item.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
		return item
	});
  state.referralMeta=referral.meta ? referral?.meta?.pagination : ''
}

