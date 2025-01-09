import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.png';
import '../css/Sidebar.css';
import Modal from '../Modal';
import SignIn from "../SignIn";
import { Box, Tooltip, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Logout, Rule, EditCalendar, AddBusiness, HowToReg, KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";

const UserSidebar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [markingMenuOpen, setMarkingMenuOpen] = useState(false);

  const handleSidebarNavigation = (path) => {
    navigate(path);
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.documentElement.style.setProperty("--sidebar-width", isOpen ? "60px" : "220px");
  };

  const toggleMarkingMenu = () => {
    setMarkingMenuOpen(!markingMenuOpen);
  };

  const menuItems = [
    // { text: "Assign Marks", icon: <Dashboard />, path: "/" },
    // { text: "View Evaluations", icon: <EditCalendar />, path: "/" },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", isOpen ? "220px" : "60px");
  }, []);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isOpen ? 220 : 60,
          backgroundColor: "#fafdfb",
          color: "#333",
          transition: "width 0.3s",
          height: "100vh",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            padding: "0px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box sx={{ marginBottom: "30px" }}>
            {isOpen && (
              <img
                className="logo-img"
                src={logo}
                alt="logo"
                style={{ marginLeft: "20px", marginTop: "50px", width: "80%" }}
              />
            )}
            <h3 style={{ marginTop: "0px", marginLeft: "40px", fontSize: "25px" }}></h3>
          </Box>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <Tooltip title={!isOpen ? item.text : ""} placement="right" key={index}>
              <ListItem
                button
                sx={{borderBottom:"1px solid #eee ", padding: isOpen ? "10px 20px" : "10px" }}
                onClick={() =>
                  item.modalContent ? openModal(item.modalContent) : handleSidebarNavigation(item.path)
                }
              >
                <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
                {isOpen && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
          
          
        </List>
        
      </Box>

      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </Box>
  );
};

export default UserSidebar;
