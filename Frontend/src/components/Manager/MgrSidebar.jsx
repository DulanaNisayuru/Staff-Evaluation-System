// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from '../images/logo.png';
// import '../css/Sidebar.css';
// import Modal from '../Modal';
// import AddPeriod from "../AddPeriod";
// import LogoutIcon from '@mui/icons-material/Logout';
// import PreviewIcon from '@mui/icons-material/Preview';
// import RuleIcon from '@mui/icons-material/Rule';


// const MgrSidebar = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility
//   const [modalContent, setModalContent] = useState(null); // State to manage modal content

//   const handleSidebarNavigation = (path) => {
//     navigate(path);
//   };

//   const openModal = (content) => {
//     setModalContent(content); // Dynamically set the modal content
//     setModalOpen(true); // Open the modal
//   };

//   const closeModal = () => {
//     setModalOpen(false); // Close the modal
//     setModalContent(null); // Clear the modal content
//   };

//   return (
//     <div className="sidebar-main">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="sidebar-head">
//           <img className="logo-img" src={logo} alt="logo" />
//         </div>
        // <ul>
        //   {/* <li onClick={() => openModal(<SignIn />)}>Register</li> */}
        //   <li style={{display:'flex', gap:'8px' }} onClick={() => handleSidebarNavigation('/mgrAssignMarks')}><RuleIcon/>Assign Marks</li>
        //   <li style={{display:'flex', gap:'8px' }} onClick={() => handleSidebarNavigation('/mgrViewEvaluations')}> <PreviewIcon/>Assigned Marks</li>
        // </ul>
//         <button style={{display:'flex', gap:'60px', marginTop:'30px' }} onClick={() => handleSidebarNavigation('/')} className="btn-logout">Logout <LogoutIcon/></button>
//       </div>

//       {/* Modal Popup */}
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         {modalContent} {/* Dynamically render modal content */}
//       </Modal>
//     </div>
//   );
// };

// export default MgrSidebar;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../images/logo.png';
import '../css/Sidebar.css';
import Modal from '../Modal';
import SignIn from "../SignIn";
import { Box, Tooltip, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Logout, Rule, EditCalendar, AddBusiness, HowToReg, KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import ManagerEvaluations from "./MgrViewEvaluations";

const MgrSidebar = () => {
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
    { text: "Assign Marks", icon: <Dashboard />, path: "/mgrAssignMarks" },
    { text: "View Evaluations", icon: <EditCalendar />, path: "/mgrViewEvaluations" },
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
            <h3 style={{ marginTop: "0px", marginLeft: "40px", fontSize: "25px" }}>Manager</h3>
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

export default MgrSidebar;
