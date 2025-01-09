import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderImage from "./HeaderImage"; // Import the new HeaderImage component
import "./css/AdminPage.css";
import { Home, Settings, Info } from "@mui/icons-material";
import DepartmentSummary from "./DepartmentSummary";
import { toast, ToastContainer } from "react-toastify";
// Import toastify css file
import "react-toastify/dist/ReactToastify.css";
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [mgrCount, setMgrCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [departmentMarks, setDepartmentMarks] = useState([]); // For BarChart
  const [departmentNames, setDepartmentNames] = useState([]); // Department names for chart
  const [evaluations, setEvaluations] = useState([]);
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // Display the toast notification for login success
    toast.success("Login Success!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Fetch user profile
    fetch("http://localhost:8080/api/v1/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
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

    // Fetch user count and average marks
    fetch("http://localhost:8080/api/v1/admin/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const users = data.filter((user) => user.role === "USER");
        setUserCount(users.length);

        const admins = data.filter((user) => user.role === "ADMIN"); 
        setAdminCount(admins.length);

        const mgr = data.filter((user) => user.role === "MANAGER"); 
        setMgrCount(mgr.length);
       
      })
      .catch((err) => console.error("Error fetching user data:", err));

    // Fetch total departments
    fetch("http://localhost:8080/api/v1/admin/departments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDepartmentCount(data.length); // Set total departments
        setDepartmentNames(data.map((dep) => dep.name)); // Extract department names
        setDepartmentMarks(data.map((dep) => dep.avgMarks || 0)); // Use `avgMarks` if available
      })
      .catch((err) => console.error("Error fetching department data:", err));

    // Update time every second
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

  return (
    <div className="adminPage" style={{ display: "flex", height: "100vh" }}>
      <Sidebar onToggleSidebar={setSidebarOpen} />

      {/* Main content */}
      <div
        id="main-content"
        className="main-content"
        style={{
          marginLeft: isSidebarOpen ? 220 : 60,
          transition: "margin-left 0.3s",
        }}
      >
        <HeaderImage
          user={user}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
        />

        {/* Statistics */}
        <div className="statistics-container">
          <div className="stat-card">
            <div className="stat-value">{userCount}</div>
            <div className="stat-label">
              <span>Total Number of Employees</span>
              <span className="stat-icon"><PersonOutlineIcon/></span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{adminCount+ mgrCount}</div>
            <div className="stat-label">
              <span>Total Number of Assessors</span>
              <span className="stat-icon"><SupervisorAccountIcon/></span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{departmentCount}</div>
            <div className="stat-label">
              <span>Number of Departments</span>
              <span className="stat-icon"><ApartmentIcon/></span>
            </div>
          </div>
        </div>
        <DepartmentSummary />

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminPage;
