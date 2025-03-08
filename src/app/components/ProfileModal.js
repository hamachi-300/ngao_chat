'use client';
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ProfileModal({ session }) {
    const [modal, setModal] = useState(false);

    if (!session) return null;

    const toggleModal = () => {
        setModal(!modal);
    }

    return (
        <>
            <img 
                src={session.user.image} // Fallback to a placeholder if no profile image
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                referrerPolicy="no-referrer"
                onClick={() => toggleModal()}
            />
            
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800/70 bg-opacity-60">
                    <div onClick={toggleModal} className="overlay absolute inset-0 cursor-pointer"></div>
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md space-y-4">
                        <div className="flex items-center space-x-4">
                            <img 
                                className="w-16 h-16 rounded-full"
                                src={session.user.image} // Fallback to a placeholder if no profile image
                                alt="Profile"
                                referrerPolicy="no-referrer"
                            />
                            <div className="text-lg font-semibold">
                                <p className="text-sm text-black">{session.user.name}</p>
                                <p className="text-sm text-gray-500">@{session.user.id}</p>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <button
                                onClick={toggleModal}
                                className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
