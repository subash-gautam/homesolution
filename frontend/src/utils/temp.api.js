//* Copy code of this file and paste to  /frontend/src/utils/api.js editing IP address to your own.

import { io } from "socket.io-client";

const socket = io("http://192.168.10.87:3000", {
	transports: ["websocket"],
	reconnection: true,
});

const backend = {
	backendUrl: "http://192.168.10.87:3000",
};

export default backend;
export { socket };
