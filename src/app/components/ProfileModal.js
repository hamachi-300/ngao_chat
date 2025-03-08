'use client';
import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { MdOutlineEdit } from "react-icons/md";

export default function ProfileModal({ session }) {
    const [modal, setModal] = useState(false);
    const [textColor, setTextColor] = useState('text-gray-500')
    const [username, setUsername] = useState(session.user.username);
    const [currentInput, setCurrentInput] = useState(session.user.username);
    const ref = useRef(null);

    if (!session) return null;

    const toggleModal = () => {
        setModal(!modal);
    }

    const handleSignOut = (e) => {
        e.stopPropagation(); // Prevents closing the modal when clicking the sign out button
        signOut(); // Perform the sign out action
    }

    const handleEnter = (e) => {

        if (e.key === 'Enter') {
            let name = e.target.value;

            if (name.length > 10) {
                setTextColor('text-red-400');
            } else {
                setUsername(name);
            }
        } else {
            setTextColor('text-gray-500');
        }
    }

    return (
        <>
            <img
                src={session.user.image} // Fallback to a placeholder if no profile image
                alt="Profile"
                className="w-11 h-11 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                referrerPolicy="no-referrer"
                onClick={() => toggleModal()}
            />

            {modal && (
                <div onClick={() => {toggleModal(); setCurrentInput(username)}} className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800/70 bg-opacity-60">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md space-y-4"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-16 h-16 rounded-full"
                                src={session.user.image} // Fallback to a placeholder if no profile image
                                alt="Profile"
                                referrerPolicy="no-referrer"
                            />
                            <div className="text-lg font-semibold">
                                {
                                    username ?
                                        <div className="flex justify-stretch">
                                            <p className="text-sm text-black">{username}</p>
                                            <div onClick={() => { setCurrentInput(username); setUsername(null); }} className="text-gray-600 cursor-pointer"><MdOutlineEdit /></div>
                                        </div>
                                        :
                                        <div className="flex">
                                            <input value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyDown={handleEnter} ref={ref} className={`text-sm ${textColor} w-40 focus:outline-none duration-150 transition-all`} placeholder="บอกชื่อของคุณกับเรา..." />
                                            <div onClick={() => { if (ref.current) ref.current.focus(); }} className="text-gray-600 cursor-text"><MdOutlineEdit /></div>
                                        </div>
                                }

                                <p className="text-sm text-gray-500">@{session.user.id}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleSignOut}
                                className="mt-4 py-2 px-6 bg-red-500 duration-250 transition-all cursor-pointer text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
