import serviceMethod from '@/services/serviceMethod';
import {
  errorLogWithDeviceInfo,
  successSwal
} from '@/commonMethods/commonMethod';

export const fieldList = async ({
  commit
}) => {
  commit('loadingStatus', true);
  await serviceMethod
    .common('get', `control-fields`, null, null)
    .then((response) => {
      commit('fieldList', response.data.data);
      commit('loadingStatus', false);
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('failure', error.response.data);
      commit('loadingStatus', false);
    });
};


export const customForms = async ({
  commit
}) => {
  commit('loadingStatus', true);
  await serviceMethod
    .common('get', `custom-forms`, null, null)
    .then((response) => {
      commit('customForms', response.data.data);
      commit('loadingStatus', false);
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('failure', error.response.data);
      commit('loadingStatus', false);
    });
};


export const viewTemplate = async ({
  commit
}, id) => {
  let status = false
  commit('loadingStatus', true);
  await serviceMethod
    .common('get', `custom-forms/${id}`, null, null)
    .then((response) => {
      commit('viewTemplate', response.data.data);
      commit('loadingStatus', false);
      status = true
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('failure', error.response.data);
      commit('loadingStatus', false);
    });

  return status
};


export const responseTemplate = async ({
  commit
},data) => {
  let status = false
  commit('loadingStatus', true);
  await serviceMethod
    .common('get', `form-response/${data.formId}/${data.patientId}`, null, null)
    .then((response) => {
      commit('responseTemplate', response.data.data);
      commit('loadingStatus', false);
      status = true
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('failure', error.response.data);
      commit('loadingStatus', false);
    });

  return status
};


export const saveForm = async ({
  commit
}, data) => {
  let status = false
  await serviceMethod.common("post", `save-form`, null, data).then((response) => {
    commit('saveForm', response.data.data);
    commit('counterPlus')
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        commit('errorMsg', error.response.data.message)
      }
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}


export const assignFormData = async ({
  commit
}, data) => {
  let status = false
  await serviceMethod.common("post", `assign-form`, null, data).then((response) => {
    commit('assignFormData', response.data.data);
    commit('counterPlus')
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        commit('errorMsg', error.response.data.message)
      }
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}

export const deleteTemplate = async ({
  commit
}, id) => {
  let status = false
  await serviceMethod.common("delete", `custom-forms`, id, null).then((response) => {
      successSwal(response.data.message)
      status = true
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('errorMsg', error.response.data)
    })
  return status
}


export const saveFormData = async ({
  commit
}, data) => {
  let status = false
  await serviceMethod.common("post", `save-form-data`, null, data).then((response) => {
    commit('saveFormData', response.data.data);
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        commit('errorMsg', error.response.data.message)
      }
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}


export const assignedForm = async ({ commit }, patientId) => {
  await serviceMethod.common("get", `get-assigned-forms/${patientId}`, null, null).then((response) => {
    commit('assignedForm', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}



export const getTemplateDetails = async ({ commit }, templateId) => {
  await serviceMethod.common("get", `get-template-detail/${templateId}`, null, null).then((response) => {
    commit('getTemplateDetails', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}


export const getTemplateQuestionSection = async ({ commit }, templateId) => {
  let status = false
  await serviceMethod.common("get", `get-template-question-section/${templateId}`, null, null).then((response) => {
    commit('getTemplateQuestionSection', response.data.data);
    status = true
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}


export const saveQuestionnaireFormData = async ({
  commit
}, data) => {
  let status = false
  await serviceMethod.common("post", `save-response-template-question-section`, null, data).then((response) => {
    commit('saveQuestionnaireFormData', response.data.data);
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        commit('errorMsg', error.response.data.message)
      }
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}

export const getStepsForms = async ({ commit }, templateId) => {
  let status = false
  await serviceMethod.common("get", `get-steps-forms/${templateId}`, null, null).then((response) => {
    commit('getStepsForms', response.data.data);
    status = true
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}