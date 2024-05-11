import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

import { type Processor } from "./types";

const ffmpegProcessor: Processor = async (
  buffer,
  from,
  to,
  cmd,
  onProgress
) => {
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    ),
  });
  ffmpeg.on("log", console.log);
  ffmpeg.on("progress", ({ progress }) => {
    if (onProgress) onProgress(progress);
  });
  const command = ["-i", `input.${from}`, ...cmd, `output.${to}`];
  console.log("Исполняю команду ffmpeg", command.join(" "));
  await ffmpeg.writeFile(`input.${from}`, new Uint8Array(buffer));
  await ffmpeg.exec(command);
  const file = await ffmpeg.readFile(`output.${to}`);
  ffmpeg.terminate();
  return file;
};

export default ffmpegProcessor;
