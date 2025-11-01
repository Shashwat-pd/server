import { readFile, open, FileHandle } from "fs/promises";
import { AsyncQueue } from "./asyncQueue.js";

function getLinesChannel(file: FileHandle): AsyncIterable<string> {
  const q = new AsyncQueue<string>();
  (async () => {
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
              q.push(lines[index]);
            }
            s = lines[lines.length - 1];
          }
        }
        offset += bytesRead;
      } while (bytesRead > 0);
    } finally {
      await file.close();
      q.close();
    }
  })().catch(async () => {
    q.close();
    await file.close();
  });
  return q;
}

const file = await open(
  "/Users/shashwatpoudel/Documents/pro-idea/server/src/message.txt",
  "r",
);

for await (const line of getLinesChannel(file)) {
  console.log(`read: ${line}`);
}
