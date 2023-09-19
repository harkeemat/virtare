export default () => ({
  billingList: [],
  billingMeta:null,
  processBillingList:[],
  processBillingMeta:null,
  billingLoading: false,
  billing: {
    isLoading: false,
    error: {},
  },
  billingDetail:null,
  billingFilterDate:{
    fromDate:'',
    toDate:''
  },
  getDate:'',
  billingResponse:null
});
