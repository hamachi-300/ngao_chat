"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import "./Modal.css";

export default function ProfileModal({user}) {
    const [modal, setModal] = useState(false);
    const router = useRouter();

    const toggleModal = () => {
        setModal(!modal);
    };

    const logout = () => {
        // remove cookies and go to login page
        router.push("/login")
    }

    // set icon for profile
    const profile = () => {
        if (user.profile_id === 1) {
            return "square"
        } else {
            return "circle"
        }
    }

    return (
        <>
        <button onClick={toggleModal}>
            Profile
        </button>

        {modal && (
            <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <div className="left-btn">
                        <button onClick={toggleModal}>close</button>
                    </div>
                    <h2>Profile</h2>
                    <div className={profile()}></div>
                    <h3>Email : {user.email}</h3>
                    <h3>User ID : {user.user_id}</h3>
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        )}
        </>
    );
}