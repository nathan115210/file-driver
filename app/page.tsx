"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

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

  const createFile = useMutation(api.files.createFile);

  const allFiles = useQuery(api.files.getAllFiles, orgId ? { orgId } : "skip");

  return (
    <main>
      <Button
        onClick={() => {
          if (orgId) {
            createFile({ name: "hello-file", orgId });
          }
        }}
      >
        Create file
      </Button>

      {allFiles?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}
