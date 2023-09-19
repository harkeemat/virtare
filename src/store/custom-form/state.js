export default {
  fieldList:null,
  saveForm:null,
  customForms:null,
  viewTemplate:null,
  responseTemplate:null,
  errorMsg:null,
  getTemplateDetails:null,
  getTemplateQuestionSection:null,
  getStepsForms:null,
  columns :[
    {
      title: "Name",
      dataIndex: "formName",
      sorter: {
        compare: (a, b) => a.formName - b.formName,
        multiple: 3,
      },
    },
    {
      title: "Type",
      dataIndex: "formType",
      sorter: {
        compare: (a, b) => a.formType - b.formType,
        multiple: 3,
      },
    },
    {
      title: "Date/Time",
      dataIndex: "dateTime",
      sorter: {
        compare: (a, b) => a.dateTime - b.dateTime,
        multiple: 2,
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      slots: {
        customRender: "action",
      },
    },
  ],
  assignedForm:null
}