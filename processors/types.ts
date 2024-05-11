type FileData = Uint8Array | string;

export type Processor = (
  buffer: ArrayBuffer,
  from: string,
  to: string,
  cmd: string[],
  onProgress?: (v: number) => void
) => Promise<FileData>;

export interface Convertion {
  id: string;
  from: string;
  to: string;
  processor: Processor;
}
