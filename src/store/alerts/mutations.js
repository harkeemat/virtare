import {
  // timeStamp.
  dateFormatClient,
} from "@/commonMethods/commonMethod";

const mapAlert = (alerts) =>
  alerts.data.map((alert) => ({
    ...alert,
    createdAt: dateFormatClient(alert.createdAt),
  }));

export default {
  patientAlerts(state, alerts) {
    /** this map will be removed when new API is developed. */
    state.patientAlerts = mapAlert(alerts);
    state.patientMeta = alerts.meta;
  },
  patientAlertLoading(status, loading) {
    status.patientAlertLoading = loading;
  },
  alerts(state, alerts) {
    state.alerts = mapAlert(alerts);
    state.meta = alerts.meta;
  },
  alertLoading(state, status) {
    state.isalertsLoading = status;
  },
  type(state, type) {
    state.type = type.map((data) => ({ udid: data, name: data }));
  },
  people(state, data) {
    state.people = data.map(({ udid, name, email, type }) => ({
      value: udid,
      label: name,
      disabled: email == "",
      type,
    }));
  },
  actions(state, data) {
    state.actions = data.map((action) => ({ udid: action, name: action }));
  },
  isAction(state, action) {
    state.isAction = action;
  },
  histories(state, data) {
    state.histories = data.map(
      ({ actionStatus, createdName, createdAt, actionNote }) => ({
        actionStatus,
        createdName,
        actionNote,
        date: dateFormatClient(createdAt),
      })
    );
  },
  historyLoading(state, loading) {
    state.historyLoading = loading;
  },
  isCreating(state, loading) {
    state.isCreating = loading;
  },
  isCreated(state, result) {
    state.isCreated = result;
  },
  createError(state, error) {
    state.createError = error;
  },
  escalation(state, data) {
    state.escalation = data;
  },
  escLoading(state, loading) {
    state.isEscLoading = loading;
  },
  escaltionId(state, id) {
    state.escaltionId = id;
  },
  pdfLink(state, link) {
    state.pdfLink = link;
  },
  contacts(state, data) {
    state.contacts = data.map(({ udid, name, email }) => ({
      value: udid,
      label: name,
      disabled: email == "",
    }));
  },
  genratingAction(state, loading) {
    state.genratingAction = loading;
  },
  actionTaken(state, action) {
    state.actionTaken = action;
  },
  closeAlert(state, data) {
    state.closeAlert = data;
  },
  isIdCorrect(state, data) {
    state.isIdCorrect = data;
  },
  checkingRef(state,data)
  {
    state.checkingRef = data;
  },
  refError(state,data)
  {
     state.refError = data;
  },
  patientDot(state,data)
  {
    state.patientDot = data;
  },
  alertDot(state,data)
  {
    state.alertDot = data;
  },
  reff_id(state,id)
  {
    state.reff_id = id;
  }
};
