import SendBirdCall, { SoundType } from 'sendbird-calls';
import DialingSound from "@/assets/media/Dialing.mp3";
import RingingSound from "@/assets/media/Ringing.mp3";

let directCall;
const app_id = import.meta.env.VUE_APP_SENDBIRD_APP_ID

 export function init() {
  if(app_id){
    SendBirdCall.init(app_id);
    registSendBirdEventHandler()
    // document.getElementById('btnInit').disabled = true;
  } else {
    alert('need APP ID');
  }
}

export function registSendBirdEventHandler(){
  let uniqueid = "unique-id";
  SendBirdCall.addListener(uniqueid, {
    onRinging: (call) => {
      SendBirdCall.addDirectCallSound(SoundType.RINGING, RingingSound)
      document.getElementById('btnDial').disabled = true;
      registCallEvent(call);
    }
  });
}

export function registCallEvent(call){
  directCall = call;

  call.onEstablished = (call) => {
    console.log("Call is Established", call);
  };

  call.onConnected = (call) => {
    console.log("Call is Connected", call);
  };

  call.onEnded = (call) => {
    console.log("Call Ended", call);
    document.getElementById('btnDial').disabled = false;
    document.getElementById('btnAccept').disabled = false;
  };
}

export function auth(value){
  let userId = value;
  if(userId){
    const authOption = { userId: userId, accessToken: "" };

    SendBirdCall.authenticate(authOption,(user,error)=>{
      if (error) {
        console.error(`SendBird Authenticate Error = ${error}`);
        return ;
      } else {
        console.log('authenticated', user);
        
        // request connect websocekt server
        SendBirdCall.connectWebSocket();
        document.getElementById('btnAuth').disabled = true;
      }
    });
  } else {
    alert('need user id');
  }
}

export async function callDial(value){
  const calleeId = value;
  if(calleeId){
    const dialParams = {
        userId: calleeId,
        isVideoCall: true,
        callOption: {
            localMediaView: document.getElementById('local_view'),
            remoteMediaView: document.getElementById('remote_view'),
            audioEnabled: true,
            videoEnabled: true
        }
    };

    try{
      const call = await SendBirdCall.dial(dialParams);
      SendBirdCall.addDirectCallSound(SoundType.DIALING, DialingSound)
      document.getElementById('btnDial').disabled = true;
      document.getElementById('btnAccept').disabled = true;
      registCallEvent(call);
    } catch(error){
      console.error(`dial fail error = ${error}`);
    }
    
  } else {
    alert('need target user id');
  }
}

export function callAccept(){
  const acceptParams = {
    callOption: {
      remoteMediaView: document.getElementById('remote_view'),
      localMediaView: document.getElementById('local_view'),
      audioEnabled: true,
      videoEnabled: true
    }
  };
  document.getElementById('btnAccept').disabled = true;
  directCall.accept(acceptParams);
}

export function callEnd() {
  if(directCall) directCall.end();
}