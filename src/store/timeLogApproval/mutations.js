import { secondsToTime,secondsToMinutes,dateOnlyFormat } from '@/commonMethods/commonMethod';

export const timelineReport = (state, data) => {

  state.timelineReport = data
}
export const timeApproval = async (state, data) => {
  state.timeLogeMeta = data?.meta?.pagination
  state.timeLogReportColumns = [
    
    {
      title: "Patient",
      dataIndex: "patient",
      sorter: true,
      slots: {
        customRender: "patient",
      },
    },
    // {
    //   title: "Care Coordinator",
    //   dataIndex: "performedBy",
    //   sorter: true,
    //   slots: {
    //     customRender: "staff",
    //   },
    // },
    {
      title: "Type",
      dataIndex: "type",
      sorter: true,
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      sorter:true
    },
    {
      title: "Time (MM:SS)",
      dataIndex: "time",
      sorter:true,
      // align: 'right'
    },
  
    // {
    //   title: "Cpt Code ",
    //   dataIndex: "cptCodeDetail",
    //   sorter:true
    // },

    {
      title: "Status",
      dataIndex: "status",
      sorter:true
    },
    
    // {
    //   title: "Actions",
    //   dataIndex: "actions",
    //   slots: {
    //     customRender: "actions",
    //   },
    // },
  ];
  
  state.timeApproval = data.data.map(item => {
    // item.timeAmount = secondsToTime(item.time)
    // item.billingAmount = item.billingAmount ?'$ ' + item.billingAmount :''
    item.timeAmount = item.time
    item.time = secondsToMinutes(item.time)
    item.createdAt = dateOnlyFormat(item.createdAt)
    
    return item
  })
    
}
export const timeLogView = async (state, data) => {
  //state.auditMetaLog= data.meta.pagination
  state.viuewTimeReportModal = [ 
    {
      title: "Change By",
      dataIndex: "createdBy",
      slots: {
        customRender: "createdBy",
      },
    },  
    {
    title: "Time (MM:SS)",
    dataIndex: "timeAmount",
    
  },
  
  {
    title: "Notes ", 
    dataIndex: "note",
  },
  {
    title: "Priority",
    dataIndex: "flag",
    slots: {
      customRender: "flag",
    },
  },
  ]
  state.timeLogView = data.data.map(item => {
    item.timeAmount = secondsToTime(item.timeAmount)
    return item
  })
 
    
}
export const reportExport = (state, data) => {
  state.reportExport = data
}
export const editAuditTimeLogApproval = async (state, data) => {
  data.flag = data.flagId
  data.timeAmount = secondsToTime(data.time)
  state.editAuditTimeLogApproval = data
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

