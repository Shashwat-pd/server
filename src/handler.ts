import { Request } from "./parser.js";

export function requestHandler(request: Request) {
  let responseBody: string | Uint8Array = "This is a response";

  return responseBody;
}
