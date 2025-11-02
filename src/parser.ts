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
  const methods = ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH"];
  let requestLine: string = "";
  for await (const line of getLinesChannel(s)) {
    requestLine = line;
    break;
  }

  console.log(requestLine)
  //couldBeBetter????????
  let reqArray = requestLine.split(" ");
  const method = reqArray[0];
  const path = reqArray[1];
  const version = reqArray[2];

  if (!methods.includes(method)) {
  }

  return { method, path, version } as RequestLine;
}
