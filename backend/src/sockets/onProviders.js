let onlineProviders = [];

export const getOnlineProviders = () => onlineProviders;

export const setOnlineProviders = (providers) => {
	onlineProviders = providers;
	console.log("Current onlineProviders:", onlineProviders);
};
