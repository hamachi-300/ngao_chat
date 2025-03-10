"use client";

import { IoEarthSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function YourPost() {
  const [enable, setEnable] = useState(false);
  const [posts, setPosts] = useState([]);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility on click
  const toggleDropdown = () => {
    setEnable((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target)
    ) {
      setEnable(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative group">
        {/* Button with hover description */}
        <div
          className="text-white text-2xl hover:scale-110 hover:text-green-300 duration-150 transition-all shadow-md cursor-pointer"
          onClick={toggleDropdown} // Toggle dropdown visibility on click
        >
          <IoEarthSharp />
        </div>

        {/* Hover text (tooltip) */}
        <div
          style={{ draggable: false }}
          className="text-xs absolute left-1/2 w-20 transform -translate-x-1/2 mt-2 p-2 bg-[#0000008d] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          <p className="text-center">Your Posts</p>
        </div>
      </div>

      {/* Dropdown Menu with top-to-bottom wipe transition */}
      <div
        ref={dropdownRef}
        className={`absolute left-1/2 w-100 transform -translate-x-full mt-5 p-2 bg-gray-200 text-[#070F2B] rounded transition-all duration-250 ${
          enable ? "opacity-100" : "opacity-0"
        } pointer-events-auto`}
      >
        {/* Add your dropdown content here */}
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full gap-3">
                <p className="font-bold text-center mt-2.5">Your Posts</p>
                <div className="w-[90%] bg-[#615FFF] h-1 rounded-full"></div>
            </div>
        </div>
      </div>
    </>
  );
}
