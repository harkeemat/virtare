// import * as SIP from '@/assets/js/sip-0.20.0.js'
import { Web } from 'sip.js'
import { h } from 'vue'
import router from '@/router/index'
import state from './state';
import { notification, Button } from "ant-design-vue";
import { successSwal } from '@/commonMethods/commonMethod';
const sipDomain = import.meta.env.VITE_APP_SIP_DOMAIN
let callAudio = new Audio(import("@/assets/media/skype-23266.mp3"))

export function videoCall() {
    let callNotification =0
    let counter = null
    const key = `open${Date.now()}`;
    state.options = Web.SimpleUserOptions = {
        aor: `sip:${state.loggedInUser.user.sipId}@${sipDomain}`,
        media: {
            constraints: {
                audio: true,
                video: true
            },
        },
        delegate: {
            onCallReceived: async () => {
                callNotification=1
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
                localStorage.setItem('videoCallCounter',++counter)
                notification.open({
                    message: `Call from...`,
                    description: `${simpleUser.session.incomingInviteRequest.message.from._displayName}`,
                    btn: [
                        h(Button, {
                            onClick: () => { 
                                callNotification=0, 
                                simpleUser.hangup(), 
                                notification.close(key),
                                callAudio.pause()
                            },
                        },
                            "Cancel "
                        ),
                        h(Button, {
                            type: "primary",
                            onClick: () => {
                                callNotification=0
                                state.simpleUser = simpleUser,
                                router.push('/video-call'), notification.close(key)
                                callAudio.pause()
                            },
                            
                        },
                            "Accept"
                        ),

                    ],
                    key,
                    onClose: () => { callNotification=0, simpleUser.hangup(), notification.close(key) },
                    duration: null,
                    placement: 'bottomRight'

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
                    description: `Missed Call (${showCounter}) `,
                    btn: [
                        h(Button, {
                            onClick: () => { callNotification=0, simpleUser.hangup(), notification.close(key) },
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
            displayName: state.loggedInUser.user.sipId,
            authorizationPassword: "123456",
            authorizationUsername: state.loggedInUser.user.sipId,
            sessionDescriptionHandlerFactoryOptions: {
                peerConnectionOptions: {
                    rtcConfiguration: {
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

