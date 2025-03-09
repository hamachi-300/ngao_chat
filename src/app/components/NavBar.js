"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { IoIosNotifications } from "react-icons/io";
import { useRouter } from "next/navigation";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();

    if (pathname === "/login") {
        return null;
    }

    return (
        status === "authenticated" &&
        session?.user && (

            <nav className="bg-indigo-500 fixed text-white px-8 py-4 flex items-center justify-center shadow-lg h-16 top-0 left-0 w-full z-50">
                
                <button 
                    className="transition-all duration-250 text-3xl text-white hover:scale-110 hover:text-yellow-300 hover:drop-shadow-lg focus:outline-none"
                >
                    <IoIosNotifications />
                </button>

                {/* Centered Logo Text */}
                <button className="text-4xl font-bold tracking-wide flex-1 justify-center text-center cursor-pointer" onClick={() => router.push("/home")}>
                    <span className="text-2xl text-gray-200">Ngao Ngao</span> {/* Only the text */}
                </button>

                {/* Profile Image with Dropdown Shadow at the top right */}
                <div className="absolute right-8">
                    <ProfileModal session={session} />
                </div>
            </nav>

            
        )
    )
}
