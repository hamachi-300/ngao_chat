"use client";
import { useState } from "react"; // เพิ่มบรรทัดนี้
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiMenu } from "react-icons/fi";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    if (pathname === "/login") {
        return null;
    }

    return (
        status === "authenticated" &&
        session?.user && (
            <nav className="bg-indigo-500 text-white px-8 py-4 flex items-center justify-center shadow-lg h-16 fixed top-0 left-0 w-full z-50">
                {/* Centered Logo Text */}
                <div className="text-4xl font-bold tracking-wide flex-1 justify-center text-center">
                    <span className="text-2xl text-gray-200">Ngao Ngao</span> {/* Only the text */}
                </div>

                {/* Profile Image with Dropdown Shadow at the top right */}
                <div className="absolute right-8 top-3">
                    <img 
                        src={session.user.image} // Fallback to a placeholder if no profile image
                        alt="Profile"
                        className="w-10 h-10 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-shadow"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </nav>
        )
    )
}
