import { 
    createApp
} from 'vue'
import App from './App.vue'
import axios from 'axios'; // For the calling APIs method
import Antd from 'ant-design-vue' // UI theme
import 'ant-design-vue/dist/antd.css' // UI theme css
import { notification } from "ant-design-vue"; 
import '@/assets/scss/common.scss' // Custom css file
import router from './router/index' // For the url routing
import i18n from './locales/i18n' // For the Localization 
import store from './store' // Access Vuex store data
import VueApexCharts from "vue3-apexcharts"; // For the patient vitals graph
import Maska from 'maska' // For phone number masking 
// import VueSpeedometer from 'vue-speedometer'; // Gauge graph used for the escalation
import CKEditor from '@ckeditor/ckeditor5-vue'; // Editor used for the comment section 
import ErrorMessage from "@/components/common/messages/ErrorMessage"
const app = createApp(App)
// Firebase for push notifications
import firebaseApp from '@/services/notifications/fireBaseNotification.js';
import { message } from 'ant-design-vue';

// import '@/services/sendBirdChat/services/trackActivity.js'


// video call config
// if (store.state.authentication.loggedInUser) {
//     store.getters.videoCall;
// }

/* Check the internet connectivity */

if(navigator.onLine == false){
    message.error('Check your internet connection!!',5);
}
window.addEventListener('offline', function(e) {
    message.error('Check your internet connection!!',5);
});
window.addEventListener('online', function(e) {
  message.success('Back to Online!');
});


/* set default auth token */
const token = JSON.parse(localStorage.getItem('auth'))?.token
if (token) {
    axios.defaults.headers.common.Authorization = token
}

// Testing browser suport this feature or not
(window.RTCPeerConnection) ? console.log('supported') : console.log('not supported')

/* Notification check if blocked on browser side */
if (Notification.permission === 'denied') {
    notification.open({
        message: 'Notification blocked!!',
        description: 'Please enable notification for website.',
        duration: 30,
        placement: 'bottomRight'
    }) 
}

// Initialization of the libraries
app.use(Antd)
// .component('VueSpeedometer', VueSpeedometer)
.component('ErrorMessage', ErrorMessage)
.use(Maska)
.use(firebaseApp)
.use(VueApexCharts)
.use(store)
.use(router)
.use(i18n)
.use( CKEditor )
.mount('#app')
