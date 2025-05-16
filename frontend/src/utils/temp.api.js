//* Copy code of this file and paste to  /frontend/src/utils/api.js editing IP address to your own.

const backendUrl = "http://192.168.10.87:3000";

import { io } from "socket.io-client";

const socket = io(`${backendUrl}`, {
	transports: ["websocket"],
	reconnection: true,
});

const backend = {
	backendUrl,
};

export default backend;
export { socket };
