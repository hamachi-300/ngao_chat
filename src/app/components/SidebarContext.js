"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      if (isSidebarOpen) {
        mainElement.classList.add("pl-48");
      } else {
        mainElement.classList.remove("pl-48");
      }
    }
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}