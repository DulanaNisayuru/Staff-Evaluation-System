import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from '../images/avatar.png';
import logo from '../images/logo.png';
import '../css/HeaderImage.css';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Menu, MenuItem, IconButton } from "@mui/material";

const UserHeaderImage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        // Fetch user profile
        fetch("http://localhost:8080/api/v1/users/profile", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    setUser(data);
                } else {
                    setError("Profile not found or unauthorized access.");
                }
            })
            .catch((err) => {
                setError("An error occurred while fetching the profile.");
                console.error(err);
            });

        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return (
            <div className="center">
                <div className="loader"></div>
            </div>
        );
    }

    const formattedDate = dateTime.toLocaleDateString();
    const formattedTime = dateTime.toLocaleTimeString();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="header-img">
            <div className="header">
                <div style={{
                    display:"flex",
                }} className="image">
                <img src={logo} style={{
                    height:"40px"
                }}/>
                <h3 style={{
                    color:"#b3d2ff",
                    fontStyle:"italic",
                }}>International</h3>
                </div>
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <SearchIcon style={{ color: "white", marginTop: "5px" }} />
                </div>
                <div className="right">
                    <NotificationsActiveIcon style={{ color: "white", marginTop: "8px" }} />
                    <MailOutlineIcon style={{ color: "white", marginTop: "8px" }} />
                    <div className="line"></div>
                    <div style={{display:"flex",marginTop:"-8px"}} className="avatar">
                        <IconButton onClick={handleAvatarClick}>
                            <img className="avatar-img" src={avatar} alt="Avatar" />
                        </IconButton>
                        <p className="p1">{user.name}</p>
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            <AccountCircleIcon style={{ marginRight: 8 }} />
                            My Account
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <SettingsIcon style={{ marginRight: 8 }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon style={{ marginRight: 8 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    );
};

export default UserHeaderImage;
