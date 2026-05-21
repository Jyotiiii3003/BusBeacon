import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initFirebase } from "./services/firebase.js";
import { registerSockets } from "./sockets/index.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true }
});

registerSockets(io);
initFirebase();

connectDB()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`BusBeacon API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
