// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import HeaderImage from './HeaderImage';
// import './css/AdminEvaluation.css';

// export default function AdminEvaluation() {
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
//     fetch("http://localhost:8080/api/v1/admin/assessment", {
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
//     fetch("http://localhost:8080/api/v1/admin/department-users", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((response) => response.json())
//       .then((data) => setDepartments(data))
//       .catch((err) => setError("Failed to fetch department data."));
//   }, [token]);

//   const handlePeriodChange = (event) => {
//     setSelectedPeriod(event.target.value);
    
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
//     let hasInvalidMarks = Object.keys(invalidMarks).length > 0;
//     let hasEmptyFields = false;

//       // Check if any achievementMarks fields are empty
//     Object.keys(departments).forEach((departmentName) => {
//       departments[departmentName].forEach((user) => {
//         if (!user.achievementMarks) {
//           hasEmptyFields = true;
//         }
//       });
//     });

//   // If there are empty fields, prompt the confirmation dialog
//   if (hasEmptyFields) {
//     const confirmSave = window.confirm(
//       "There are empty fields. Are you sure you want to save this? If you want to edit, you can do it later."
//     );
    
//     if (!confirmSave) {
//       return; // Exit the save function if the user cancels
//     }
//   }

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

//       const response = await fetch("http://localhost:8080/api/v1/admin/evaluation", {
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
//         backgroundColor: "transparent", // Default color if not in mapping
//         marginBottom: '10px',
//         borderRadius: '10px',
//         boxShadow: " 0 2px 8px #333",
//         borderRadius:"0px"
//       }}
//       >
//         <tbody className='dep-name-tboady' key={departmentName}>
//           <tr
//             className='dep-name-tr'
//             style={{
//               fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
//               fontWeight: "bold",
//               color: "#333", // Default color if not in mapping
              
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
//                   onChange={(e) => handleMarksChange(departmentName, user.id, "achievementMarks", e.target.value)}
//                   onInput={(e) => {
//                     // Allow only numeric characters and restrict input to numbers between 0 and 10
//                     const value = e.target.value;
//                     if (isNaN(value) || value < 0 || value > 10) {
//                       // Prevent non-numeric input or input outside the range 0-10
//                       e.preventDefault();
//                     }
//                   }}
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
//       <Sidebar />
//       <div className="admin-evaluate-main">
//         <HeaderImage /> 
        
//         <div className="marking-tbl">
//         <h1 style={{
          
//           fontSize:"35px",
//           color: "#333",
//         }}>Personal Assessment</h1>
//         <div style={{display:'flex', gap:'250px'}} className="dropdown">
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
import Sidebar from './Sidebar';
import HeaderImage from './HeaderImage';
import './css/AdminEvaluation.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

export default function AdminEvaluation() {
  const [periods, setPeriods] = useState([]);
  const [departments, setDepartments] = useState({});
  const [user, setUser] = useState({ email: "test@example.com" }); // Example user
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidMarks, setInvalidMarks] = useState({}); // To track invalid input
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog visibility state
  const [hasEmptyFields, setHasEmptyFields] = useState(false); // Flag for empty fields
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch periods data
    fetch("http://localhost:8080/api/v1/admin/assessment", {
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
    fetch("http://localhost:8080/api/v1/admin/department-users", {
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
    let hasInvalidMarks = Object.keys(invalidMarks).length > 0;
    let hasEmptyFields = false;

    // Check if any achievementMarks fields are empty
    Object.keys(departments).forEach((departmentName) => {
      departments[departmentName].forEach((user) => {
        if (!user.achievementMarks) {
          hasEmptyFields = true;
        }
      });
    });

    // If there are empty fields, open the dialog instead of using window.confirm
    if (hasEmptyFields) {
      setHasEmptyFields(true); // Set flag to true
      setDialogOpen(true); // Open dialog
      return; // Exit the function
    }

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

      const response = await fetch("http://localhost:8080/api/v1/admin/evaluation", {
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

  const handleDialogClose = (confirm) => {
    setDialogOpen(false);
    if (confirm) {
      handleSaveConfirmed(); // Call the save function if confirmed
    }
  };

  const handleSaveConfirmed = async () => {
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

      const response = await fetch("http://localhost:8080/api/v1/admin/evaluation", {
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
                      onChange={(e) => handleMarksChange(departmentName, user.id, "achievementMarks", e.target.value)}
                      onInput={(e) => {
                        const value = e.target.value;
                        if (isNaN(value) || value < 0 || value > 10) {
                          e.preventDefault();
                        }
                      }}
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

      {/* Dialog box for confirmation */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <p>There are empty fields. Are you sure you want to save this? If you want to edit, you can do it later.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="secondary">Cancel</Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
