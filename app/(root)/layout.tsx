import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import SignOutButton from "@/components/SignOutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/landing");

  return (
    <>
      <nav className="fixed flex w-full flex-start p-4 h-[10vh] border-b-1 bg-stone-900 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100 text-xl">PrepView</h2>
        </Link>
      </nav>
      <div className="flex pt-[10vh] ">
        <div className="fixed w-1/5 border-r-1 h-[90vh] flex flex-col justify-between bg-stone-900">
          <div className="flex flex-col space-y-4">
            <Link href="/" className=" px-8 pt-2 ">Home</Link>
            <Link href="/interview" className=" px-8 pt-2 ">Interview AI</Link>
            <Link href="/cover" className=" px-8 pt-2 ">Cover AI</Link>
            {/* <Link href="/resume" className=" px-8 pt-2 ">Resume AI</Link>
            <Link href="/" className=" px-8 pt-2 ">Auto Apply AI</Link> */}
            <Link href="/prep-by-peer" className=" px-8 pt-2 ">View Peers</Link>
          </div>
          <div className="p-4 w-full flex flex-col item-center border-t-2">
            <SignOutButton />
          </div>
        </div>
        <div className="w-[100vw] pl-[22vw] p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
