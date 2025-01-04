import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from './images/logo.png';
import './css/Sidebar.css';
import Modal from './Modal';
import SignIn from "./SignIn";
import { Box, Tooltip, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Logout, Rule, EditCalendar, AddBusiness, HowToReg, KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import AddDepartment from "./AddDepartment";
import UsersTable from "./User";

const Sidebar = () => {
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
    { text: "Dashboard", icon: <Dashboard />, path: "/adminPage" },
    { text: "Register", icon: <HowToReg />, modalContent: <SignIn /> },
    { text: "Targets & Periods", icon: <EditCalendar />, path: "/view-assessments" },
    { text: "Department", icon: <AddBusiness />,  modalContent: <AddDepartment /> },
    { text: "Manage Users", icon: <AddBusiness />,  path: "/user" },
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
                style={{ marginLeft: "35px", marginTop: "50px", width: "70%" }}
              />
            )}
            <h3 style={{ marginTop: "0px", marginLeft: "40px", fontSize: "25px" }}>Admin</h3>
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
          {/* Marking Dropdown */}
          <ListItem
            button
            sx={{ padding: isOpen ? "10px 20px" : "10px",borderBottom:"1px solid #eee " }}
            onClick={toggleMarkingMenu}
          >
            <ListItemIcon sx={{ color: "#333" }}>
              <Rule />
            </ListItemIcon>
            {isOpen && <ListItemText  primary="Marking" />}
            {isOpen && (markingMenuOpen ? <KeyboardArrowDown /> : <KeyboardArrowRight />)}
          </ListItem>
          <Box
            sx={{
              paddingLeft: "20px",
              maxHeight: markingMenuOpen ? "300px" : "0px",
              opacity: markingMenuOpen ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            <ListItem
              button
              sx={{ padding: "5px 20px" }}
              onClick={() => handleSidebarNavigation('/allMarksByAssessors')}
            >
              <ListItemText primary="All Assigned Marks" />
            </ListItem>
            <ListItem
              button
              sx={{ padding: "5px 20px" }}
              onClick={() => handleSidebarNavigation('/viewEvaluations')}
            >
              <ListItemText primary="My Assigned Marks" />
            </ListItem>
            <ListItem
              button
              sx={{ padding: "5px 20px" }}
              onClick={() => handleSidebarNavigation('/assignMarks')}
            >
              <ListItemText primary="Assign Marks" />
            </ListItem>
          </Box>
        </List>
        {/* <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "30px",
            marginLeft: isOpen ? "10px" : "0px",
            backgroundColor: "#fdfdfd",
            color: "#333",
            border: "none",
            padding: isOpen ? "10px" : "5px",
            cursor: "pointer",
            justifyContent: isOpen ? "" : "center",
          }}
          onClick={() => handleSidebarNavigation('/')}
        >
          <Logout />
          {isOpen && <span>Logout</span>}
        </button> */}
      </Box>

      {/* Modal Popup */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </Box>
  );
};

export default Sidebar;
