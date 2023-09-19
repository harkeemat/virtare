import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { h } from "vue";
import store from "@/store";
import { notification, Button } from "ant-design-vue";
import router from "@/router/index";
/* Old account details*/
// const firebaseConfig = {
//   apiKey: "AIzaSyARXttm2zCcHO6spiUj1v61HAZqWc9E9oU",
//   authDomain: "rpmdemoapp-16785.firebaseapp.com",
//   projectId: "rpmdemoapp-16785",
//   storageBucket: "rpmdemoapp-16785.appspot.com",
//   messagingSenderId: "849086876464",
//   appId: "1:849086876464:web:c83c77d045851fef4556f5",
//   measurementId: "G-XJW2B0HXTL",
// };
/* New account details */
const firebaseConfig = {
  apiKey: "AIzaSyBJunbfERod6WqnJmRUNskUEOJMJjBYeXo",
  authDomain: "tethr-by-virtarehealth.firebaseapp.com",
  projectId: "tethr-by-virtarehealth",
  storageBucket: "tethr-by-virtarehealth.appspot.com",
  messagingSenderId: "200930113390",
  appId: "1:200930113390:web:ba0465142d04467143f37f",
  measurementId: "G-J3TXRBD5ZS"
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging();
getToken(messaging, {
  vapidKey:"BCrrFiLxfwPasRwdfyBmyN12Av53bfqNel7HHMy_co-ewtUWZkPM0XvyAPZfqkPwbIsDCvMQnaDvxmJcBIO0adU",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      localStorage.setItem("fireBaseToken", currentToken);
    } else {
      // Show permission request UI
    }
  })
  .catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
let notificationCouter = null;
let multiUserCounter = null;
let notificationAudio = new Audio(import("@/assets/media/Notification.mp3"));
onMessage(messaging, (payload) => {
  store.dispatch("notificationList");
  const key = `open${Date.now()}`;
  let isChatOpened = localStorage.getItem("isChatOpened");
  // Sendbird notification setup
  if(payload.data.type == "sendBird"){
    // store.commit('msgUnreadCount',payload?.data)
    store.dispatch('getMsgUnreadCount',payload?.data?.patientId)
    if(!isChatOpened && payload.data.type == "sendBird"){
      notificationAudio.play()
      notification.open({
        message: (` ${payload?.notification?.title}`),
        description:`${payload?.notification?.body} `,
        btn: [
          h(
            Button,
            {
              onClick: () => {
                notification.close(key);
              },
            },
            "Cancel "
          ),
          h(
            Button,
            {
              type: "primary",
              onClick: () => {
                if(payload.data.type == "sendBird"){
                  router.push({
                    name: 'PatientDetails', 
                    params: { udid: payload?.data?.patientId }
                  })
                  notification.close(key);
                }
                notificationCouter = 0;
              },
              
            },
            "View"
          ),
        ],
        key,
        onClose: () => {
          notification.close(key);
        },
        duration: null,
        placement: "bottomRight",
      });
    }
  }
  if (!isChatOpened && payload.data.type != "Escalation") {
    notificationCouter++;
    let counter = notificationCouter;
    if (counter == 1) {
    notificationAudio.play();

      localStorage.setItem("notificationsId", payload.data.typeId);
      notification.open({
        message: (`${payload?.notification?.title}`),
        description: `${payload?.notification?.body}`,
        btn: [
          h(
            Button,
            {
              onClick: () => {
                notification.close(key);
              },
            },
            "Cancel "
          ),
          h(
            Button,
            {
              type: "primary",
              onClick: () => {
                if (payload.data.type == "Appointment") {
                  router.push("/notifications"), notification.close(key);
                }if(payload.data.type == "sendBird"){
                  router.push({
                    name: 'PatientDetails', 
                    params: { udid: payload?.data?.patientId }
                  })
                  notification.close(key);
                } else {
                  router.push({
                    name: "Communications",
                    query: {
                      view: "list",
                    },
                    params: {
                      from: "push",
                      typeId: payload.data.typeId,
                    },
                  }),
                    notification.close(key);
                }
                notificationCouter = 0;
              },
            },
            "View"
          ),
        ],
        key,
        onClose: () => {
          notification.close(key);
        },
        duration: null,
        placement: "bottomRight",
      });
    } else {
      notification.destroy(key);
      //checking if multiple user send the msg
      if (
        (localStorage.getItem("notificationsId") != payload.data.typeId &&
          payload.data.type != "Escalation") ||
        (multiUserCounter && payload.data.type != "Escalation")
      ) {
      notificationAudio.play();

        multiUserCounter++; // flag counter for multiple user checking
        notification.open({
          message: (`${payload?.notification?.title}`),
          description: (`${payload?.notification?.body}`),
          btn: [
            h(
              Button,
              {
                onClick: () => {
                  notification.close(key);
                },
              },
              "Cancel "
            ),
            h(
              Button,
              {
                type: "primary",
                onClick: () => {
                  if (payload.data.type == "Appointment") {
                    router.push("/notifications"), notification.close(key);
                  }if(payload.data.type == "sendBird"){
                    router.push({
                      name: 'PatientDetails', 
                      params: { udid: payload?.data?.patientId }
                    })
                    notification.close(key);
                  }else{
                    router.push("/communications?view=list"),
                      notification.close(key);
                  }
                  notificationCouter = 0;
                  multiUserCounter = 0;
                },
              },
              "View"
            ),
          ],
          key,
          onClose: () => {
            notification.close(key);
          },
          duration: null,
          placement: "bottomRight",
        });
        //checking if single user send the mutiple time msg
      } else if (!multiUserCounter) {
      notificationAudio.play();

        notification.open({
          message: (`${payload?.notification?.title}`),
          description: `${payload?.notification?.body}`,
          btn: [
            h(
              Button,
              {
                onClick: () => {
                  notification.close(key);
                },
              },
              "Cancel "
            ),
            h(
              Button,
              {
                type: "primary",
                onClick: () => {
                  if (payload.data.type == "Appointment") {
                    router.push("/notifications"), notification.close(key);
                  }if(payload.data.type == "sendBird"){
                    router.push({
                      name: 'PatientDetails', 
                      params: { udid: payload?.data?.patientId }
                    })
                    notification.close(key);
                  } else {
                    router.push({
                      name: "Communications",
                      query: {
                        view: "list",
                      },
                      params: {
                        from: "push",
                        typeId: payload.data.typeId,
                      },
                    }),
                      notification.close(key);
                  }
                  notificationCouter = 0;
                },
              },
              "View"
            ),
          ],
          key,
          onClose: () => {
            notification.close(key);
          },
          duration: null,
          placement: "bottomRight",
        });
      }
    }
  }
  if (payload.data.type === "Escalation") {
  notificationAudio.play();

    notification.open({
      message: (`${payload?.notification?.title}`
      ),
      description: `${payload?.notification?.body}`,
      btn: [
        h(
          Button,
          {
            onClick: () => {
              notification.close(key);
            },
          },
          "Cancel "
        ),
        h(
          Button,
          {
            type: "primary",
            onClick: () => {
              localStorage.setItem("visibleEscalationModal", true);
              store.commit("visibleEscalationModal", true);
              notification.close(key);
            },
          },
          "View"
        ),
      ],
      key,
      onClose: () => {
        notification.close(key);
      },
      duration: null,
      placement: "bottomRight",
    });
  }
});

// //end firebase

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }


export default firebaseApp;