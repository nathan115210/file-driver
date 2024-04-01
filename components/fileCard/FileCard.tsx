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

const FileCard = ({ file }: { file: Doc<"files"> }) => {
  return (
    <Card>
      <CardHeader className={"relative"}>
        <CardTitle className={"truncate"}>{file.name}</CardTitle>
        <div className={"absolute top-1 right-1"}>
          <FileCardActions fileId={file._id} />
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
