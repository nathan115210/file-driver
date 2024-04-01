"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UploadButton from "@/components/UploadButton";
import { useEffect, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import FileCard from "@/components/fileCard/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const organization = useOrganization();
  const user = useUser();
  useEffect(() => {
    if (organization.isLoaded && user.isLoaded) {
      // if it's the personal account, use user's Id for orgId
      setOrgId(organization.organization?.id ?? user.user?.id);
    }
  }, [organization, user]);

  const allFiles = useQuery(api.files.getAllFiles, orgId ? { orgId } : "skip");

  if (!allFiles) {
    return (
      <main className={"container mx-auto pt-12 "}>
        <div
          className={
            "flex flex-col gap-4 w-full items-center mt-12 text-gray-500"
          }
        >
          <Loader2 className={"h-32 w-32 animate-spin"} />
          <div className={"text-2xl"}>Loading...</div>
        </div>
      </main>
    );
  }
  if (allFiles.length === 0) {
    return (
      <main className={"container mx-auto pt-12 "}>
        <div className={"flex flex-col gap-4 w-full items-center mt-12"}>
          <Image
            className={"m-auto"}
            src={"/emptyData.svg"}
            alt={"empty data"}
            width={"500"}
            height={"500"}
          />
          <p className="text-pink-600 text-xl font-bold">
            You have no files, go ahead ans upload one now!
          </p>
          <UploadButton orgId={orgId} />
        </div>
      </main>
    );
  }

  return (
    <main className={"container mx-auto pt-12 "}>
      <div className={"flex flex-wrap justify-between items-center mb-8"}>
        <h1 className={"text-4xl font-bold"}>Your files</h1>
        <UploadButton orgId={orgId} />
      </div>
      <div className={"grid grid-cols-4 gap-4"}>
        {allFiles.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
