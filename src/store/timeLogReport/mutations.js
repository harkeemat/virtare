import { secondsToTime,dateAndTimeFormate } from '../../commonMethods/commonMethod';

export const timelineReport = (state, data) => {

  state.timelineReport = data
}
export const timeLog = async (state, data) => {
  state.timeLogeMeta = data.meta.pagination
  state.timeLogReportColumns = [
    {
      title: "Care Coordinator",
      dataIndex: "performedBy",
      sorter: true,
      width:"180px",
      slots: {
        customRender: "staff",
      },
    },
    {
      title: "Patient",
      dataIndex: "patient",
      sorter: true,
      width:"120px",
      slots: {
        customRender: "patient",
      },
    },

    {
      title: "Date",
      dataIndex: "date",
      sorter:true,
      width:"120px",
    },
    {
      title: "Time (HH:MM:SS)",
      dataIndex: "timeAmount",
      sorter:true,
      align: 'right',
      width:"180px",
    },
    {
      title: "Category", 
      dataIndex: "category",
      ellipsis: true,
    },

    {
      title: "Activity ",
      dataIndex: "cptCode",
      width:"200px",
    },
    {
      title: "Cpt Code ",
      dataIndex: "cptCodeDetail",
    },
    {
      title: "Amount ",
      dataIndex: "billingAmount",
      align: 'right'
    },
    {
      title: "Priority",
      dataIndex: "flagColor",
      slots: {
        customRender: "flags",
      },
    },
    
    {
      title: "Notes", 
      dataIndex: "note",
    },
    
    {
      title: "Actions",
      dataIndex: "actions",
      slots: {
        customRender: "actions",
      },
    },
  ];
  
  state.timeLogReportList = data.data.map(item => {
    item.timeAmount = secondsToTime(item.timeAmount)
    item.billingAmount = item.billingAmount ?'$ ' + item.billingAmount :''
    item.date = dateAndTimeFormate(item.date,'MMM DD, yyyy')
    return item
  })
    
}
export const timeLogView = async (state, data) => {
  //state.auditMetaLog= data.meta.pagination
  state.timeLogView = data.data.map(item => {
    
    item.time = item.timeAmount?secondsToTime(item.timeAmount):''
    item.date = item.createdAt?dateAndTimeFormate(item.createdAt,'MMM DD, yyyy'):''
    return item
  })
  state.viuewTimeReportModal = [ 
    {
      title: "Change By",
      dataIndex: "createdBy",
      slots: {
        customRender: "createdBy",
      },
    },
    {
      title: "Change Date ", 
      dataIndex: "date",
      slots: {
        customRender: "date",
      },
    },
    
    {
    title: "Time (MM:SS)",
    dataIndex: "time",
    
  },
  
  {
    title: "Notes ", 
    dataIndex: "note",
    slots: {
      customRender: "note",
    },
  },
  {
    title: "Priority",
    dataIndex: "flag",
    slots: {
      customRender: "flag",
    },
  },
  
  ]
 
 
    
}
export const reportExport = (state, data) => {
  state.reportExport = data
}
export const editAuditTimeLog = async (state, data) => {
  data.flag = data.flagId
  data.timeAmount = secondsToTime(data.timeAmount)
  state.editAuditTimeLog = data
}

export const auditTimePermissions = (state, auth) => {
  if (auth == 1) {

    state.auditTimePermissions = [{
      id: 1,
      name: "List Table"
    },
    {
      id: 2,
      name: "Table Action"
    }
  ]
  } else if (auth == 2) {
    state.auditTimePermissions = [{
      id: 1,
      name: "List Table"
    },
    
    ]
  }else{
    state.auditTimePermissions =[]
  }

}

export const auditTimeLogFilterDates = (state, date) => {
state.auditTimeLogFilterDates = date
}

