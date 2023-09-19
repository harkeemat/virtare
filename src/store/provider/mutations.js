import store from '@/store/index'
import {arrayToObjectData } from "@/commonMethods/commonMethod"
export const providerCounterPlus = (state) => {
	state.counter++
};

export const providerCounterMinus = (state) => {
	state.counter--;
};

export const providerResetCounter = (state, data) => {
	state.counter = data;
};

export const errorMsg = (state, data) => {
	state.errorMsg = data;
};
export const providerData = (state, data) => {
	state.provider = data;
	state.providerData = data;
};
export const providerLocation = (state, data) => {
	state.providerLocation = data;
};

export const addProviderLocation = (state, data) => {
	state.addProviderLocation = data;
};

export const parentLocations = (state, data) => {
	state.parentLocations = data;
};

export const groupLocations = (state, data) => {
	state.groupLocations = data.map(item => {
		item.value = item.udid ? item.udid : item.id
		item.label = item.locationName ? item.locationName : item.name
		return item
	})
};

export const providerLocations = (state, data) => {
	state.providerLocations = data
	let locations = []
	let loc = {}
	let response = data
	if(response.length > 0) {
		response.map(location => {
			let parentEntityType = ''
			if(location.entityType == 'Country') {
				parentEntityType = ''
			}
			if(location.entityType == 'State') {
				parentEntityType = 'Country'
			}
			else if(location.entityType == 'City') {
				parentEntityType = 'State'
			}
			else if(location.entityType == 'subLocation') {
				parentEntityType = location.subLocationName ? 'City' : 'subLocation'
			}
			loc = {
				id: location.id,
				value: location.id,
				key: String(location.id),
				parentKey: null,
				udid: location.udid,
				name: location.locationName,
				title: location.locationName,
				parentId: location.parentId,
				parentName: location.parentName,
				entityType: location.entityType,
				parentEntityType: parentEntityType,
				providerId: location.provider ? location.provider.id : null,
				providerName: location.provider ? location.provider.name : "",
				programs: location.programs ? location.programs : [],
				children: []
			}
			locations.push(loc)
		});
	}
	
	state.parentProviderLocations = locations
};

export const subLocationsList = (state, data) => {
	let locations = []
	let response = data.data
	let parentKey = data.parentKey
	response.map((location, index) => {
		
		let parentEntityType = ''
		if(location.entityType == 'Country') {
			parentEntityType = ''
		}
		if(location.entityType == 'State') {
			parentEntityType = 'Country'
		}
		else if(location.entityType == 'City') {
			parentEntityType = 'State'
		}
		else if(location.entityType == 'subLocation') {
			parentEntityType = location.subLocationName ? 'City' : 'subLocation'
		}
		else {
			parentEntityType = 'subLocation'
		}
		locations.push({
			id: location.id ? location.id : "",
			value: location.id,
			// key: location.id+"-"+parentKey,
			key: parentKey+"-"+index,
			parentKey: parentKey,
			udid: location.udid ? location.udid : "",
			name: location.locationName ? location.locationName : location.subLocationName,
			title: location.locationName ? location.locationName : location.subLocationName,
			parentId: location.parentId ? location.parentId : location.subLocationParent,
			parentName: location.parentName ? location.parentName : "",
			entityType: location.entityType ? location.entityType : "",
			parentEntityType: parentEntityType ? parentEntityType : "",
			providerId: location.provider ? location.provider.id : null,
			providerName: location.provider ? location.provider.name : "",
			programs: location.programs,
			children: []
		})
	});
	
	state.subLocationsList = locations
};

export const dropdownSubLocationsList = (state, data) => {
	let locations = []
	let response = data.data
	let parentKey = data.parentKey
	response.map((location) => {
		locations.push({
			id: location.id ? location.id : "",
			value: location.id,
			key: location.id+"-"+parentKey,
			parentKey: parentKey,
			udid: location.udid ? location.udid : "",
			label: location.locationName ? location.locationName : location.subLocationName,
			name: location.locationName ? location.locationName : location.subLocationName,
			title: location.locationName ? location.locationName : location.subLocationName,
			parentId: location.parentId ? location.parentId : "",
			parentName: location.parentName ? location.parentName : "",
			entityType: location.entityType ? location.entityType : "",
			providerId: location.provider ? location.provider.id : null,
			providerName: location.provider ? location.provider.name : "",
			programs: location.programs,
			children: []
		})
	});
	state.dropdownSubLocationsList = locations
};

