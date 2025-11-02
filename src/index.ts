import { getLinesChannel } from "./lineChannel.js";
import { createServer } from "node:net";
import { type Server } from "node:net";
import { type RequestLine, getRequestLine } from "./parser.js";

const server: Server = createServer(async (s) => {
  console.log("client connected");
  const requestLine: RequestLine = await getRequestLine(s);
  console.log(requestLine)

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
