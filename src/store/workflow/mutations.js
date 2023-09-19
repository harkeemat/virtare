import { dateAndTimeFormate,globalDateFormat} from '@/commonMethods/commonMethod';

export const counterPlus = (state) => {
	state.counter++;
};

export const counterMinus = (state) => {
	state.counter--;
};

export const resetCounter = (state) => {
	state.counter = 0;
};

export const workflowEvents = (state, data) => {
    state.workflowEvents = data.map(item=>{
        item.name = item.title 
        return item
    })
 }

 export const addWorkFlow = (state, data) => {
    state.addWorkFlow = data
 }

 
 export const workflowList = (state, data) => {
    state.workflowList = data.map(item =>{
        item.configureWorkflow = 'configuration'
        item.startDate = dateAndTimeFormate(item.startDate,globalDateFormat)
        item.endDate = dateAndTimeFormate(item.endDate,globalDateFormat)
        return item
    })
 }

 export const workflowColumn = (state, data) => {
    state.workflowColumn = data
 }

export const workflowColumns = (state, data) => {
   state.workflowColumns = data
}

 export const workflowCriteria = (state, data) => {
    state.workflowCriteria = data
 }

 
 export const editWorkflow = (state, data) => {
    state.editWorkflow = data;
    state.editWorkflow['startDate'] = dateAndTimeFormate(data.startDate,globalDateFormat)
    state.editWorkflow['endDate'] = dateAndTimeFormate(data.endDate,globalDateFormat)
 }


 
 export const addWorkflowCriteria = (state, data) => {
    state.addWorkflowCriteria = data
 }
 
 export const workflowCriteriaDetails = (state, data) => {
   if(Object.keys(data).length != 0) {
      state.workflowCriteriaDetails = JSON.parse(data.criteria);
   }
 }

 export const addGroupAction = (state, data) => {
    state.addGroupAction = data
 }

 export const groupActionList = (state, data) => {
    state.groupActionList = data.map(item=>{
        item.numberOfActions = 0
        return item
    })
 }

 export const editGroupAction = (state, data) => {
    state.editGroupAction = data
 }

 
 export const actionsOffset = (state, data) => {
   state.actionsOffset = data.map(item=>{
      item.name = item.title
      return item
   })
}


export const actionsField = (state, data) => {
   state.actionsField = data
}


export const actionsList = (state, data) => {
   state.actionsList = data
}

export const editWorkflowAction = (state, data) => {
   state.editWorkflowAction = data
}

export const addActions = (state, data) => {
   state.addActions = data
}

export const updateAction = (state, data) => {
   state.updateAction = data
}

export const customFormDetails = (state, data) => {
   state.customFormDetails = data
}

export const actionCriteria = (state, data) => {
   state.actionCriteria = data
}