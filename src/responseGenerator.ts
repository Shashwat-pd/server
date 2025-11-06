import { Socket } from "node:net";

export const STATUS_MESSAGES: Record<string, string> = {
  "200": "OK",
  "201": "Created",
  "204": "No Content",
  "301": "Moved Permanently",
  "302": "Found",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Internal Server Error",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
};
export type Response = {
  code: string;
  headers?: Record<string, string>;
  body?: string;
};

export function sendResponse(socket: Socket, response: Response) {
  console.log("Here");
  const defaultHeaders = {
    Connection: "close",
    "Content-Type": "text/plain",
  };
  if (response.code !== undefined) {
    socket.write(
      `HTTP/1.1 ${response.code} ${STATUS_MESSAGES[response.code]}\r\n`,
    );
  }

  const finalHeader = { ...defaultHeaders, ...response.headers };
  if (response.headers !== undefined) {
    for (const [key, value] of Object.entries(finalHeader)) {
      socket.write(`${key}: ${value}\r\n`);
    }
  }
  socket.write(`\r\n`);
  if (response.body) {
    socket.write(`${response.body}`);
  }
}
