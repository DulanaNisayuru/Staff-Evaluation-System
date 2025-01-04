// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./css/SignIn.css";

// const SignIn = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "USER",
//     dep_name: "", // Correct field name
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const myToken = localStorage.getItem("token");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleChangeDepartment = (e) => {
//     const { value } = e.target;
//     if (value === "Select Department") {
//       setMessage("Please select a valid department.");
//     } else {
//       setMessage(""); // Clear error
//       setFormData({ ...formData, dep_name: value }); // Correct update
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8080/api/v1/admin/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${myToken}`,
//         },
//         body: JSON.stringify(formData), // Ensure department is included
//       });

//       if (response.ok) {
//         toast.success("Registered Success!", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         setMessage("");
        
//       } else {
//         toast.error("Sign In Failed. Please try again.", {
//           position: "top-right",
//         });
//       }
//     } catch (error) {
//       toast.error("Error: Unable to connect to the server.", {
//         position: "top-right",
//       });
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <ToastContainer />
//       <h2>Sign In</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <select
//           name="department"
//           value={formData.department}
//           onChange={handleChangeDepartment}
//           required
//         >
//           <option>Select Department</option>
//           <option value="Technical">Technical</option>
//           <option value="Sales">Sales</option>
//           <option value="Accounts">Accounts</option>
//           <option value="Stores_and_Delivery">Stores & Delivery</option>
//         </select>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <select name="role" value={formData.role} onChange={handleChange}>
//           <option value="USER">USER</option>
//           <option value="ADMIN">ADMIN</option>
//           <option value="MANAGER">MANAGER</option>
//         </select>
//         <button style={{backgroundColor:"#007bff"}} type="submit">Register</button>
//       </form>
//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// };

// export default SignIn;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    dep_name: "", // Correct field name
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const myToken = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear department if role changes to ADMIN or MANAGER
    if (name === "role" && value !== "USER") {
      setFormData({ ...formData, dep_name: "", role: value });
    }
  };

  const handleChangeDepartment = (e) => {
    const { value } = e.target;
    if (value === "Select Department") {
      setMessage("Please select a valid department.");
    } else {
      setMessage(""); // Clear error
      setFormData({ ...formData, dep_name: value }); // Correct update
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
        body: JSON.stringify(formData), // Ensure department is included
      });

      if (response.ok) {
        setMessage("Sign In Success");
      } else {
        setMessage("Sign In Failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Unable to connect to the server.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Role Field */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
        </select>

        {/* Department Field (only for USER role) */}
        {formData.role === "USER" && (
          <select
            name="department"
            value={formData.department}
            onChange={handleChangeDepartment}
            required
          >
            <option>Select Department</option>
            <option value="Technical">Technical</option>
            <option value="Sales">Sales</option>
            <option value="Accounts">Accounts</option>
            <option value="Stores_and_Delivery">Stores & Delivery</option>
          </select>
        )}

        <button type="submit">Sign In</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignIn;
