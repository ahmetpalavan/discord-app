import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
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
            props.onChange(undefined);
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
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
