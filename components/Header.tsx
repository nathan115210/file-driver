"use client";
import {
  UserButton,
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import type { FC } from "react";
import { Button } from "@/components/ui/button";

const Header: FC = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className={"border-b bg-blue-100 py-4"}>
      <div className={"items-center container mx-auto justify-between flex"}>
        <div>FileDriver</div>
        <OrganizationSwitcher />
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignedOut>
            <SignInButton mode={"modal"}>
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        )}
      </div>
    </nav>
  );
};

export default Header;
