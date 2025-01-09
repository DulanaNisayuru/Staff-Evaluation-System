// import React, { useState, useEffect } from 'react';
// import MgrSidebar from './MgrSidebar';
// import MgrHeaderImage from './MgrHeaderImage';
// import '../css/AdminEvaluation.css';

// export default function MgrEvaluation() {
//   const [periods, setPeriods] = useState([]);
//   const [departments, setDepartments] = useState({});
//   const [user, setUser] = useState({ email: "test@example.com" }); // Example user
//   const [selectedPeriod, setSelectedPeriod] = useState("");
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [invalidMarks, setInvalidMarks] = useState({}); // To track invalid input
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     // Fetch periods data
//     fetch("http://localhost:8080/api/v1/manager/assessment", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data && data.length > 0) {
//           const sortedPeriods = data.sort((a, b) => new Date(b.date) - new Date(a.date));
//           setPeriods(sortedPeriods);
//           setSelectedPeriod(sortedPeriods[0]?.period);
//         }
//       })
//       .catch((err) => setError("Failed to fetch periods."));

//     // Fetch department data
//     fetch("http://localhost:8080/api/v1/manager/department-users", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((response) => response.json())
//       .then((data) => setDepartments(data))
//       .catch((err) => setError("Failed to fetch department data."));
//   }, [token]);

//   const handlePeriodChange = (event) => {
//     setSelectedPeriod(event.target.value);
//     window.location.reload();
//   };

//   const handleMarksChange = (departmentName, userId, field, value) => {
//   if (field === "achievementMarks") {
//     // Convert the value to a number
//     let numericValue = Number(value);

//     // Ensure the value is within the valid range (0-10)
//     if (numericValue < 0) numericValue = 0;
//     if (numericValue > 10) numericValue = 10;

//     // Update the invalidMarks state to track which fields are invalid
//     setInvalidMarks((prevErrors) => {
//       const updatedErrors = { ...prevErrors };
//       if (isNaN(numericValue)) {
//         updatedErrors[`${departmentName}-${userId}-${field}`] = "Please enter a valid number.";
//       } else {
//         delete updatedErrors[`${departmentName}-${userId}-${field}`];
//       }
//       return updatedErrors;
//     });

//     // Update the department data immediately
//     setDepartments((prevDepartments) => {
//       const updatedDepartments = { ...prevDepartments };
//       updatedDepartments[departmentName] = updatedDepartments[departmentName].map((user) =>
//         user.id === userId ? { ...user, [field]: numericValue } : user
//       );
//       return updatedDepartments;
//     });
//   } else {
//     // Handle the text field (remarks)
//     setDepartments((prevDepartments) => {
//       const updatedDepartments = { ...prevDepartments };
//       updatedDepartments[departmentName] = updatedDepartments[departmentName].map((user) =>
//         user.id === userId ? { ...user, [field]: value } : user
//       );
//       return updatedDepartments;
//     });
//   }
// };

//   const handleSave = async (event) => {
//     event.preventDefault(); // Prevent page refresh

//     // Check for any invalid marks before proceeding
//     const hasInvalidMarks = Object.keys(invalidMarks).length > 0;
//     if (hasInvalidMarks) {
//       setError("Please correct the invalid marks.");
//       return; // Don't navigate or submit if invalid marks exist
//     }

//     try {
//       const evaluationPayload = {
//         assessor: user.email,
//         period: selectedPeriod,
//         date: new Date().toISOString(),
//         departments: Object.keys(departments).map((departmentName) => ({
//           dep_name: departmentName,
//           members: departments[departmentName].map((user) => ({
//             name: user.name,
//             totalMarks: 10,
//             achievementMarks: user.achievementMarks || 0,
//             remarks: user.remark || "",
//           })),
//         })),
//       };

//       const response = await fetch("http://localhost:8080/api/v1/manager/evaluation", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluationPayload),
//       });

//       if (response.ok) {
//         alert("Evaluation submitted successfully!");
//         setTimeout(() => setSuccessMessage(""), 3000);
//       } else {
//         const errorMessage = await response.text();
//         setError(`Error submitting evaluation: ${errorMessage}`);
//       }
//     } catch (err) {
//       setError("Error submitting evaluation.");
//     }
//   };
//   const departmentColors = {
//     "Technical": " #eafafa",
//     "Stores_&_Delivery": "#eafafa",
//     "Sales": "#007c7c38",
//     "Accounts": "#007c7c38",
//   };


