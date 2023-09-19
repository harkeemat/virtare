import SendbirdChat from "@sendbird/chat";
import { OpenChannelModule } from "@sendbird/chat/openChannel";


const sb = SendbirdChat.init({
  appId: 'A5CE6BFF-04C7-4214-9155-EDCE6F231C54',
  modules: [new OpenChannelModule()],
});



try {
    const params = new OpenChannelParams()
    const channel = await sb.openChannel.createChannel(params);
  
    // An open channel is successfully created.
    // Channel data is return from a successful call to createChannel

  } catch (err) {
    // Handle error.
  }

  export default {sb, OpenChannelModule}
