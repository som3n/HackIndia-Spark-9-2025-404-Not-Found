import SignOutButton from "@/components/SignOutButton"
import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image"
import Link from "next/link"

export default async function LandingLayout({ children, }: { children: React.ReactNode }) {
    const isUserAuthenticated = await isAuthenticated();

    return (
        <div className="root-layout">
            <nav className="flex w-full justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
                    <h2 className="text-primary-100 text-xl">PrepView</h2>
                </Link>
                <div className="flex space-x-4 items-center">

                    {!isUserAuthenticated ? (
                        <Link href="/sign-in" className="bg-green-800 hover:bg-green-600 transition-colors ease-in-out duration-500 px-4 py-2 rounded-lg">Sign-In</Link>
                    ) : (
                        <div className="flex space-x-4 items-center">
                            <Link href="/" className="text-gray-400 hover:text-blue-500 transition-colors ease-in-out duration-400">Home</Link>
                            <Link href="/prep-by-peer" className="text-gray-400 hover:text-blue-500 transition-colors ease-in-out duration-400">Peer_Interviews</Link>
                            <SignOutButton />
                        </div>

                    )}
                </div>
            </nav>
            {children}
        </div>
    )
}