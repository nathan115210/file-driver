"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UploadButton from "@/components/UploadButton";
import { useEffect, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import FileCard from "@/components/fileCard/FileCard";

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

  return (
    <main className={"container mx-auto pt-12 pb-12 max-h-full"}>
      <div className={"flex flex-wrap justify-between items-center mb-8"}>
        <h1 className={"text-4xl font-bold"}>Your files</h1>
        <UploadButton orgId={orgId} />
      </div>
      <div className={"grid grid-cols-4 gap-4"}>
        {allFiles?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