//   const renderDepartments = () => {
//     return Object.keys(departments)
//     .filter((departmentName) => departmentName !== "" && departmentName !== undefined) // Filter out null or undefined department names
//     .map((departmentName) => (
//       <div 
//       className="table-marking"
//       style={{
//         fontWeight: "bold",
//         backgroundColor: departmentColors[departmentName] || "#ffffff", // Default color if not in mapping
//         marginBottom: '10px',
//         borderRadius: '10px'
//       }}
//       >
//         <tbody className='dep-name-tboady' key={departmentName}>
//           <tr
//             className='dep-name-tr'
//             style={{
//               fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
//               fontWeight: "bold",
//               color: "#005757", // Default color if not in mapping
//               fontStyle:"italic",
//               border: "#005757 1px solid",
//               borderRadius: "8px",
//               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3), 0px 1px 4px rgba(0, 0, 0, 0.3)",
//               cursor:"pointer"
              
//             }}
//           >
//             <td  style={{ fontWeight: "bold" }}>
//               {departmentName}
//             </td>
//         </tr>
//         {departments[departmentName]
//           .filter((user) => user.role === "USER")
//           .map((user) => (
//             <tr key={user.id}>
              
//               <td>{user.name}</td>
             
//               <td>
//                 <input
//                   type="number"
//                   value={user.achievementMarks || ""}
//                   onChange={(e) =>
//                     handleMarksChange(departmentName, user.id, "achievementMarks", e.target.value)
//                   }
//                   min="0"
//                   max="10"
//                   style={{
//                     borderColor: invalidMarks[`${departmentName}-${user.id}-achievementMarks`] ? "red" : "",
//                   }}
//                 />
//               </td>
//               <td>
//                 <input
//                   type="text"
//                   value={user.remark || ""}
//                   onChange={(e) =>
//                     handleMarksChange(departmentName, user.id, "remark", e.target.value)
//                   }
//                   placeholder="Enter Remark"
//                   style={{
//                     borderColor: invalidMarks[`${departmentName}-${user.id}-remark`] ? "red" : "",
//                   }}
//                 />
//               </td>
//             </tr>
//           ))}
//       </tbody>
//       </div>
//     ));
//   };

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!user || !departments) {
//     return <div class="center">
//     <div class="loader"></div>
//         </div>;
//   }

//   return (
//     <div>
//       <MgrSidebar />
//       <div className="admin-evaluate-main">
//         <MgrHeaderImage /> 
//         <h1 style={{
//           textAlign:"center",
//           fontSize:"35px",
//           color: "#005757",
//           textShadow: "2px 2px 5px #369b6c",
//         }}>Personal Assessment</h1>
//         <div className="marking-tbl">
//         <div className="period-btn">
//         <label>
//           <strong>Period:</strong>
//           <select value={selectedPeriod} onChange={handlePeriodChange}>
//             {periods.map((assessment) => (
//               <option key={assessment.id} value={assessment.period}>
//                 {assessment.period}
//               </option>
//             ))}
//           </select>
//         </label>
//         <button className='btn-save' onClick={handleSave}>Save</button>
//         </div>

//         <table >
//         {renderDepartments()}
//         </table>
        
        
//         </div>
        
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import Sidebar from './MgrSidebar';
import HeaderImage from './MgrHeaderImage';
import '../css/AdminEvaluation.css';

export default function AdminEvaluation() {
  const [periods, setPeriods] = useState([]);
  const [departments, setDepartments] = useState({});
  const [user, setUser] = useState({ email: "test@example.com" }); // Example user
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidMarks, setInvalidMarks] = useState({}); // To track invalid input
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch periods data
    fetch("http://localhost:8080/api/v1/manager/assessment", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const sortedPeriods = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPeriods(sortedPeriods);
          setSelectedPeriod(sortedPeriods[0]?.period);
        }
      })
      .catch((err) => setError("Failed to fetch periods."));

    // Fetch department data
    fetch("http://localhost:8080/api/v1/manager/department-users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((err) => setError("Failed to fetch department data."));
  }, [token]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
    
  };

  const handleMarksChange = (departmentName, userId, field, value) => {
  if (field === "achievementMarks") {
    // Convert the value to a number
    let numericValue = Number(value);

    // Ensure the value is within the valid range (0-10)
    if (numericValue < 0) numericValue = 0;
    if (numericValue > 10) numericValue = 10;

    // Update the invalidMarks state to track which fields are invalid
    setInvalidMarks((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (isNaN(numericValue)) {
        updatedErrors[`${departmentName}-${userId}-${field}`] = "Please enter a valid number.";
      } else {
        delete updatedErrors[`${departmentName}-${userId}-${field}`];
      }
      return updatedErrors;
    });

    // Update the department data immediately
    setDepartments((prevDepartments) => {
      const updatedDepartments = { ...prevDepartments };
      updatedDepartments[departmentName] = updatedDepartments[departmentName].map((user) =>
        user.id === userId ? { ...user, [field]: numericValue } : user
      );
      return updatedDepartments;
    });
  } else {
    // Handle the text field (remarks)
    setDepartments((prevDepartments) => {
      const updatedDepartments = { ...prevDepartments };
      updatedDepartments[departmentName] = updatedDepartments[departmentName].map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      );
      return updatedDepartments;
    });
  }
};

  const handleSave = async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Check for any invalid marks before proceeding
    const hasInvalidMarks = Object.keys(invalidMarks).length > 0;
    if (hasInvalidMarks) {
      setError("Please correct the invalid marks.");
      return; // Don't navigate or submit if invalid marks exist
    }

    try {
      const evaluationPayload = {
        assessor: user.email,
        period: selectedPeriod,
        date: new Date().toISOString(),
        departments: Object.keys(departments).map((departmentName) => ({
          dep_name: departmentName,
          members: departments[departmentName].map((user) => ({
            name: user.name,
            totalMarks: 10,
            achievementMarks: user.achievementMarks || 0,
            remarks: user.remark || "",
          })),
        })),
      };

      const response = await fetch("http://localhost:8080/api/v1/manager/evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluationPayload),
      });

      if (response.ok) {
        alert("Evaluation submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorMessage = await response.text();
        setError(`Error submitting evaluation: ${errorMessage}`);
      }
    } catch (err) {
      setError("Error submitting evaluation.");
    }
  };
  const departmentColors = {
    "Technical": " #eafafa",
    "Stores_&_Delivery": "#eafafa",
    "Sales": "#007c7c38",
    "Accounts": "#007c7c38",
  };


  const renderDepartments = () => {
    return Object.keys(departments)
    .filter((departmentName) => departmentName !== "" && departmentName !== undefined) // Filter out null or undefined department names
    .map((departmentName) => (
      <div 
      className="table-marking"
      style={{
        fontWeight: "bold",
        backgroundColor: "transparent", // Default color if not in mapping
        marginBottom: '10px',
        borderRadius: '10px',
        boxShadow: " 0 2px 8px #333",
        borderRadius:"0px"
      }}
      >
        <tbody className='dep-name-tboady' key={departmentName}>
          <tr
            className='dep-name-tr'
            style={{
              fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
              fontWeight: "bold",
              color: "#333", // Default color if not in mapping
              
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3), 0px 1px 4px rgba(0, 0, 0, 0.3)",
              cursor:"pointer"
              
            }}
          >
            <td  style={{ fontWeight: "bold" }}>
              {departmentName}
            </td>
        </tr>
        {departments[departmentName]
          .filter((user) => user.role === "USER")
          .map((user) => (
            <tr key={user.id}>
              
              <td>{user.name}</td>
              
              <td>
                <input
                  type="number"
                  value={user.achievementMarks || ""}
                  onChange={(e) =>
                    handleMarksChange(departmentName, user.id, "achievementMarks", e.target.value)
                  }
                  min="0"
                  max="10"
                  style={{
                    borderColor: invalidMarks[`${departmentName}-${user.id}-achievementMarks`] ? "red" : "",
                  }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.remark || ""}
                  onChange={(e) =>
                    handleMarksChange(departmentName, user.id, "remark", e.target.value)
                  }
                  placeholder="Enter Remark"
                  style={{
                    borderColor: invalidMarks[`${departmentName}-${user.id}-remark`] ? "red" : "",
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
      </div>
    ));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user || !departments) {
    return <div class="center">
    <div class="loader"></div>
        </div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="admin-evaluate-main">
        <HeaderImage /> 
        
        <div className="marking-tbl">
        <h1 style={{
          
          fontSize:"35px",
          color: "#333",
        }}>Personal Assessment</h1>
        <div style={{display:'flex', gap:'250px'}} className="dropdown">
        <label>
          <strong>Period:</strong>
          <select value={selectedPeriod} onChange={handlePeriodChange}>
            {periods.map((assessment) => (
              <option key={assessment.id} value={assessment.period}>
                {assessment.period}
              </option>
            ))}
          </select>
        </label>
        <button className='btn-save' onClick={handleSave}>Save</button>
        </div>

        <table >
        {renderDepartments()}
        </table>
        
        
        </div>
        
      </div>
    </div>
  );
}
