import { computed } from "vue";
export const questionnaireSection = (state) => {
  return computed(() => {
    return state.questionnaireSection
  })
}
export const questionnaireTemplateSection = (state) => {
  return computed(() => {
    return state.questionnaireTemplateSection
  })
}

export const questionnaireSectionMeta = (state) => {
  return computed(() => {
    return state.questionnaireSectionMeta
  })
}
export const sectionDetailsList = (state) => {
  return computed(() => {
    return state.sectionDetailsList
  })
}
export const allSections = (state) => {
  return computed(() => {
    return state.allSections
  })
}

