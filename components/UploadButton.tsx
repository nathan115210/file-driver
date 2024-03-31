import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title can not be empty." })
    .max(200, { message: "Title must be less than 200 characters." }),
  file:
    typeof window === "undefined"
      ? z.custom<FileList>(
          (file) => file instanceof FileList,
          "File is required.",
        )
      : z
          .instanceof(FileList)
          .refine((file) => file?.length == 1, "File is required."),
});

interface UploadButtonProps {
  orgId: string | undefined;
}

const UploadButton: FC<UploadButtonProps> = ({ orgId }) => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });
  const fileRef = form.register("file");
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast();

  const fileOnSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!orgId) return;
    //Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": data.file[0].type },
      body: data.file[0],
    });
    const { storageId: fileId } = await result.json();
    // Save the newly allocated storage id to the database
    try {
      await createFile({ name: data.title, fileId, orgId }).then(() => {
        form.reset();
        setIsFileDialogOpen(false);
        toast({
          variant: "success",
          title: "File uploaded",
        });
      });
      form.reset();
      setIsFileDialogOpen(false);
      toast({
        variant: "success",
        title: "File uploaded",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with uploading file",
      });
      setIsFileDialogOpen(false);
    }
  };

  const createFile = useMutation(api.files.createFile);

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isFileDialogOpen) => {
        setIsFileDialogOpen(isFileDialogOpen);
        /* reset the form after dialog is close*/
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        {/*//TODO: hide "upload button" while not log in*/}
        <Button onClick={() => {}}>Upload file</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"mb-8"}>Upload a file</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(fileOnSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Title</FormLabel>
                      <FormControl>
                        <Input placeholder="File title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type={"file"} placeholder="File" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className={"flex gap-1"}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
