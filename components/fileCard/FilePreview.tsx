import { Doc } from "@/convex/_generated/dataModel";
import { FileTypes } from "@/convex/schema";

import Image from "next/image";

const FilePreview = ({
  file,
}: {
  file: Doc<"files"> & { fileUrl: string | null };
}) => {
  if (!file.fileUrl) return null;
  console.log("file.url", file.fileUrl);
  if (file.type === FileTypes.IMAGE) {
    return (
      <Image
        alt={file.name}
        width="200"
        height="200"
        src={file.fileUrl}
        loading="lazy"
      />
    );
  }
  return null;
};

export default FilePreview;
