"use client"

import React, { useState } from "react";
import "./Modal.css";

export default function PostModal({user_id}) {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState("");

  console.log(user_id)
  const toggleModal = () => {
    setModal(!modal);
  };

  const submitPost = async () => {
    const url = "/api/data/posts";
    const data = {
      post_content: content,
      author_id: user_id
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok){
        throw new Error("Fail to post data");
      }

      const result = await response.json();
      console.log('Data posted successfully:', result);
      setModal(!modal);
      window.location.reload();
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const handlePost = (event) => {
    const {value} = event.target;
    setContent(value);
  }

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
            <textarea className="input-textarea" placeholder={"Type here..."} value={content} onChange={handlePost}></textarea>
            <button className="post-btn" onClick={submitPost}>
              Post Now...
            </button>
          </div>
        </div>
      )}
    </>
  );
}