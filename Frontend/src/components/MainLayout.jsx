import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HeaderImage from "./HeaderImage";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <HeaderImage isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default MainLayout;