export const headerProviderLocations = (state, data) => {
	// const authUser = JSON.parse(localStorage.getItem("auth"));
	// const authStaff = authUser.user.staff
	// let userRoles = authStaff.role.map(role => {
	// 	return role.name
	// })
	const locations = []
	if(data && data != null && data.length > 0) {
		data.map(location => {
			// if(!userRoles.includes("Staff")) {
				if(location.entityType == 'Country') {
					location.value = location.id
					location.key = String(location.id)
					location.parentKey = null
					location.name = location.locationName
					location.title = location.locationName
					location.providerId = location.provider ? location.provider.id : null
					location.providerName = location.provider ? location.provider.name : ""
					location.programs = location.programs ? location.programs : []
					location.children = [{}]
					locations.push(location)
				}
			// }
			/* else {
				location.value = location.id
				location.key = String(location.id)
				location.parentKey = null
				location.name = location.locationName
				location.title = location.locationName
				location.providerId = location.provider ? location.provider.id : null
				location.providerName = location.provider ? location.provider.name : ""
				location.programs = location.programs ? location.programs : []
				location.children = [{}]
				locations.push(location)
				state.headerProviderLocations.push = locations
			} */
		});

		// if(!userRoles.includes("Staff")) {
			state.headerProviderLocations.push(locations)
		// }
		// else {
		// 	state.headerProviderLocations = locations
		// }
	}
	else {
		state.headerProviderLocations = []
	}
};

export const headerSubLocations = (state, data) => {
	const authUser = JSON.parse(localStorage.getItem("auth"));
	const authStaff = authUser.user.staff
	// const defaultLocationHierarchy = authStaff.defaultLocationHierarchy != "" && authStaff.defaultLocationHierarchy != null ? JSON.parse(JSON.parse(`"`+authStaff.defaultLocationHierarchy+`"`)) : ""
	let defaultLocationHierarchy = ""
	if(authStaff.defaultLocationHierarchy != "" && authStaff.defaultLocationHierarchy != null) {
		JSON.parse(JSON.parse(authStaff.defaultLocationHierarchy))
	}
	const locations = []
	if(data.length > 0) {
		data.map(location => {
			location.value = location.id
			location.key = String(location.id)
			location.locationId = location.locationId ? location.locationId : location.subLocationName
			location.parentKey = null
			location.name = location.locationName ? location.locationName : location.subLocationName
			location.title = location.locationName ? location.locationName : location.subLocationName
			location.providerId = location.provider ? location.provider.id : null
			location.providerName = location.provider ? location.provider.name : ""
			location.children = [{}]
			if(defaultLocationHierarchy != "") {
				defaultLocationHierarchy.some(value => {
					if(value.entityType == location.entityType) {
						if(value.locationId == location.locationId) {
							location.programs = location.programs ? location.programs : []
							locations.push(location)
						}
					}
				});
			}
			else {
				locations.push(location)
			}
		});
		if(locations.length > 0) {
			state.headerProviderLocations.push(locations)
		}
	}
};

export const dropdownProviderLocations = (state, data) => {
	const locations = []
	if(data && data != null && data.length > 0) {
		data.map(location => {
			if(location.entityType == 'Country') {
				location.value = location.id
				location.key = String(location.id)
				location.parentKey = null
				location.name = location.locationName
				location.label = location.locationName
				location.title = location.locationName
				location.providerId = location.provider ? location.provider.id : null
				location.providerName = location.provider ? location.provider.name : ""
				location.programs = location.programs ? location.programs : []
				location.children = [{}]
				locations.push(location)
			}
		});
		state.dropdownProviderLocations.push(locations)
	}
	else {
		state.dropdownProviderLocations = []
	}
};

export const dropdownSubLocations = (state, data) => {
	const locations = []
	if(data.length > 0) {
		data.map(location => {
			location.value = location.id
			location.key = String(location.id)
			location.parentKey = null
			location.name = location.locationName ? location.locationName : location.subLocationName
			location.title = location.locationName ? location.locationName : location.subLocationName
			location.providerId = location.provider ? location.provider.id : null
			location.providerName = location.provider ? location.provider.name : ""
			location.programs = location.programs ? location.programs : []
			location.children = [{}]
			locations.push(location)
		});
		state.dropdownProviderLocations.push(locations)
	}
};

export const updateHeaderProviderLocations = (state, data) => {
	state.headerProviderLocations = data
};

export const providerLocationById = (state, data) => {
	state.providerLocationById = data;
};

export const subLocationsByParentId = (state, data) => {
	state.subLocationsByParentId = data;
};

export const providerLocationsList = (state, data) => {
	state.providerLocationsList = data;
};

export const provider = (state, data) => {
	state.providersListAll = data.data.map((element) => {
		element.phoneNumber = element.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
		element.isActive = element.isActive == 1 ? true : false;
		return element;
	});
	state.providerMeta = data.meta.pagination;
	state.providerListColumns = [
		{
			title: 'Provider Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
			slots: {
				customRender: 'name'
			}
		},
		{
			title: 'Domain',
			dataIndex: 'domain',
			key: 'domain',
			sorter: true,
		},
		{
			title: 'Provider Address',
			dataIndex: 'address',
			key: 'address'
		},
		{
			title: 'Program(s)',
			dataIndex: 'programs',
			key: 'programs',
			width:"400px",
			slots: {
				customRender: 'programs'
			}
		},
		{
			title: 'Active/Inactive',
			dataIndex: 'isActive',
			key: 'isActive',
			
			slots: {
				customRender: 'isActive'
			}
		},
		{
			title: 'Action',
			dataIndex: 'action',
			hidden:arrayToObjectData(store.getters.screensPermissions.value,23,'id') || arrayToObjectData(store.getters.screensPermissions.value,24,'id') ? false:true,
			slots: {
				customRender: 'action'
			}
		}
	].filter(item => !item.hidden);
};

