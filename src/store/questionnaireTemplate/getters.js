import { computed } from "vue";
export const questionnaireTemplateList = (state) => {
  return computed(() => {
    return state.questionnaireTemplateList
  })
}
export const addQuestionnaireTemplate = (state) => {
  return computed(() => {
    return state.addQuestionnaireTemplate
  })
}
export const detailsQuestionnaireTemplate = (state) => {
  return computed(() => {
    return state.detailsQuestionnaireTemplate
  })
}
export const questionnaireTemplateMeta = (state) => {
  return computed(() => {
    return state.questionnaireTemplateMeta
  })
}
export const templateDetailsList = (state) => {
  return computed(() => {
    return state.templateDetailsList
  })
}
export const scoreCount = (state) => {
  return computed(() => {
    return state.scoreCount
  })
}
export const questionnaireResponse = (state) => {
  return computed(() => {
    return state.questionnaireResponse
  })
}
export const questionnaireResponseDetails = (state) => {
  return computed(() => {
    return state.questionnaireResponseDetails
  })
}
export const assignAllTemplates = (state) => {
  return computed(() => {
    return state.assignAllTemplates
  })
}
export const assignedUsers = (state) => {
  return computed(() => {
    return state.assignedUsers
  })
}
export const fillBy = (state) => {
  return computed(() => {
    return state.fillBy
  })
}
export const assignMeta = (state) => {
  return computed(() => {
    return state.assignMeta
  })
}
export const questionnaireResponseMeta = (state) => {
  return computed(() => {
    return state.questionnaireResponseMeta
  })
}
export const clientResponse = (state) => {
  return computed(() => {
    return state.clientResponse
  })
}
export const nestedQuestion = (state) => {
  return computed(() => {
    return state.nestedQuestion
  })
}
export const userAssignList = (state) => {
  return computed(() => {
    return state.userAssignList
  })
}
export const categoryType = (state) => {
  return computed(() => {
    return state.categoryType
  })
}
export const actionData = (state) => {
  return computed(() => {
    return state.actionData
  })
}

