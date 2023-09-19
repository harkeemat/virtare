export default {
  loggedInUser: JSON.parse(localStorage.getItem('auth')),
  expiresIn:JSON.parse(localStorage.getItem('expiresIn')),
  loggedInUserDetails: null,
  logout: null,
  token:null,
  refreshToken: null,
  errorMsg: null,
  options:null,
  server:`wss://${import.meta.env.VITE_APP_SIP_DOMAIN}:7443`,
  simpleUser:null,//localStorage.getItem("simpleUser"),
  accessPermission:JSON.parse(localStorage.getItem('accessPermission')),
  visibleEscalationModal:false,
  accessPermissions:null,
  

}