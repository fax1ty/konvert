"use client";

import { del as delItem, get as getItem, set as setItem } from "idb-keyval";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreateFile {
  name: string;
  buffer: ArrayBuffer;
  type: string;
}

interface KonvertFile {
  id: string;
  name: string;
  type: string;
}

interface FileStore {
  files: KonvertFile[];
  addFile: (file: CreateFile) => void;
  removeFile: (id: KonvertFile["id"]) => void;
  getFileBuffer: (id: KonvertFile["id"]) => Promise<ArrayBuffer | null>;
}

export const useFileStore = create(
  persist<FileStore>(
    (set, get) => ({
      files: [],
      addFile: async (file) => {
        const files = [...get().files];
        const id = nanoid();
        files.push({
          name: file.name,
          id,
          type: file.type,
        });
        await setItem(`konvert-file-${id}`, file.buffer);
        set({ files });
      },
      removeFile: async (id) => {
        const files = [...get().files];
        const idx = files.findIndex((file) => file.id === id);
        files.splice(idx, 1);
        await delItem(`konvert-file-${id}`);
        set({ files });
      },
      getFileBuffer: async (id) => {
        const file = (await getItem<ArrayBuffer>(`konvert-file-${id}`)) || null;
        return file;
      },
    }),
    {
      name: "konvert-store",
      version: 2,
    }
  )
);
