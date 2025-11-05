import { Socket } from "node:net";

const STATUS_MESSAGES: Record<string, string> = {
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

export function sendResponse(
  socket: Socket,
  statusCode?: string,
  headers?: Record<string, string>,
  data?: any,
) {
  const defaultHeaders = {
    "Content-Length": "0",
    Connection: "close",
    "Content-Type": "text/plain",
  };
  if (statusCode !== undefined) {
    socket.write(`HTTP/1.1 ${statusCode} ${STATUS_MESSAGES[statusCode]}\r\n`);
  }

  const finalHeader = { ...defaultHeaders, ...headers };
  if (headers !== undefined) {
    for (const [key, value] of Object.entries(finalHeader)) {
      socket.write(`${key}: ${value}\r\n`);
    }
  }

  if (data !== undefined) {
  }
}