export const editSingleProvider = async (state, result) => {
	state.editSingleProvider = result;
	result.tagId = JSON.parse(result.tagId);
	result.moduleId = JSON.parse(result.moduleId);
	result.phoneNumber = result.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
	const programs = []
	const providerPrograms = []
	result.programs.map(item => {
		programs.push(item.udid)
		providerPrograms.push(item)
	})
	result.programs = programs
	state.providerPrograms = providerPrograms
	state.providerTags = result.tagId
	state.providerModules = result.moduleId
	
	// state.editSingleProvider['phoneNumber'] = result.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
};

export const getProviderPrograms = async (state, result) => {
	state.getProviderPrograms = result.programs.map(program => {
		program.program = program.name
		program.programId = program.id
		return program
	})
};

export const providerLocationList = (state, data) => {
	state.providerLocationList = '';
	state.providerLocationList = data.map((element) => {
		element.phoneNumber = element.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
		return element;
	});
	state.columns = [
		{
			title: 'Location Name',
			dataIndex: 'locationName'
		},
		{
			title: 'Phone Number',
			dataIndex: 'phoneNumber'
		},
		{
			title: 'No. of Location',
			dataIndex: 'noOfLocations'
		},
		{
			title: 'Address',
			dataIndex: 'address'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			slots: {
				customRender: 'action'
			}
		}
	]; 
};

export const updateSingleProvider = (state, data) => {
	state.updateSingleProvider = data;
	state.updateSingleProvider['phoneNumber'] = data.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
};


export const editProviderLocation = (state, data) => {
	data.phoneNumber = data.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
	// state.editProviderLocation['phoneNumber'] = data.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
	state.editProviderLocation = data;
};

export const locationPrograms = (state, result) => {

	if(result != null) {
		result.data.map((item => {
			item.entityType = result.entityType
			return item
		}))
		state.locationPrograms = result.data
	}
	else {
		state.locationPrograms = result
	}
	/* data.map(item => {
		state.locationPrograms = item.programs.map(program => {
			return program
		});
	}); */
};

export const dropdownLocationPrograms = (state, data) => {
	state.dropdownLocationPrograms = data
};

export const selectedTags = (state, data) => {
	state.selectedTags = data
}

export const selectedModules = (state, data) => {
	state.selectedModules = data
}

export const programProviders = (state, data) => {
	state.programProviders = data
}

export const programsDropdown = (state, data) => {
	state.programsDropdown = data
}

export const providersDropdown = (state, data) => {
	state.providersDropdown = data
}

export const locationsDropdown = (state, data) => {
	state.locationsDropdown = data
}

export const groupsDropdown = (state, data) => {
	state.groupsDropdown = data
}

export const selectedProgram = (state, data) => {
	state.selectedProgram = data
}

export const selectedProvider = (state, data) => {
	state.selectedProvider = data
}

export const selectedLocation = (state, data) => {
	state.selectedLocation = data
}

export const selectedGroup = (state, data) => {
	state.selectedGroup = data
}

export const isManualHeader = (state, data) => {
	state.isManualHeader = data
}

export const providerContact = (state, data) => {
	state.providerContact = data
}

export const addProviderContact = (state, data) => {
	state.addProviderContact = data
}

export const assignProgramToLocation = (state, data) => {
	state.assignProgramToLocation = data
}

export const addProviderSubLocation = (state, data) => {
	state.addProviderSubLocation = data
}

export const locationLevel = (state, data) => {
	state.locationLevel = data
}

export const updateProviderLocation = (state, data) => {
	state.updateProviderLocation = data
}

export const providersListAll = (state, data) => {
	state.providersListAll = data
}

export const headerProvidersListAll = (state, data) => {
	state.headerProvidersListAll = data
}

export const defaultProviderData = (state, data) => {
	state.defaultProviderData = data
}

export const staffProviders = (state, response) => {
	let data = response.data ? response.data : response
	let providers = null
	state.staffProviders = data.map(item => {
		if(item.provider) {
			item.provider.isDefault = item.isDefault
			providers = item.provider
		}
		else {
			providers = item
		}
		return providers
	})
}

export const isEditProvider = (state, data) => {
	state.isEditProvider = data
}

export const addedProviders = (state, data) => {
	state.addedProviders = data
}

export const headerGroups = (state, data) => {
	state.headerGroups = data.map(item => {
		item.id = item.udid
		item.name = item.group
		return item
	})
}