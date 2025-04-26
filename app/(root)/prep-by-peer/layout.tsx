import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/landing");

  return (
    <div className="">
      <section className="flex flex-col items-center justify-between space-y-5">
        <h2>Train Where Others Did. Perform Where It Matters.</h2>
        <p className="text-center w-3/5">Attempt interviews built by your peers, tested by real candidates. Step into their shoes and sharpen your skills where it counts.</p>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[12px]">Or you can make your own</span>
          <Link href="/interview" className="px-4 py-2 rounded-full bg-blue-400 hover:bg-blue-600 transition-colors ease-in-out duration-600">Create your own interview!</Link>
        </div>
      </section>
      {children}
    </div>
  );
};

export default Layout;
