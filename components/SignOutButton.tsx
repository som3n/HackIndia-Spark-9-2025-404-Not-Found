"use client"; // This makes the component a Client Component

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <Button 
      onClick={handleSignOut}
      className="bg-stone-500 text-white py-2 px-4 rounded-lg hover:bg-stone-600 cursor-pointer transition duration-300"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton; 