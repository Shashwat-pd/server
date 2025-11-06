import { sendResponse } from "./responseGenerator.js";
import { errorHandler } from "./handler.js";
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
export type RequestHeader = Record<string, string>;
export type RequestBody = Uint8Array;

export async function stream(s: Socket) {
  const lines = getLinesChannel(s);
  const requestLine = await getRequestLine(lines.headers);
  const requestHeader = await getRequestHeader(lines.headers);
  const contentLength = requestHeader["content-length"] ?? 0;
  const body = await getRequestBody(lines.body, contentLength);
  console.log(Buffer.from(body).toString("utf-8"));

  return {
    RequestLine: requestLine,
    Headers: requestHeader,
    Body: body,
  } as Request;
}
export async function getRequestLine(q: AsyncIterable<string>) {
  //union types maybee?
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

  for await (const line of q) {
    if (line === "") {
      continue;
    }
    requestLine = line;
    break;
  }

  //couldBeBetter????????
  let reqArray = requestLine.split(" ");
  if (reqArray.length > 3) {
    errorHandler("500");
    return;
  }
  const method = reqArray[0];
  const path = reqArray[1];
  const version = reqArray[2];
  const regex = /^\/[^\s#]*$/;

  if (!methods.includes(method)) {
    throw new Error(`400`);
  }
  if (version != "HTTP/1.1") {
    throw new Error(`400`);
  }
  if (!path.match(regex)) {
    throw new Error(`400`);
  }

  return { method, path, version } as RequestLine;
}

async function getRequestHeader(q: AsyncIterable<string>) {
  let requestHeader: RequestHeader = {};
  for await (const line of q) {
    if (line === "") {
      break;
    }
    let [k, v] = parseRequestKeyValue(line);
    if (requestHeader[k] === undefined) {
      requestHeader[k] = v;
    } else {
      requestHeader[k] = `${requestHeader[k]}, ${v}`;
    }
  }
  return requestHeader as RequestHeader;
}

function parseRequestKeyValue(line: string) {
  const trimmed = line.trim();
  const index = trimmed.indexOf(":");

  if (index === -1) {
    throw new Error(`400`);
  }

  const key = trimmed.slice(0, index).trim().toLowerCase();
  const value = trimmed.slice(index + 1).trim();

  return [key, value];
}

async function getRequestBody(
  b: AsyncIterable<Buffer>,
  len: string,
): Promise<Uint8Array> {
  let length = parseInt(len);
  let body = Buffer.alloc(length);
  let offset = 0;
  try {
    for await (const bytes of b) {
      let remaining = length - offset;
      if (remaining <= 0) break;
      let bytesToWrite = Math.min(bytes.length, remaining);
      bytes.copy(body, offset, 0, bytesToWrite);
      offset += bytesToWrite;

      if (offset === length) break;
    }
    if (offset !== length) {
      throw new Error(`400`);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("400");
  }
  return body.slice(0, length);
}
