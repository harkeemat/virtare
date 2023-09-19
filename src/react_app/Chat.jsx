import React,{ useState, useEffect,useRef }  from 'react';

// import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import withSendbird from "@sendbird/uikit-react/withSendbird";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import Channel from '@sendbird/uikit-react/Channel';
import SendbirdChat from '@sendbird/chat';
import {
    GroupChannelModule,
    GroupChannelFilter,
    GroupChannelListOrder
} from '@sendbird/chat/groupChannel';
// import ChannelHeader from '@sendbird/uikit-react/Channel/components/ChannelHeader';

// Custom theme color 
const myColorSet = {
    '--sendbird-light-primary-500': '#00487c',
    '--sendbird-light-primary-400': '#3083F0',
    '--sendbird-light-primary-300': '#3083F0', 
    '--sendbird-light-primary-200': '#0496ff',
    '--sendbird-light-primary-100': '#fff',
}

let sb;
const Chat = (props) => {
    const sdk = sendbirdSelectors.getSdk(props);
    const currentUser = sdk && sdk.currentUser;
    if (currentUser) {
        const getTotalUnreadMessageCount = async () => {
            const unreadMessageCount = await sdk.groupChannel.getTotalUnreadMessageCount();
            props.setUnreadMessageCount(unreadMessageCount);
        }
        getTotalUnreadMessageCount();
        props.setSbUserInfo(currentUser);
    }
    // Used for the typing indicators
    const[typingUser,setTypingUser] = useState("")
    const [state, updateState,] = useState({
        channels: [],
        isUsersStatus: null,
        currentlyJoinedChannel:null,
        loading: false,
        error: false
    });
    //need to access state in message received callback
    const stateRef = useRef();
    stateRef.current = state;
    const channelHandlers = {
        onChannelsUpdated: (context, channels) => {
            props.setUnreadMessageCount(channels[0]?.unreadMessageCount);
            props.setSbUserInfo(props.config?.MEM_NICKNAME);
            if (props.config?.CHANNEL_URL === channels[0]?.url) {
                let isStatus = channels[0]?.members?.find((item)=>{
                    return item.userId == props.config?.MEM_USERID
                   })
                loadChannels(channels[0]) // checking user online status
                let typing = channels[0]?.getTypingUsers()[0]?.nickname || channels[0]?.getTypingUsers()[0]?.userId
                setTypingUser(typeof typing != "undefined" ? typing : '') // check the user typing indicator
                setTimeout(()=>{
                    typing = undefined
                    setTypingUser(typeof typing != "undefined" ? typing : '') 
                },10000) // Typing indicator undifined after 10 sec
                updateState({ ...state,...stateRef.current, currentlyJoinedChannel: channels[0]?.url, isUsersStatus:isStatus?.connectionStatus });
            }
        },
    }

// Helpful functions that call Sendbird
const loadChannels = async (channelHandlers) => {
    const groupChannelFilter = new GroupChannelFilter();
    groupChannelFilter.includeEmpty = true;
    const collection = sb.groupChannel.createGroupChannelCollection({
        filter: groupChannelFilter,
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
    });
    collection.setGroupChannelCollectionHandler(channelHandlers);
    const channels = await collection.loadMore();
    return [channels, null];
}

// initialisation of the sendbird  
    const initSendbird = async () => {
        const sendbirdChat = await SendbirdChat.init({
            appId: props.config?.APP_ID,
            localCacheEnabled: true,
            modules: [new GroupChannelModule()]
        }); 
        await sendbirdChat.connect(props.config?.USER_ID);
        await sendbirdChat.setChannelInvitationPreference(true);
        sb = sendbirdChat;

        const [channels, error] = await loadChannels(channelHandlers);
        if (error) {
            return onError(error);
        }
        let isStatus = channels?.members?.find((item)=>{
            return item.userId == props.config?.MEM_USERID
           })
        updateState({ ...state, channels: channels, loading: false, settingUpUser: false,isUsersStatus:isStatus?.connectionStatus  });
    }


    useEffect(() => {
        initSendbird();
    },[]);

    const onError = (error) => {
        updateState({ ...state, error: error.message });
        console.log(error);
    }
    // end typing block
    return (
        <SendbirdProvider appId={props.config?.APP_ID} userId={props.config?.USER_ID} colorSet={myColorSet}
        //  config={{ logLevel: 'info' }} 
        isMessageReceiptStatusEnabledOnChannelList = {true}
         >
            <div style={{ height: '550px' }}>
                <Channel channelUrl={props.config?.CHANNEL_URL} replyType={'QUOTE_REPLY'} 
                    isMessageReceiptStatusEnabled = {true}
                    renderTypingIndicator = {
                        ()=> typingUser != "" ? (<div className='typing-indicator'>{typingUser} is typing...</div>):null
                    }
                    renderChannelHeader = {
                        ()=>{ return (
                            <div className='patient-message-detail'>
                                <div className='detail-img'>
                                    <img src={props.config?.PROFILE_URL} alt="profile-image" />
                                </div>
                                <div className='detail-info'>
                                    <h3 className='common-sub-heading ant-typography'>{props.config?.MEM_NICKNAME}</h3>
                                    <p>{state?.isUsersStatus}</p>
                                </div>
                            </div>
                        )}
                    }
                >
                </Channel> 
            </div>
        </SendbirdProvider>
    );
}

const ChatWithSendbird = withSendbird(Chat)
export default ChatWithSendbird;