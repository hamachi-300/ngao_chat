'use client';
import React, { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";

export default function NotifyModal({ session }) {
    if (!session) return null;

    const [modal, setModal] = useState(false);
    // const [users, setUsers] = useState([]);
    // const [posts, setPosts] = useState([]);
    // const [comments, setComments] = useState([]);
    const toggleModal = () => {
        setModal(!modal);
    }

    // // fetch users posts comments
    // useEffect(()=>{
        
    // }, []);

    return (
        <>
            <div className="transition-all duration-250 text-3xl text-white hover:scale-110 hover:text-yellow-300 hover:drop-shadow-lg focus:outline-none cursor-pointer" onClick={() => {toggleModal()}}>
                <IoIosNotifications />
            </div>

            {modal && (
                <div onClick={() => toggleModal()} className=" fixed inset-0 flex items-center justify-center z-50 bg-gray-800/70 bg-opacity-60">
                    <div
                        // stop another bubbling up event
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-xl shadow-2xl w-96 max-w-md bg-[#535C91]"
                    >
                        <div className="bg-[#1B1A55] rounded-t-lg p-5 text-2xl">
                            Notifications
                        </div>
                        <div className="bg-[#535C91] rounded-lg p-5 h-[300px] overflow-y-auto">
                            <div className="pb-5">
                                <div className="text-2xl text-left">
                                    Post Content
                                </div>
                                <div className="text-lg text-left m-2">
                                    Comment
                                </div>
                                <div className="h-2 w-20/20 bg-[white] rounded-full"></div>
                            </div>
                        </div>
                        <div className="bg-[#E43F5A] rounded-b-lg p-3 text-xl cursor-pointer">
                            clear
                        </div>
                    </div>  
                </div>
            )}
        </>
    );
}
