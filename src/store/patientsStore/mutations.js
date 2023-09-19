import { dateFormatClient,globalDateFormat } from "@/commonMethods/commonMethod";
import dayjs from 'dayjs';
export const patientsLoaderStatus = (state, data) => {
  state.patientsLoaderStatus = data;
};
export const addPatientTabLoader = (state, data) => {
  state.addPatientTabLoader = data;
};
//Tab loader
export const patientTabLoader = (state, data) => {
  state.patientTabLoader = data;
};
export const patientTimerStatus = (state, data) => {
  state.patientTimerStatus = data;
};

export const patientTimerValue = (state, data) => {
  state.patientTimerValue = data;
};

export const allPatientsList = (state, data) => {
  data?.data.map((item) => {
    item.lastReadingDate =
      item.lastReadingDate != null && item.lastReadingDate != ""
        ? dateFormatClient(item.lastReadingDate)
        : "";
    item.lastMessageSent =
      item.lastMessageSent != null && item.lastMessageSent != ""
        ? dateFormatClient(item.lastMessageSent)
        : "";
  });

  state.newPatientsMeta = data?.meta?.pagination;
  state.allPatientsList = data?.data;

  if (data?.filter?.length > 0) {
    state.patientsFilter = data?.filter;
  }
};

export const patientInformation = (state, data) => {
  data.contact.dob =
    data.contact.dob != null && data.contact.dob != ""

? dayjs(data.contact.dob).format(globalDateFormat)
      : dayjs();
  //let age = Math.floor((new Date() - new Date(data.contact.dob)) / 31557600000);
  data.contact.age = data.contact.dob;
  data.vitals = data.vital ? data.vital : data.vitals;
  state.patientInformation = data;
};

export const CREATE_PATIENTS_LOADING = (state, loading) => {
  state.createPatient.isLoading = loading;
};

export const CREATE_PATIENTS_ERROR = (state, error) => {
  state.createPatient.error = error;
};

export const CREATE_PATIENTS_COMPLETED = (state, status) => {
  state.createPatient.isCompleted = status;
};
export const patientsTab = (state, data) => {
  state.patientsTab = data;
};
export const manualTabchange = (state, data) => {
  state.manualTabchange = data;
};
export const patientTabsEnabled = (state, data) => {
  state.patientTabsEnabled = data;
};
export const patientVitalsEnabled = (state, data) => {
  state.patientVitalsEnabled = data;
};
export const patientDevicesEnabled = (state, data) => {
  state.patientDevicesEnabled = data;
};

export const statusDropDown = (state, status) => {
  state.statusDropDown = status;
};

export const convertSystemUser = (state, status) => {
  state.convertSystemUser = status;
};

export const errorLog = (state, data) => {
  state.errorLog = data;
};
export const skeleton = (state, data) => {
  state.skeleton = data;
};

export const logBillingStatus = (state, data) => {
  state.logBillingStatus = data;
};

export const isBillingLogged = (state, data) => {
  state.isBillingLogged = data;
};

export const referrals = (state, data) => {
  const reffs = data.map(({ name, id }) => ({ label: name, value: id }));
  state.referrals = [{ label: "Add Referral", value: "add" }, ...reffs];
};

export const patientVitalAttributes = (state, data) => {
  state.patientVitalAttributes = data
}

export const patientInfoSuccess = (state, data) => {
  state.patientInfoSuccess = data
}

export const wantToChat = (state, data) => {
  state.wantToChat = data
}

export const leaveDetailsPage = (state, data) => {
  state.leaveDetailsPage = data
}
