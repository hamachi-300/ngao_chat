"use client"

import React, { useState } from "react";
import "./Modal.css";

export default function PostModal({header}) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <button onClick={toggleModal}>
        post
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Post</h2>
            <textarea className="input-textarea" placeholder={"Type here..."}></textarea>
            <button className="post-btn">
              Post Now...
            </button>
          </div>
        </div>
      )}
    </>
  );
}