import { authenticateSocket } from "../middleware/auth.js";
import { savePushToken, sendNotification } from "./handlers/notification.js";
import {
  getOnlineUsers,
  getOnlineProviders,
  setOnlineProviders,
  setOnlineUsers,
} from "./onlineUsers.js";
import { Expo } from "expo-server-sdk";
const expo = new Expo();

const connectedSockets = new Set();

export const setupSocketEvents = (io) => {
  io.on("connection", (socket) => {
    socket.on("authenticate", async (token) => {
      try {
        const user = await authenticateSocket(token);
        socket.user = user;
        console.log(
          "User authenticated :: ID: ",
          socket.user.id,
          " Role : ",
          socket.user.role
        );
        socket.join(socket.user.id);

        // Also join a room based on role for role-specific broadcasts
        if (socket.user.role) {
          socket.join(socket.user.role);
        }

        // Update online users list only with authenticated sockets
        if (socket.user.role === "user") {
          const onlineUsers = Array.from(io.of("/").sockets.values())
            .filter((s) => s.user && s.user.id && s.user.role === "user")
            .map((s) => ({
              userId: s.user.id,
              socketId: s.id,
            }));
          setOnlineUsers(onlineUsers);
          console.log("Online Users: ", getOnlineUsers());
        }

        // Update online providers list only with authenticated sockets
        if (socket.user.role === "provider") {
          const onlineProviders = Array.from(io.of("/").sockets.values())
            .filter((s) => s.user && s.user.id && s.user.role === "provider")
            .map((s) => ({
              providerId: s.user.id,
              socketId: s.id,
            }));
          setOnlineProviders(onlineProviders);
          console.log("Online Providers: ", getOnlineProviders());
        }

        // Notify others that this user is online
        if (socket.user.role === "user") {
          io.to("provider").emit("user_status_update", {
            userId: socket.user.id,
            status: "online",
          });
        } else if (socket.user.role === "provider") {
          io.to("user").emit("provider_status_update", {
            providerId: socket.user.id,
            status: "online",
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        socket.emit("auth_error", { message: "Authentication failed" });
      }
    });

    socket.on("private_message", (message) => {
      io.to(message.receiverId).emit("private_message", message);
    });

    socket.on("new_chat", (newUser) => {
      io.emit("new_chat", newUser);
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        console.log(
          "A user disconnected:",
          socket.user.id,
          socket.user.role,
          socket.id
        );

        // Notify others that this user is offline
        if (socket.user.role === "user") {
          // Update online users list
          const onlineUsers = Array.from(io.of("/").sockets.values())
            .filter((s) => s.user && s.user.id && s.user.role === "user")
            .map((s) => ({
              userId: s.user.id,
              socketId: s.id,
            }));
          setOnlineUsers(onlineUsers);

          io.to("provider").emit("user_status_update", {
            userId: socket.user.id,
            status: "offline",
          });
        } else if (socket.user.role === "provider") {
          // Update online providers list
          const onlineProviders = Array.from(io.of("/").sockets.values())
            .filter((s) => s.user && s.user.id && s.user.role === "provider")
            .map((s) => ({
              providerId: s.user.id,
              socketId: s.id,
            }));
          setOnlineProviders(onlineProviders);

          io.to("user").emit("provider_status_update", {
            providerId: socket.user.id,
            status: "offline",
          });
        }
      } else {
        console.log("An unauthenticated socket disconnected:", socket.id);
      }
    });

    socket.on("savePushToken", (token) => {
      if (socket.user) {
        savePushToken(socket.user.id, token);
      } else {
        console.warn("Attempt to save push token without authentication");
      }
    });

    // Set up the sendNotification event emitter
    socket.emit("sendNotification", (data) => {
      if (socket.user) {
        sendNotification(data);
      } else {
        console.warn("Attempt to send notification without authentication");
      }
    });
  });
};
