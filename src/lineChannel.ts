import { AsyncQueue } from "./asyncQueue.js";
import { type Socket } from "node:net";
type LineAndBody {
  headers: AsyncIterable<string>;
  body: AsyncIterable<Buffer>;
}
export function getLinesChannel(socket: Socket): LineAndBody {
  const q = new AsyncQueue<string>();
  const b = new AsyncQueue<Buffer>();
  (async () => {
    let s = "";
    let buff = Buffer.alloc(10 * 1024 * 1024);
    let offset = 0;
    let headerEnd = false;
    try {
      for await (const chunk of socket) {
        if (headerEnd) {
          let free = buff.length - offset;
          if (chunk.length > free) {
            throw new Error("Body exceeds buffer capacity");
          }
          chunk.copy(buff, offset, 0, buff.length);
          offset += chunk.length;
          b.push(buff);
        }
        s += chunk.toString("utf-8");

        if (s.includes("\r\n")) {
          {
            let lines = s.split("\r\n");
            const endOfHeadersIndex = lines.indexOf("");
            if (endOfHeadersIndex != -1) {
              headerEnd = true;
              const leftover = chunk.slice(endOfHeadersIndex + 4);
              if (leftover.length) {
                if (offset + leftover.length > buff.length)
                  throw new Error("Body exceeds buffer capacity");
                leftover.copy(buff, offset);
                offset += leftover.length;
              }
            }
            for (let index = 0; index < lines.length - 1; index++) {
              q.push(lines[index]);
            }
            s = lines[lines.length - 1];
          }
        }
      }
    } finally {
      q.close();
      b.close();
    }
  })().catch(async () => {
    q.close();
    b.close();
  });
  return { headers: q, body: b };
}

/*
import { readFile, open } from "fs/promises";

async function getLinesChannel(path: string) {
  const file = await open(path, "r");
  const buffer = Buffer.alloc(8);

  let offset = 0;
  let bytesRead: number;

  let s = "";
  try {
    do {
      const data = await file.read(buffer, 0, 8, offset);
      bytesRead = data.bytesRead;
      const chunk = buffer.subarray(0, bytesRead);
      s += chunk.toString("utf-8");
      if (s.includes("\n")) {
        {
          let lines = s.split("\n");
          for (let index = 0; index < lines.length - 1; index++) {
            console.log(lines[index]);
          }
          s = lines[lines.length - 1];
        }
      }
      offset += bytesRead;
    } while (bytesRead > 0);
  } finally {
    await file.close();
    return;
  }
}*/
