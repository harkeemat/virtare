// import { Web } from '@/assets/js/sip-0.20.0'
import { Web } from 'sip.js'
import router from '@/router/index'
import { successSwal } from "@/commonMethods/commonMethod";
import { h } from 'vue'
import { notification, Button } from "ant-design-vue";

const sipDomain = import.meta.env.VITE_APP_SIP_DOMAIN
const key = `open${Date.now()}`;
let date = new Date();
let callAudio = new Audio(import("@/assets/media/skype-23266.mp3"))
export const loginSuccess = async (state, data) => {
  state.token = data.user;
  state.loggedInUser=JSON.parse(localStorage.getItem('auth')),
  state.expiresIn= data?date.setSeconds(date.getSeconds() + ((data.expiresIn/100)-10)):localStorage.getItem('expiresIn')
  state.loginErrorMsg = null;
  let callNotification = 0
  let counter = null
state.options= Web.SimpleUserOptions = {
    aor:`sip:${state.loggedInUser.user.sipId}@${sipDomain}`,
    media: {
      constraints: {
        // This demo is making "video only" calls
        audio: true,
        video: true
      },
    },
    delegate: {
        onCallReceived: async () => {
        callNotification=1
        localStorage.setItem('videoCallCounter',++counter)
        //Play video call ring tone
        callAudio.play();
        callAudio.loop = true
        if (typeof callAudio.loop == 'boolean'){
            callAudio.loop = true;
        }else{
            callAudio.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
        }//end play
        notification.open({
          message: `Call from...`,
          description:`${simpleUser.session.incomingInviteRequest.message.from._displayName} `,
          btn: [
              h(Button,{
                  onClick: () => { 
                    callNotification=0,
                    simpleUser.hangup(),
                    notification.close(key)
                    callAudio.pause()
                  },
                },
                "Cancel "
              ),
              h(Button,{
                  type: "primary",
                  onClick: () =>  {
                  callNotification=0,state.simpleUser = simpleUser,
                  router.push('/video-call'),notification.close(key)
                  callAudio.pause()
                }
                },
                "Accept"
              ),
             
            ],
            key,
          onClose: ()=>{callNotification=0,simpleUser.hangup(),notification.close(key)},
         duration:null,
         placement:'bottomRight'
          
        }) 
        },
        onCallHangup: async () => {
          if(callNotification==1){
              notification.close(key)
              callAudio.pause()
              // This notification used for the missed call popup
              let showCounter = localStorage.getItem('videoCallCounter')
              notification.open({
                  message: `Video Call `,
                  description: `Missed Call (${showCounter})`,
                  btn: [
                      h(Button, {
                          onClick: () => 
                          {
                             callNotification=0,
                             simpleUser.hangup(),
                             notification.close(key)
                             
                          },
                      },
                          "Cancel "
                      ),
                      h(Button, {
                          type: "primary",
                          onClick: () => {
                              callNotification=0
                              router.push('/communications?view=list'), notification.close(key)
                              counter = 0
                              localStorage.removeItem('videoCallCounter')
                          }
                      },
                          "View"
                      ),

                  ],
                  key,
                  onClose: () => { callNotification=0, simpleUser.hangup(), notification.close(key) },
                  duration: null,
                  placement: 'bottomRight'

              }) // end popup
          }else{
            callAudio.pause()
            successSwal('Call Ended! Thank You')
            router.push('/dashboard')
          }
          }
      },
    userAgentOptions: {
      // logLevel: "debug",
      displayName:state.loggedInUser.user.sipId,
      authorizationPassword:"123456",
      authorizationUsername:state.loggedInUser.user.sipId,
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionOptions: {
          rtcConfiguration : {
              iceServers: [{
                urls: "stun:stun.xten.com"
              }, {
                urls: "turn:numb.viagenie.ca",
                username: "mailto:webrtc@live.com",
                credential: "muazkh"
              }]
            },
        },
      },
    }
  };


   // Construct a SimpleUser instance
   const simpleUser = new Web.SimpleUser(state.server, state.options);
   // Connect to server and place call
   simpleUser.connect()
     .then(() => {
         simpleUser.register();
     })
     .catch((error) => {
         console.log(error);
     });
 // }



}


export const logoutSuccess = async (state) => {
  const simpleUser = new Web.SimpleUser(state.server, state.options);
  state.logout = null;
  state.token = null;
  state.errorMsg = null;
  state.accessPermission=null
  simpleUser.disconnect()
	state.options = null
	state.loggedInUser = null
	state.simpleUser=null
	state.acceptVideoCallDetails=null
}

export const refreshTokenSuccess = async (state, token) => {
  state.refreshToken = token;
  state.loginErrorMsg = null;
}

export const loginFailure = (state, error) => {
  state.errorMsg = error;
}


export const accessPermission = (state, data) => {
  state.accessPermission = data;
}


export const expiresIn = (state, data) => {
  state.expiresIn = data;
}



export const visibleEscalationModal = (state, data) => {
  state.visibleEscalationModal = data;
}

export const errorMsg = (state, error) => {
  state.errorMsg = error?.message;
}

export const accessPermissions = (state, data) => {
  state.accessPermissions = data;
}
