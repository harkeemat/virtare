import { computed } from "vue";
export const getTemplateQuestionSection = (state) => {
  return computed(() => {
    return state.getTemplateQuestionSection
  })
}