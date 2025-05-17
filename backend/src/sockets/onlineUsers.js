let onlineProviders = [];
let onlineUsers = [];

export const getOnlineUsers = () => onlineUsers;
export const getOnlineProviders = () => onlineProviders;

export const setOnlineUsers = (users) => {
	onlineUsers = users;
	console.log("Current onlineUsers:", onlineUsers);
};

export const setOnlineProviders = (providers) => {
	onlineProviders = providers;
	console.log("Current onlineProviders:", onlineProviders);
};
