"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ConfirmDelete({ post_id, setConfirmModal, deletePost }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/70 z-50">
      {/* Modal Background Animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}    // Start with a transparent background
        animate={{ opacity: 1 }}    // Fade in the background
        exit={{ opacity: 0 }}      // Fade out the background
        transition={{ duration: 0.3 }} // Smooth transition
        onClick={() => setConfirmModal(null)} // Close the modal when clicking outside
      />
      
      {/* Modal Content */}
      <motion.div
        className="relative bg-gray-100 p-4 flex flex-col rounded-md shadow-lg max-w-lg w-100 text-[#070F2B]"
        initial={{ opacity: 0, scale: 0.8 }}  // Initial state (invisible and scaled down)
        animate={{ opacity: 1, scale: 1 }}    // Animate to visible and normal scale
        exit={{ opacity: 0, scale: 0.8 }}     // Fade and scale down on exit
        transition={{ duration: 0.3 }}         // Transition timing
      >
        <div>
          <p className="mb-2 text-[1.5rem]">Confirm Delete</p>
          <p className="text-gray-500 text-sm">Are you sure you want to delete this post?</p>
          <hr className="" />
        </div>
        <div className="text-sm flex flex-row-reverse gap-3 mt-7">
          <button onClick={() => {deletePost(post_id); setConfirmModal(null)}} className="text-white transition-all duration-150 hover:bg-red-600 bg-red-500 p-1 px-3 rounded-md">
            Delete
          </button>
          <button onClick={() => setConfirmModal(null)} className="bg-white transition-all duration-150 hover:bg-gray-200 p-1 px-3 rounded-md">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
