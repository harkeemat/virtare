import {
  dateOnlyFormat,
  globalDateFormat,
  dateAndTimeFormate,
  globalDateTimeFormat
} from '@/commonMethods/commonMethod';


export const escalationCounterPlus = (state,data) => {
 
  state.escalationCounter += data
}

export const escalationCounterMinus = (state) => {
  setTimeout(()=>{
    state.escalationCounter--
  },300)
}

export const resetEscalationCounter = (state) => {
  state.escalationCounter = 0
}

export const escalation = (state, data) => {
	state.escalationMeta = data.meta ? data.meta.pagination : ''
	state.escalation = data.data.map((item) => {
		item.dueBy = dateAndTimeFormate(item.dueBy,globalDateFormat);
    item.createdAt = dateOnlyFormat(item.createdAt)
		return item;
	})
};


export const escalationHistory = (state, data) => {
	state.escalationHistory = data.data.map((item) => {
		item.dueBy = dateAndTimeFormate(item.dueBy,globalDateFormat);
    item.createdAt = dateOnlyFormat(item.createdAt)
		return item;
	})
};


export const escalationStaus = (state, data) => {
	state.escalationStaus = data;
};

export const addBasicEscalation = (state, data) => {
  state.addBasicEscalation = data
  
  state.editEscalationPatient=[{ 
    value:data.patient?.id,
    label:data.patient?.fullName
  }]
}


export const addAssignTo = (state, data) => {
  state.addAssignTo = data
}


export const escalationSpecialist = (state, data) => {
  state.escalationSpecialist = data
}

export const updateBasicEscalation = (state, data) => {
  state.editEscalationStaff  = data

  state.editEscalationPatient=[{
    // value:data.patientId,
    // label:data.patientName
    value:data.patient?.id,
    label:data.patient?.fullName
  }]
}


// export const escalation = (state, data) => {
//   state.escalation = data
// }





export const esacalationFlagList = (state, data) => {
  state.esacalationFlagList = data.map((item) => {
		item.createdAt = dateAndTimeFormate(item.createdAt,globalDateFormat);
		return item;
	})
}

export const escalationNotesList = (state, data) => {
  state.escalationNotesList = data.map(note => {
    note.date = dateOnlyFormat(note.date);
    return note;
  });
}


export const esacalationCarePlansList = (state, data) => {
  state.esacalationCarePlansList = data.map(carePlan => {
    carePlan.startDate = dateOnlyFormat(carePlan.startDate)
    carePlan.endDate = dateOnlyFormat(carePlan.endDate)
    return carePlan
  })
}


export const escalationVitalList = (state, data) => {
  state.escalationVitalList = data.map((item) => {
		item.startTime = item.startTime?dateAndTimeFormate(item.startTime,globalDateFormat):'';
    item.endTime = item.endTime?dateAndTimeFormate(item.endTime,globalDateFormat):'';
    item.takeTime  = dateAndTimeFormate(item.takeTime,globalDateTimeFormat)
		return item;
	})
}


export const singleEscalationRecord = (state, data) => {
 
  // state.singleEscalationRecord['createdAt'] = dateAndTimeFormate(data.createdAt,globalDateFormat)
  state.singleEscalationRecord = data
  state.singleEscalationRecord['createdAt'] = data.createdAt?dateAndTimeFormate(data.createdAt,globalDateFormat):null
  state.singleEscalationRecord['escalationClose'] = data?.escalationClose?.date?dateAndTimeFormate(data?.escalationClose?.date,globalDateFormat):null

  let vitals = data?.escalationDetail.filter(item => item.entityType=='vital').map(item=> JSON.parse((JSON.parse(item.value))))
  state.escalationVitals = vitals[0]
  
  let notes = data?.escalationDetail.filter(item => item.entityType=='notes').map(item=> JSON.parse((JSON.parse(item.value))))
  state.escalationNots = notes[0]
  
  let carePlans = data?.escalationDetail.filter(item => item.entityType=='carePlan').map(item=> JSON.parse((JSON.parse(item.value))))
  state.escalationCarePlan = carePlans[0]

  let flags = data?.escalationDetail.filter(item => item.entityType=='flag').map(item=> JSON.parse((JSON.parse(item.value))))
  state.escalationFlags = flags[0]

  let escalations = data?.escalationDetail.filter(item => item.entityType=='escalation').map(item=> JSON.parse((JSON.parse(item.value))))
  state.escalationList = escalations[0]

}

export const escalationStaffs = (state, data) => {
  state.escalationStaffs = data;
};

export const careCircle = (state, data) => {
  state.careCircle = data;
};

export const escReferral = (state, data) => {
  state.escReferral = data;
};

// export const specialist = (state, data) => {
//   state.specialist = data.map(item => {
//     item.designation = item.staffData.data?.designation  
//     item.organisation = item.staffData.data?.organisation
//     item.specialization = item.staffData.data?.specialization
//     return item
//   })
// }

export const patientVital = (state, data) => {
  state.patientVital = data.map(note => {
    note.date = dateOnlyFormat(note.date);
    return note;
  });
};

export const appointment = (state, data) => {
  state.appointment = data.map(note => {
    note.date = dateOnlyFormat(note.date);
    return note;
  });
};

export const auditlog = (state, data) => {
  state.auditlog = data.map(note => {
    note.date = dateOnlyFormat(note.date);
    return note;
  });
};

export const patientFlag = (state, data) => {
  state.patientFlag = data.map(note => {
    note.date = dateOnlyFormat(note.date);
    return note;
  });
};


export const submitActionForm = (state, data) => {
  state.submitActionForm = data;
};


export const getAuditData = (state, data) => {
  state.getAuditData = data.map(item => {
    item.createdAt = dateOnlyFormat(item.createdAt);
    item.name = item.createdBy?.fullName
    return item;
  });
};

export const escalationAudit = (state, data) => {
	state.escalationAuditMeta = data.meta ? data.meta.pagination : ''
	state.escalationAudit = data.data.map((item) => {
		item.dueBy = dateAndTimeFormate(item.dueBy,globalDateFormat);
    item.createdAt = dateOnlyFormat(item.createdAt)
		return item;
	})
};
export const escalationDateFilter =(state,data)=>{
  state.escalationDateFilter = data
}