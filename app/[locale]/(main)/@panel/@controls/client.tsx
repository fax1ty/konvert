"use client";

import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { AbstractIntlMessages, IntlProvider, useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { timeZone } from "@/i18n/timezone";
import { cn } from "@/lib/utils";
import { Params } from "@/params";
import ffmpegProcessor from "@/processors/ffmpeg";
import { Convertion } from "@/processors/types";
import { useAppStore } from "@/stores/app";
import { useFileStore } from "@/stores/files";
import { makePairs } from "@/utils";

import ArrowRight from "./arrow-right.svg";
import Logo from "./logo.svg";

interface Props {
  messages: AbstractIntlMessages;
}

export default function Client({ messages }: Props) {
  const { locale } = useParams<Params>();

  return (
    <IntlProvider messages={messages} timeZone={timeZone} locale={locale}>
      <ClientBase />
    </IntlProvider>
  );
}

function ClientBase() {
  const t = useTranslations();

  const files = useFileStore((state) => state.files);
  const getFileBuffer = useFileStore((state) => state.getFileBuffer);
  const removeFile = useFileStore((state) => state.removeFile);

  const setProgress = useAppStore((state) => state.setProgress);
  const task = useAppStore((state) => state.task);
  const setTask = useAppStore((state) => state.setTask);

  const processors = useMemo<Convertion[]>(() => {
    const audioPairs = makePairs(["mp3", "wav", "aac", "flac", "ogg"]);
    const audioProcessors = audioPairs.map(([from, to]) => ({
      id: `${from}-${to}`,
      from,
      to,
      processor: ffmpegProcessor,
    }));

    const videoPairs = makePairs([
      "webm",
      "mp4",
      "3gp",
      "3g2",
      "avi",
      "flv",
      "hls",
      "m4v",
      "m4a",
      "mkv",
      "mov",
      "ogv",
    ]);
    const videoProcessors = videoPairs.map(([from, to]) => ({
      id: `${from}-${to}`,
      from,
      to,
      processor: ffmpegProcessor,
    }));

    const imagePairs = makePairs(["png", "jpg", "bmp", "tiff", "ico", "webp"]);
    const imageProcessors = imagePairs.map(([from, to]) => ({
      id: `${from}-${to}`,
      from,
      to,
      processor: ffmpegProcessor,
    }));

    const processors = [
      ...audioProcessors,
      ...videoProcessors,
      ...imageProcessors,
    ];
    return processors;
  }, []);

  const customCommands = useMemo<Record<string, string>>(
    () => ({
      "mp4-3gp":
        "-r 20 -vb 400k -acodec aac -strict experimental -ac 1 -ar 8000 -ab 24k",
    }),
    []
  );

  const filtered = useMemo(() => {
    const extensions = files.map((file) => file.type);
    if (!files.length) return processors;
    else return processors.filter(({ from }) => extensions.includes(from));
  }, [files, processors]);

  return (
    <section className="flex-1">
      <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 md:pb-8 xl:grid-cols-4">
        {filtered.map(({ id, from, to, processor }) => (
          <Button
            key={id}
            size="medium"
            disabled={!files.length || !!task}
            className={cn(
              "min-w-150 flex h-16 flex-1 select-none items-center justify-between",
              task === id && "animate-pulse"
            )}
            onClick={async () => {
              try {
                const t1 = performance.now();
                for (const file of files) {
                  const buffer = await getFileBuffer(file.id);
                  if (!buffer) return;
                  setTask(id);
                  const command = customCommands[id]?.split(" ") || [];
                  const output = await processor(
                    buffer,
                    from,
                    to,
                    command,
                    setProgress
                  );
                  saveAs(
                    new Blob([output]),
                    files[0].name.replace(/\.[^/.]+$/, "." + to)
                  );
                  removeFile(file.id);
                  setTask(null);
                }
                const t2 = performance.now();
                toast.success(
                  <div className="flex flex-col gap-1">
                    {t.rich("success", {
                      time: ((t2 - t1) / 1000).toFixed(1),
                      p: (text) => <p>{text}</p>,
                      love: (text) => (
                        <p className="inline-flex items-center gap-1.5 font-bold">
                          {text}
                        </p>
                      ),
                      logo: () => (
                        <span>
                          <Logo className="size-5" />
                        </span>
                      ),
                    })}
                  </div>
                );
              } catch (error) {
                console.error(error);
                toast.error(t("error"));
              } finally {
                setProgress(null);
                setTask(null);
              }
            }}
          >
            <p className="rounded-sm bg-black px-1 py-0.5 text-xs text-white">
              {from}
            </p>
            <ArrowRight className="size-6" />
            <p className="rounded-sm bg-black px-1 py-0.5 text-xs text-white">
              {to}
            </p>
          </Button>
        ))}
      </div>
    </section>
  );
}
