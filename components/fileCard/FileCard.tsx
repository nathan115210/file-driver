import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import FileCardActions from "@/components/fileCard/FileCardActions";
import { FileTypes } from "@/convex/schema";
import {
  BarChartBig,
  FileAudio,
  FileImage,
  FileTextIcon,
  FileVideo2,
} from "lucide-react";
import React, { ReactNode } from "react";
import FilePreview from "@/components/fileCard/FilePreview";

const FileCard = ({
  file,
}: {
  file: Doc<"files"> & { fileUrl: string | null };
}) => {
  const fileTypeIconMaps = {
    [FileTypes.IMAGE]: <FileImage />,
    [FileTypes.AUDIO]: <FileAudio />,
    [FileTypes.VIDEO]: <FileVideo2 />,
    [FileTypes.DOCUMENT]: <FileTextIcon />,
    [FileTypes.SPREADSHEET]: <BarChartBig />,
  } as Record<Doc<"files">["type"], ReactNode>;

  return (
    <Card>
      <CardHeader className={"items-center justify-between"}>
        {/*File icon*/}
        {fileTypeIconMaps[file.type]}
        {/*File actions: delete, rename, etc*/}
        <div className={""}>
          <FileCardActions fileId={file._id} />
        </div>
      </CardHeader>
      <CardContent>
        {/*File name*/}
        <CardTitle className={"truncate"}>{file.name}</CardTitle>
        {/*TODO: add the preview of the files*/}
      </CardContent>
      <CardContent>
        <FilePreview file={file} />
      </CardContent>
      <CardFooter className={"flex justify-center"}>
        {file.fileUrl && (
          <Button onClick={() => file.fileUrl && window.open(file.fileUrl)}>
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FileCard;
