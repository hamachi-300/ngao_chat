"use client"

import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";

export default function PostModal({ user_id, modal, toggleModal , setRefresh, refresh}) {
  const [content, setContent] = useState("");
  const [postError, setPostError] = useState("");
  const [categories, setCategories] = useState("general");

  const submitPost = async () => {
    const url = "/api/data/posts";
    const data = {
      post_content: content,
      author_id: user_id,
      category: categories,
    };

    try {
      // check post content
      if (content.length == 0) {
        setPostError("Error: No Content!!");
        throw new Error ("No Content!!");
      } 
      if (content.length > 200){
        setPostError("Error: Content are Exceeded!!");
        throw new Error ("Content are Exceeded!!");
      }
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
      toggleModal();
      setRefresh(!refresh)
    } catch (error) {

      console.log("Error:", error);
    }
  };

  const handlePost = (event) => {
    const { value } = event.target;
    setContent(value);
  };

  const changeCatagory = (event) => {
    const { value } = event.target;
    setCategories(value);
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className="p-4 hover:scale-110 text-3xl bg-blue-600 text-white transition-all duration-250 rounded-full hover:bg-blue-500 cursor-pointer"
      >
        <AiFillEdit />
      </button>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/70 z-50">
          {/* Click outside the modal to close it */}
          <div
            className="absolute inset-0"
            onClick={toggleModal}
          ></div>

          <div className="relative bg-indigo-500 p-6 rounded-2xl shadow-lg z-60 max-w-lg w-full text-white">
            <h2 className="text-2xl mb-4 font-bold">Post</h2>
            <button onClick={(e) => changeCatagory(e)} value="general" 
              className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "general" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
            >
              <FaComment className="inline"/> general
            </button>
            <button onClick={(e) => changeCatagory(e)} value="love" 
              className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "love" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
            >
              <FaHeart className="inline"/> love
            </button>
            <button onClick={(e) => changeCatagory(e)} value="game" 
              className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "game" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
            >
              <FaGamepad className="inline"/> game
            </button>
            <textarea
              className="w-full h-32 p-2 mb-4 mt-1 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type here..."
              value={content}
              onChange={handlePost}
            ></textarea>
            <button
              className="w-full py-2 transition-all duration-250 bg-green-600 rounded-md hover:bg-green-500 cursor-pointer"
              onClick={submitPost}
            >
              Post Now...
            </button>
            {postError!="" && (
              <p className="text-[#EA5455] font-bold mt-3">{postError}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
