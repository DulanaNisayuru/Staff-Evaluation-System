import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserEvaluation from "./UserEvaluations";
import HeaderImage from "../HeaderImage";
import UserHeaderImage from "./UserHeaderImage";
import avatar from '../images/avatar.png';
import '../css/UserProfile.css';
import { Email } from "@mui/icons-material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import CallIcon from '@mui/icons-material/Call';
import BusinessIcon from '@mui/icons-material/Business';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // If no token, redirect to login page
    if (!token) {
      navigate("/lg");
      return;
    }

    // Fetch user profile data from the backend
    fetch("http://localhost:8080/api/v1/users/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          // If data is returned, set the user data in state
          setUser(data);
        } else {
          setError("Profile not found or unauthorized access.");
        }
      })
      .catch((err) => {
        setError("An error occurred while fetching the profile.");
        console.error(err);
      });
  }, [navigate]);

  // Display loading message or error message if needed
  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div class="center">
    <div class="loader"></div>
        </div>;
  }

  // Display the user profile details
  return (
    <div className="user-main">
        <UserHeaderImage/>

    <div className="user-sub-main">
      <div className="user-data">
        <img className="avt" style={{
          height:"100px",
        }} src={avatar}/>

        <p style={{fontSize:"25px"}}>{user.name}</p>
        <strong style={{fontWeight:"bold",fontSize:"15px"}}>User</strong>
        <div >
        <div style={{display:"flex"}}>
        <Email style={{marginTop:"10px",marginRight:"10px"}}/>
        <p  style={{ fontSize:"15px"}}>{user.email}</p>
        </div>
        <div style={{marginTop:"-20px",display:"flex"}}>
        <CallIcon style={{marginTop:"10px",marginRight:"10px"}}/>
        <p  style={{ fontSize:"15px"}}>+94701234678</p>
        </div>
        <div style={{display:"flex",marginTop:"-20px"}}>
        <BusinessIcon style={{marginTop:"10px",marginRight:"10px"}}/>
        <p  style={{ fontSize:"15px"}}>{user.dep_name ? user.dep_name : "N/A"}</p>
        </div>
        </div>
       
       <div style={{marginBottom:"100px",display:"flex"}}>
    
        <button style={{border:"1px solid #e0e0e0",color:"#333",backgroundColor:"white",height:"35px",borderRadius:"10px"}}>
          <div style={{ display:"flex"}}>
          <EditIcon style={{marginTop:"-5px"}}/>
          Edit
          </div>
        </button>

        <button style={{border:"1px solid #e0e0e0",color:"#333",backgroundColor:"white",height:"35px",borderRadius:"10px",marginLeft:"30px"}}>
        
        <div style={{ display:"flex"}}>
          View more
          <ChevronRightIcon style={{marginTop:"-5px"}}/>

          </div>
        </button>
       </div>
      </div>

      <div className="evaluation-user">
        <h3 style={{fontSize:"30px",padding:"10px",color:"#333"}}>{user.name}- Department of {user.dep_name}</h3>
        <UserEvaluation/>

      </div>


    </div>
{/*       
      <div className="user-sub">
      
      <h1>User profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Department:</strong> {user.dep_name ? user.dep_name : "N/A"}</p>
      

      
      </div> */}
    </div>
  );
};

export default UserProfile;