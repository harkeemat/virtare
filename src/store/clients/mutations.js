import {
	dateFormatClient, timeStampFormate, billingDateFormat
} from '@/commonMethods/commonMethod';
//import moment from 'moment';

export const addClient = async (state, data) => {
	state.addClient = data;
};

export const errorClients = async (state, data) => {
	state.errorClients = data;
};

export const clientsList = async (state, data) => {
	state.clientsList = data.data;
	state.clientMeta = data?.meta ? data?.meta?.pagination : ''
};

export const clientInformation = async (state, data) => {
	data.startDate = dateFormatClient(data.startDate)
	data.endDate = dateFormatClient(data.endDate)
	// data.programs.map(program => {
	// 	program.id = program.udid
	// 	return program
	// })
	state.clientInformation = data;
};

export const updateClient = async (state, data) => {
	state.updateClient = data;
};

export const addClientContact = async (state, data) => {
	state.addClientContact = data;
};

export const addClientSite = async (state, data) => {
	state.addClientSite = data;
};

export const sitesList = async (state, data) => {
	state.sitesList = data?.data;
	state.siteMeta = data?.meta ? data?.meta?.pagination : ''
};

export const sitesListDropdown = async (state, data) => {
	state.sitesListDropdown = data;
};

export const clientSiteDetails = async (state, data) => {
	state.clientSiteDetails = data;
};

export const updateClientSite = async (state, data) => {
	state.updateClientSite = data;
};

export const addPeople = async (state, data) => {
	state.addPeople = data;
};

export const peopleList = async (state, data) => {
	data.name = data.fullName
	state.peopleList = data.data;
	state.peopleMeta = data?.meta ? data?.meta?.pagination : ''
};

export const peopleListDropdown = async (state, data) => {
	data.name = data.fullName
	state.peopleListDropdown = data;
};

export const peopleDetails = async (state, data) => {
	data.type = data.type ? true : false
	state.peopleDetails = data;
};

export const updatePeople = async (state, data) => {
	state.updatePeople = data;
};

export const addCareTeam = async (state, data) => {
	state.addCareTeam = data;
};

export const careTeamListByClient = async (state, data) => {
	data?.data.map(item => {
		item.careTeamMembers = []
		item.care_team_members.map(careTeamMember => {

			item.careTeamMembers.push({
				udid: careTeamMember?.udid,
				isHead: careTeamMember?.isHead,
				isSiteHead: careTeamMember?.isSiteHead,
				name: careTeamMember?.contactPerson?.name,
				email: careTeamMember?.contactPerson?.email,
				firstName: careTeamMember?.contactPerson?.firstName,
				lastName: careTeamMember?.contactPerson?.lastName,
				middleName: careTeamMember?.contactPerson?.middleName,
				phoneNumber: careTeamMember?.contactPerson?.phoneNumber,
				roleId: careTeamMember?.contactPerson?.roleId,
				roleName: careTeamMember?.contactPerson?.roleName,
				timeZoneId: careTeamMember?.contactPerson?.timeZoneId,
				title: careTeamMember?.contactPerson?.title,
				memberUdid: careTeamMember?.contactPerson?.udid,
			})
		})
		item.key = item.udid
		return item
	})
	state.careTeamListByClient = data.data;
	state.careMeta = data?.meta ? data?.meta?.pagination : ''
};

export const careTeamDetails = async (state, data) => {
	state.careTeamDetails = data;
};

export const updateCareTeam = async (state, data) => {
	state.updateCareTeam = data;
};

export const careTeamMembersList = async (state, data) => {
	state.careTeamMembersList = data;
};

export const siteHead = async (state, data) => {
	state.siteHead = data?.length > 0 ? data.map((item) => {
		if (item.udid != 1) {
			item.name = item?.title ? item?.title + ', ' + item?.name : item?.name
		}
		return item
	}) : ''
};

export const clientProgramRecord = async (state, data) => {
	state.clientProgramRecord = data;
};

export const clientLoadingStatus = async (state, data) => {
	state.clientLoadingStatus = data;
};

export const AddClientLoadingStatus = async (state, data) => {
	state.AddClientLoadingStatus = data;
};

export const siteProgramsList = async (state, data) => {
	state.siteProgramsList = data;
};
export const clientPatientsRecord = async (state, data) => {
	state.clientPatientsRecord = data.data;
	state.patientMeta = data?.meta ? data?.meta?.pagination : ''
};
export const careTeambutton = async (state, data) => {
	state.careTeambutton = data;
};
export const addressRecord = async (state, data) => {
	state.addressRecord = data?.length > 0 ? data.map((item, index) => {
		if (index != 0) {
			item.udid = item?.addressLine1
			item.name = item?.fullAddress
		} else {
			item.udid = 1
		}
		return item
	}) : ''
};

export const staffSites = async (state, data) => {
	state.staffSites = data;
};

export const selectedSite = async (state, data) => {
	state.selectedSite = data;
};

export const sitesDropdown = async (state, data) => {
	state.sitesDropdown = data;
};
export const CLIENT_BILLING_LIST = async (state, billing) => {
	state.clientBillingList = []
	if (typeof billing?.data != "undefined" && billing?.data?.length > 0) {

		state.clientBillingList = billing?.data.map(
			(item) => {
				item.startDate = item?.startDate != "" && item?.startDate ? timeStampFormate(item.startDate, billingDateFormat) : '-'
				item.endDate = item?.endDate != "" && item?.endDate ? timeStampFormate(item.endDate, billingDateFormat) : '-'
				//item.processDate = item?.processDate != "" && item?.processDate ? dateFormatClient(item.processDate) : '-'
				item.isBilledDate = item?.isBilledDate != "" && item?.isBilledDate ? timeStampFormate(item.isBilledDate, billingDateFormat) : '-'
				return item

			})
	}
	state.clientBillingMeta = billing?.meta?.pagination
};
export const CLIENT_BILLING_LOADING = async (state, data) => {
	state.clientBillingLoading = data
};
export const CLIENT_BILLING_ERROR = async (state, error) => {
	state.clientBilling.error = error
};
export const CLIENTS_ERROR = async (state, data) => {
	state.clientsError = data
}

export const allPeopleList = async (state, data) => {
	state.allPeopleList = data
}