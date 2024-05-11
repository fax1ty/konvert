import fileTypeFromBuffer from "magic-bytes.js";

export function isSSR() {
  return typeof window === "undefined";
}

export const makePairs = <T>(array: T[]) => {
  const direct = array.flatMap((v, i) => array.slice(i + 1).map((w) => [v, w]));
  const reversed = array.flatMap((v, i) =>
    array.slice(i + 1).map((w) => [w, v])
  );
  return [...direct, ...reversed];
};

function getExtFromName(name: string) {
  const result = /(?:\.([^.]+))?$/.exec(name);
  if (!result) return "";
  return result[1];
}

export async function getFileExtenstion(file: File) {
  let type: string;
  const magic = await file.slice(0, 16).arrayBuffer();
  const [result] = fileTypeFromBuffer(new Uint8Array(magic));
  if (result?.extension) type = result.extension;
  else type = getExtFromName(file.name);
  return type;
}
