import { Request } from "./parser.js";
import { Response } from "./responseGenerator.js";

export function requestHandler(request: Request) {
  let responseBody: string;

  responseBody = request.Body?.toString() ?? " ";
  responseBody = responseBody.toLowerCase();
  const contentLength = Buffer.byteLength(responseBody, "utf-8");
  const res: Response = {
    code: "200",
    headers: { "Content-Length": contentLength.toString() },
    body: responseBody,
  };

  return res;
}

export function errorHandler(message: string) {
  const res: Response = { code: message, headers: { "Content-Length": "0" } };

  return res;
}
