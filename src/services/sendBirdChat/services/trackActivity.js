import store from '@/store/index'
// convert second to time format(hms) example 00:02:00
export function toTime(seconds) {
  if (seconds < 0) return "-" + toTime(-seconds);
  return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
  // convert hms to second example 120
  export function hmsToSecondsOnly(str) {
    var p = str?.split(':'),
        s = 0, m = 1;
    while (p?.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
  }
  
  // Convert mili seconds to seconds 
  export function formatTime(ms) {
    return Math.floor(ms / 60);
  }

  export const pauseTimer = (timerStatus,timer) => {
    if (timerStatus != "paused") {
      clearInterval(timer);
      store.commit("timerStatus", "paused");
    }
  };

 export const stopTimer = (saveTimer,timer,totalTime) => {
    clearInterval(timer);
    store.commit("timerStatus", "stopped");
    if (saveTimer) {
      // store.commit("timerValue", totalTime);
      console.log("stopTimer",  totalTime);
    }
  };


 

