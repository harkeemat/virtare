

export const permissions = (state, auth) => {
	state.screensPermissions = auth?.actionId;
	state.widgetsPermissions = auth?.widgetId;
};

