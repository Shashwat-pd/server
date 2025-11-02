import { AsyncQueue } from "./asyncQueue.js";
import { type Socket } from "node:net";

export function getLinesChannel(socket: Socket): AsyncIterable<string> {
  const q = new AsyncQueue<string>();
  (async () => {
    let s = "";
    try {
      for await (const chunk of socket) {
        s += chunk.toString("utf-8");
        if (s.includes("\r\n")) {
          {
            let lines = s.split("\r\n");
            for (let index = 0; index < lines.length - 1; index++) {
              q.push(lines[index]);
            }
            s = lines[lines.length - 1];
          }
        }
      }
    } finally {
      q.close();
    }
  })().catch(async () => {
    q.close();
  });
  return q;
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
