import { getLinesChannel } from "./lineChannel.js";
import { createServer } from "node:net";
import { type Server } from "node:net";

const server: Server = createServer(async (s) => {
  console.log("client connected");

  for await (const line of getLinesChannel(s)) {
    console.log(line);
  }
  console.log("Connection Closed");
});
server.listen(42069, () => {
  console.log("server is listening");
});
//process.on("SIGINT", () => {
// server.close(() => {
//  console.log("Connection Closed");
// });
// process.exit(0);
//});
