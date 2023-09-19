import {
  dateOnlyFormat,
  secondsToTime,
  // dateOnlyFormatSImple,
  // timeFormatSimple
} from '../../commonMethods/commonMethod';
export const addTimeLogSuccess = async (state, timeLog) => {
  state.addTimeLog = timeLog;
}

export const timeLogsListSuccess = async (state, timeLogs) => {
  state.timeLogsList = timeLogs.map(timelog => {
    timelog.date = dateOnlyFormat(timelog.date);
    timelog.timeAmount = secondsToTime(timelog.timeAmount);
    return timelog;
  })
}

export const deleteTimeLogSuccess = async (state, deleteTimeLog) => {
  state.deleteTimeLog = deleteTimeLog;
}

export const timeLogDetailsSuccess = async (state, timeLogDetails) => {
  // timeLogDetails.date = dateOnlyFormatSImple(timeLogDetails.date);
  // timeLogDetails.timeAmount = timeFormatSimple(timeLogDetails.timeAmount);
  state.timeLogDetails = timeLogDetails;
}

export const updateTimeLogSuccess = async (state, updateTimeLog) => {
  state.updateTimeLog = updateTimeLog;
}

export const updatePatientTimeLog = async (state, updateTimeLog) => {
  state.updatePatientTimeLog = updateTimeLog;
}

export const latestTimeLogSuccess = async (state, latestTimeLog) => {
  if(latestTimeLog && latestTimeLog.length > 0) {
    latestTimeLog[0].date = dateOnlyFormat(latestTimeLog[0].date);
    state.latestTimeLog = latestTimeLog;
  }
  else {
    state.latestTimeLog = null
  }
}