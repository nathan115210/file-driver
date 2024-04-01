import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2Icon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const FileCardActions = ({ fileId }: { fileId: Id<"files"> }) => {
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();
  return (
    <>
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId }).then(() => {
                  toast({
                    variant: "default",
                    title: "File deleted",
                    description: "The deleted file is now gone from the system",
                  });
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className={"flex gap-1 text-red-700 items-center cursor-pointer"}
            onClick={() => setOpenAlertDialog(true)}
          >
            <Trash2Icon className={"w-5 h-5"} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileCardActions;
