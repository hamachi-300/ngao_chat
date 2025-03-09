"use client"

import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";

export default function PostModal({ user_id }) {
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState("");

  const toggleModal = () => {
    setModal(!modal);
  };

  const submitPost = async () => {
    const url = "/api/data/posts";
    const data = {
      post_content: content,
      author_id: user_id,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to post data");
      }

      const result = await response.json();
      console.log("Data posted successfully:", result);
      setModal(!modal);
      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handlePost = (event) => {
    const { value } = event.target;
    setContent(value);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="p-4 hover:scale-110 text-3xl bg-blue-600 text-white transition-all duration-250 rounded-full hover:bg-blue-500"
      >
        <AiFillEdit />
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/70 z-50">
          <div
            onClick={toggleModal}
            className="absolute inset-0 cursor-pointer"
          ></div>

          <div className="relative bg-indigo-500 p-6 rounded-2xl shadow-lg z-10 max-w-lg w-full text-white">
            <h2 className="text-2xl mb-4 font-bold">Post</h2>
            <textarea
              className="w-full h-32 p-2 mb-4 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
              value={content}
              onChange={handlePost}
            ></textarea>
            <button
              className="w-full py-2 transition-all duration-250 bg-green-600 rounded-md hover:bg-green-500"
              onClick={submitPost}
            >
              Post Now...
            </button>
          </div>
        </div>
      )}
    </>
  );
}
