import { createServer } from "node:net";
import { type Server, Socket } from "node:net";
import { stream } from "./parser.js";
import { sendResponse } from "./responseGenerator.js";
import { errorHandler, requestHandler } from "./handler.js";

const PORT = 42069;

serve();
export function serve(p = PORT): Server {
  const sockets = new Set<Socket>();

  const server = createServer(async (socket) => {
    sockets.add(socket);
    console.log("client connected");

    socket.on("close", () => sockets.delete(socket));
    socket.on("error", (err) => console.error("socket error:", err));

    try {
      const request = await stream(socket);
      const response = requestHandler(request);

      sendResponse(socket, response);
    } catch (e) {
      if (e instanceof Error) {
        let response = errorHandler(e.message);
        sendResponse(socket, response);
      }
    }

    socket.end();
  });

  server.on("error", (err) => {
    console.error("server error:", err);
  });

  server.listen(p, () => {
    console.log(`Server started on port ${p}`);
  });

  function closeGracefully() {
    console.log("\nShutting down...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    for (const s of sockets) s.end();
    setTimeout(() => {
      for (const s of sockets) s.destroy();
    }, 2000).unref();
  }

  process.once("SIGINT", closeGracefully);
  process.once("SIGTERM", closeGracefully);

  return server;
}

/*

const server: Server = createServer(async (s) => {
  console.log("client connected");
  const data = await stream(s);
  console.log(data);
  console.log("Connection Closed");
});
server.listen(42069, () => {
  console.log("server is listening");
});
*/
//process.on("SIGINT", () => {
// server.close(() => {
//  console.log("Connection Closed");
// });
// process.exit(0);
//});
