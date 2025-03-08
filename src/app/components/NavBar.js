"use client";
import { useState } from "react"; // เพิ่มบรรทัดนี้
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [ showProfile, setShowProfile ] = useState(false);

    if (pathname === "/login") {
        return null;
    }

    return (
        status === "authenticated" &&
        session?.user && (

            <nav className="bg-indigo-500 text-white px-8 py-4 flex items-center justify-center shadow-lg h-16 fixed top-0 left-0 w-full z-50">
                
                <button 
                    className="transition-all duration-250 text-3xl text-white hover:scale-110 hover:text-yellow-300 hover:drop-shadow-lg focus:outline-none"
                >
                    <IoIosNotifications />
                </button>

                {/* Centered Logo Text */}
                <div className="text-4xl font-bold tracking-wide flex-1 justify-center text-center">
                    <span className="text-2xl text-gray-200">Ngao Ngao</span> {/* Only the text */}
                </div>

                {/* Profile Image with Dropdown Shadow at the top right */}
                <div className="absolute right-8">
                    <ProfileModal session={session} />
                </div>
            </nav>

            
        )
    )
}
