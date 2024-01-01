import fs from "fs";
import fsPromise from "fs/promises";
import {
  FileServiceDefinition,
  FileServiceImplementation,
} from "@esherr/file-server-protos";
import { createServer } from "nice-grpc";

console.log("working dir is", process.cwd());

const fileServerImpl: FileServiceImplementation = {
  getFile: async function* (req) {
    const filename = "sample.mp4";
    const filePath = `./projects/file-server/server-files/${filename}`;

    const { size } = await fsPromise.stat(filePath);

    yield {
      response: {
        $case: "metadata",
        metadata: { filename, mimeType: "video/mp4", fileSize: size },
      },
    };
    const highWaterMark = 1024;

    const readStream = fs.createReadStream(filePath, {
      highWaterMark,
    });

    for await (const buffer of readStream) {
      yield {
        response: {
          $case: "chunk",
          chunk: {
            chunkData: new Uint8Array(buffer),
          },
        },
      };
    }
  },
};

const main = async () => {
  const PORT = `8090`;
  const server = createServer();

  server.add(FileServiceDefinition, fileServerImpl);

  await server.listen(`0.0.0.0:${PORT}`);
  console.log("listening on port ", PORT);
};

main();
