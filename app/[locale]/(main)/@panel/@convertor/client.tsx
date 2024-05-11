"use client";

import { FileUp, Search, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { AbstractIntlMessages, IntlProvider, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { timeZone } from "@/i18n/timezone";
import { cn } from "@/lib/utils";
import { Params } from "@/params";
import { useAppStore } from "@/stores/app";
import { useFileStore } from "@/stores/files";
import { getFileExtenstion } from "@/utils";

interface Props {
  messages: AbstractIntlMessages;
}

export default function Client({ messages }: Props) {
  const { locale } = useParams<Params>();

  return (
    <IntlProvider messages={messages} locale={locale} timeZone={timeZone}>
      <FilePanelBase />
    </IntlProvider>
  );
}

function FilePanelBase() {
  const t = useTranslations();

  const files = useFileStore((state) => state.files);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => files.filter((file) => file.name.startsWith(search)),
    [files, search]
  );

  const removeFile = useFileStore((state) => state.removeFile);
  const progress = useAppStore((state) => state.progress);

  return (
    <section className="top-0 flex flex-1 flex-col gap-4 md:sticky">
      {!!files.length && (
        <div className="flex flex-1 flex-col gap-2">
          <Input
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search.placeholder")}
            startAdornment={<Search className="size-4" />}
          />

          {!!filtered.length && (
            <div className="flex-1 flex-col">
              {filtered.map(({ id, name }) => (
                <div key={id} className="flex items-center">
                  <p className="flex-1">{name}</p>
                  <Button
                    disabled={!!progress}
                    variant="ghost"
                    size="icon"
                    title={t("Item.remove")}
                  >
                    <Trash className="size-5" onClick={() => removeFile(id)} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!filtered.length && (
            <div className="flex-1 items-center justify-center">
              <p>{t("List.empty")}</p>
            </div>
          )}
        </div>
      )}

      <Upload className={cn(!files.length && "flex-1")} />
    </section>
  );
}

function Upload({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations();

  const [drag, setDrag] = useState(false);

  const addFile = useFileStore((state) => state.addFile);
  const files = useFileStore((state) => state.files);

  return (
    <Dropzone
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDrop={() => setDrag(false)}
      onFileDialogOpen={() => setDrag(true)}
      onFileDialogCancel={() => setDrag(false)}
      onDropAccepted={async (accepted) => {
        const extensions: Set<string> = new Set();

        for (const file of files) {
          extensions.add(file.type);
        }

        for (const file of accepted) {
          extensions.add(await getFileExtenstion(file));
        }

        if (extensions.size > 1)
          return toast.error(t("Processing.multiple_ext"));

        const exts = Array.from(extensions);

        for (let i = 0; i < accepted.length; i++) {
          const file = accepted[i];
          // Эту часть можно улучшить, если сделать из этого разные независимые стримы
          // В иделае, еще нужно нарисовать состояние загрузки
          const buffer = await file.arrayBuffer();
          addFile({ name: file.name, buffer, type: exts[0] });
        }
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...props}
          {...getRootProps()}
          className={cn(
            "flex cursor-default flex-col items-center justify-center rounded-md border border-dashed border-gray-500 py-6 transition-colors duration-300",
            !drag && "hover:bg-[rgba(107,114,128,0.2)]",
            drag && "bg-[rgba(116,193,237,0.17)]",
            className
          )}
        >
          <input {...getInputProps()} />

          <FileUp className="size-10" />
          <h3 className="mt-2 text-xl font-bold">{t("Upload.title")}</h3>
          <p className="mt-1 text-sm">{t("Upload.or")}</p>
          <Button className="mt-3" size="medium">
            {t("Upload.button")}
          </Button>
        </div>
      )}
    </Dropzone>
  );
}
