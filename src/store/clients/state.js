export default {
	// Clients
	addClient: null,
	errorClients: null,
	clientsList: null,
	clientInformation: null,
	updateClient: null,

	// Client Contact Person
	addClientContact: null,

	// Client Sites
	addClientSite: null,
	sitesList: null,
	sitesListDropdown: null,
	clientSiteDetails: null,
	updateClientSite: null,

	// Client People
	addPeople: null,
	peopleList: [],
	peopleListDropdown: [],
	peopleDetails: null,
	updatePeople: null,

	// Care Teams
	addCareTeam: null,
	careTeamListByClient: [],
	careTeamDetails: null,
	updateCareTeam: null,

	// Care Team Members
	careTeamMembersList: null,
	siteHead: [],
	clientProgramRecord: [],
	clientLoadingStatus: null,
	AddClientLoadingStatus: null,
	siteProgramsList: null,
	clientPatientsRecord: [],
	careTeambutton: false,
	addressRecord: [],
	clientMeta: null,
	siteMeta: null,
	peopleMeta: null,
	careMeta: null,
	patientMeta: null,
	staffSites: [],
	selectedSite: "",
	sitesDropdown: "",
	//billing
	clientBillingList: [],
	clientBillingMeta: null,
	clientBillingLoading: false,
	clientBilling: {
		isLoading: false,
		error: {},
	},
	clientsError:null,
	allPeopleList:[],
}