"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileText, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: ({
    content,
    fileUrl,
    type,
  }: {
    content: string;
    fileUrl: string;
    type: string;
  }) => void;
  content: string;
  fileUrl: string;
  endpoint: "messageFile" | "serverImage";
  type: string;
}

const FileUpload = ({
  onChange,
  content,
  fileUrl,
  type,
  endpoint,
}: FileUploadProps) => {
  if (fileUrl && type !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={fileUrl} alt="Upload" className="rounded-full" />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          onClick={() => {
            onChange({ content: "", fileUrl: "", type: "" });
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (fileUrl && type === "pdf") {
    return (
      <div className="relative h-16 w-16 rounded-full">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <FileText className="h-full w-full hover:text-indigo-300" />
        </a>
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          onClick={() => {
            onChange({ content: "", fileUrl: "", type: "" });
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="text-white bg-white"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("uploaded successfully:", res);
        onChange({
          content: res?.[0].name,
          fileUrl: res?.[0].url,
          type: res?.[0].type.split("/")[1],
        });
      }}
      onUploadError={(error: Error) => {
        console.log("uploadthing error", error);
      }}
    />
  );
};

export default FileUpload;
