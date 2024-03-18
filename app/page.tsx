"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const createFile = useMutation(api.files.createFile);

  const allFiles = useQuery(api.files.getAllFiles);
  console.log("allFiles", allFiles);
  return (
    <main>
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode={"modal"}>
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>

      <Button onClick={() => createFile({ name: "hello-file" })}>Click</Button>

      {allFiles?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}
