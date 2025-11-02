import { getLinesChannel } from "./lineChannel.js";
import { Socket } from "node:net";
export type RequestLine = {
  method: string;
  path: string;
  version: string;
};
export type Request = {
  RequestLine: RequestLine;
  Headers: Record<string, string>;
  Body?: Uint8Array;
};

export async function getRequestLine(s: Socket) {
  const methods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "HEAD",
    "PATCH",
    "OPTIONS",
    "TRACE",
    "CONNECT",
  ];

  let requestLine: string = "";
  for await (const line of getLinesChannel(s)) {
    if (line === "") {
      continue;
    }
    requestLine = line;
    break;
  }

  console.log(requestLine);
  //couldBeBetter????????
  let reqArray = requestLine.split(" ");
  if (reqArray.length > 3) {
    throw new Error(`Invalid Request Line`);
  }
  const method = reqArray[0];
  const path = reqArray[1];
  const version = reqArray[2];
  const regex = /^\/[^\s#]*$/;

  if (!methods.includes(method)) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
  if (version != "HTTP/1.1") {
    throw new Error(`Invalid HTTP Version`);
  }
  if (!path.match(regex)) {
    throw new Error(`invalid path`);
  }

  return { method, path, version } as RequestLine;
}
