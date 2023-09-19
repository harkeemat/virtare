import {
  globalDateTimeFormat,
  dateAndTimeFormate,
} from '@/commonMethods/commonMethod';

export const fieldList = (state, data) => {
  state.fieldList = data;
}


export const errorMsg = (state, data) => {
  state.errorMsg = data;
}

export const customForms = (state, data) => {
  state.customForms = data.map(item=>{
    item.dateTime = dateAndTimeFormate(item.createdOn,globalDateTimeFormat);
    return item
  });
}

export const saveForm = (state, data) => {
  state.saveForm = data;
}


export const viewTemplate = (state, data) => {
  state.viewTemplate = data;
}

export const responseTemplate = (state, data) => {
  state.responseTemplate = data

  // state.responseTemplate = data?.columns
  // .map(item =>{
  //   {
  //     item.Name = item
  //     item.index = item.toLowerCase()
  //   }
  //   return item
  // });
}

export const assignedForm = (state, data) => {
  state.assignedForm = data.map(item=>{
    item.dateTime = dateAndTimeFormate(item.assignedOn,globalDateTimeFormat);
    return item
  });
}

export const getTemplateDetails = (state, data) => {
  state.getTemplateDetails = data
}

export const getTemplateQuestionSection = (state, data) => {
  state.getTemplateQuestionSection = data
}


export const getStepsForms = (state, data) => {
  state.getStepsForms = data
}