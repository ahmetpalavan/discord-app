import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import "@uploadthing/react/styles.css";

type Props = {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
};

const FileUpload = (props: Props) => {
  const fileType = props.value?.split(".").pop();

  if (props.value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill alt="file" src={props.value} className="rounded-full" />
        <button
          onClick={() => {
            props.onChange("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (props.value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-8 w-8 mr-2 fill-indigo-20 stroke-indigo-400" />
        <a
          href={props.value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm dark:text-indigo-400 text-indigo-500 hover:underline"
        >
          {props.value}
        </a>
        <button
          onClick={() => {
            props.onChange("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      onClientUploadComplete={(url) => {
        props.onChange(url?.[0].url);
      }}
      onUploadError={(err) => {
        console.log(err);
      }}
      endpoint={props.endpoint}
    />
  );
};

export default FileUpload;
