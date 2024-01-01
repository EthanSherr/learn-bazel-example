import fs from "fs";
import { createChannel, createClient } from "nice-grpc";
import cliProgress from "cli-progress";
import {
  FileServiceClient,
  FileServiceDefinition,
} from "@esherr/file-server-protos";

const channel = createChannel("localhost:8090");

const client: FileServiceClient = createClient(FileServiceDefinition, channel);

const main = async () => {
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  let writeStream: fs.WriteStream | undefined;
  for await (const { response } of client.getFile({ name: "sample.mp4" })) {
    switch (response?.$case) {
      case "metadata":
        bar.start(response.metadata.fileSize, 0);
        writeStream = fs.createWriteStream(
          `./projects/file-server/out-${response.metadata.filename}`
        );
        break;
      case "chunk":
        bar.increment(response.chunk.chunkData.length);
        writeStream?.write(response.chunk.chunkData);
        break;
    }
  }
  bar.stop();
  writeStream?.end();
};

main();
