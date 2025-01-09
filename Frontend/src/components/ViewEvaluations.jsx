import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HeaderImage from './HeaderImage';
import EditMemberModal from './EditMemberModal';
import { jsPDF } from "jspdf"; // To generate PDF
import "jspdf-autotable";
import './css/ModalAll.css';
import './css/MgrViewEvaluation.css'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { toast, ToastContainer } from "react-toastify";


const ViewEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("All Periods"); // For selected period
  const [managerEmail, setManagerEmail] = useState(""); // Store logged-in manager's email
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(""); 
  const [selectedMember, setSelectedMember] = useState(null); // State to track the member being edited
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch logged-in manager's profile
    fetch('http://localhost:8080/api/v1/admin/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch manager profile');
        }
        return response.json();
      })
      .then((data) => {
        setManagerEmail(data.email); // Save the manager's email
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });


          // Display the toast notification for login success
    toast.success("Edit Success!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Fetch evaluations data
    fetch('http://localhost:8080/api/v1/admin/evaluations', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEvaluations(data); // Set evaluations state
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Set error state if fetching fails
        setLoading(false);
      });
  }, [token]);

  // If data is loading, display a loading message
  if (loading) {
    return <div class="center">
    <div class="loader"></div>
        </div>;
  }

  // If there is an error, display an error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle period selection change
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Filter evaluations by logged-in manager and selected period
  const filteredEvaluations = evaluations.filter((evaluation) => 
    evaluation.assessor === managerEmail && 
    (selectedPeriod === "All Periods" || evaluation.period === selectedPeriod)
  );

  // Group evaluations by period if "All Periods" is selected
  const evaluationsGroupedByPeriod = filteredEvaluations.reduce((acc, evaluation) => {
    const { period } = evaluation;
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(evaluation);
    return acc;
  }, {});
  const downloadCSV = () => {
    const header = [
      "Period", "Department", "Person", "Achievement Marks", "Average",  
      "Total Marks (Team)", "Achievement Marks (Team)", "Average Achievement (Team)", "Average Team Mark"
    ];
    const rows = [];

    Object.keys(evaluationsGroupedByPeriod).forEach((period) => {
      evaluationsGroupedByPeriod[period].forEach((evaluation) => {
        evaluation.departments
          .filter(department => department.dep_name && department.dep_name !== "")
          .forEach((department) => {
            department.members.forEach((member) => {
              const row = [
                period,
                department.dep_name,
                member.name,
                //member.totalMarks,
                member.achievementMarks,
                member.average,
                //member.remarks,
                department.teamValues.totalMarks,
                department.teamValues.achievementMarks,
                department.teamValues.averageAchievement,
                department.teamValues.averageTeamMark.toFixed(2)
              ];
              rows.push(row);
            });
          });
      });
    });

    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob from the CSV content and trigger the download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "evaluations_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };






 
  const downloadPDF = () => {
    const doc = new jsPDF();
  

  // Load the image
  const img = new Image();
  img.src = './logo.png'; // Path to your image in the public folder

  img.onload = () => {
    // Add Image as Header
    doc.addImage(img, 'PNG', 0, 0, 210, 0); // Adjust dimensions and position as needed

    // Add Title
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setFontSize(20); // Increase font size
    doc.text("Team Performance Evaluation", 105, 50, { align: "center" });
    doc.setFont("helvetica", "normal"); // Reset font to normal for other text
    
    let startY = 60; // Initialize startY for proper positioning of content
  
    const departmentColors = {
      "Sales": [11, 82, 82, 0.22], // Light yellow for Sales
      "Stores_&_Delivery": [234, 250, 250], // Light green for Stores & Delivery
      "Technical": [234, 250, 250], // Light blue for Technical
      "Accounts": [234, 250, 250], // Light pink for Accounts
    };
  
    // Loop through data and generate sections for each period
    Object.keys(evaluationsGroupedByPeriod).forEach((period) => {
      // Add Period as a separate section heading (outside the table)
      doc.setFontSize(12);
      doc.setFont("Arial,sans-serif", "bold"); // Set font to bold
      doc.text(`Period: ${period}`, 20, startY);
      doc.setFont("helvetica", "normal"); // Reset font to normal for the rest of the text

      startY += 10; // Move the Y position down after the period heading
  
      // Table Headers
      const headers = [
        ["Department", "Person", "Marks", "Average", "Team Values"],
      ];
  
      const rows = [];
  
      // Dynamically Create Rows
      evaluationsGroupedByPeriod[period].forEach((evaluation) => {
        evaluation.departments
          .filter((department) => department.dep_name && department.dep_name !== "")
          .forEach((department) => {
            let teamValuesAdded = false;
            let departmentColor = departmentColors[department.dep_name] || [255, 255, 255]; // Get department color
  
            department.members.forEach((member, index) => {
              rows.push([
                index === 0 ? department.dep_name : "", // Department name only for the first row
                member.name, // Person
                member.achievementMarks, // Achievement Marks
                member.average, // Average
                teamValuesAdded
                  ? "" // Add Team Values only once per department
                  : `• Total Marks: ${department.teamValues.totalMarks}
                     • Achievement Marks: ${department.teamValues.achievementMarks}
                     • Average Achievement: ${department.teamValues.averageAchievement.toFixed(2)}%
                     • Average Team Mark: ${department.teamValues.averageTeamMark.toFixed(2)}`,
              ]);
  
              teamValuesAdded = true; // Ensure team values are added only for the first row of the department
            });
          });
      });
      let lastDepartmentName = "";
      // Render Table with Custom Borders
      doc.autoTable({
        head: headers,
        body: rows,
        startY: startY, // Start below the period heading
        styles: {
          fontSize: 10, // Font size for table content
          cellPadding: 3,
          textColor: 30, // Text color
          lineWidth: 0, // Set line width for the borders
          lineColor: [255, 255, 255], // Set border color (black)
        },
        headStyles: {
          fillColor: [63, 81, 181], // Header background color (blue)
          textColor: [255, 255, 255], // Header text color (white)
          fontSize: 12, // Header font size
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Light grey for alternate rows
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Department column width
          1: { cellWidth: 35 }, // Person column width
          2: { cellWidth: 30 }, // Marks column width
          3: { cellWidth: 25 }, // Average column width (reduced)
          4: { cellWidth:55 }, // Team Values column width (slightly reduced)
        },
        
        theme: "striped", // Striped theme for a modern look

        
        willDrawCell: function (data) {
          // Apply background color for department cells in all rows of the department
          if (data.section === "body") {
            const departmentName = data.row.raw[0]||lastDepartmentName; // Get department name from the first column
            if (data.row.raw[0]) {
              lastDepartmentName = departmentName;
            }
            const fillColor = departmentColors[departmentName] || [255, 255, 255];
              // Apply color to the entire row, not just the department column
              doc.setFillColor(...fillColor);
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F"); // Fill the cell with color
            }
          
        },
      });
  
      // Update startY after adding the table
      startY = doc.lastAutoTable.finalY + 10; // Add a margin after the table
    });
  
    // Add Footer with Timestamp
    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);
  
    // Save the PDF
    doc.save("tesam_performance_evaluation.pdf");
  };
};

  // Function to trigger download based on the selected format
  const downloadReport = () => {
    setIsModalOpen(true); // Show the modal to choose format
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormatSelection = (format) => {
    setSelectedFormat(format);
    setIsModalOpen(false);
    if (format === "CSV") {
      downloadCSV();
    } else if (format === "PDF") {   
      downloadPDF();
    }
  };
  const openEditModal = (evaluationId, department, member) => {

    setSelectedEvaluationId(evaluationId); // Store evaluation ID
    setSelectedMember({ depName: department.dep_name, ...member }); // Store selected member data
    setIsEditModalOpen(true); // Open the edit modal
  };
  
  
  const handleSave = (updatedData) => {
    console.log("Selected evaluation ID:", selectedEvaluationId); // Debugging
  
    if (!selectedEvaluationId) {
      console.error("No evaluation ID provided");
      return;
    }
  
    fetch(`http://localhost:8080/api/v1/admin/evaluation/${selectedEvaluationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((updatedEvaluation) => {
        console.log("Update successful:", updatedEvaluation);
      setEvaluations((prevEvaluations) =>
        prevEvaluations.map((evaluation) =>
          evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
        )
      );
        setIsEditModalOpen(false); 


        toast.success("Member updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => console.error("Error updating:", error));
  };
  
  
  return (
    <div className='eval-main'>
      <Sidebar />
      <div className="eval-main-sub">
      <HeaderImage /> 
      </div>
  <div className="eval-sub">
    
    <h1>Your Evaluations</h1>
    <ToastContainer/>

    
    <div className="dropdown">
      {/* Dropdown for selecting a period */}
    <label htmlFor="period">Select Period:</label>
    <select
      id="period"
      value={selectedPeriod}
      onChange={handlePeriodChange}
      className="eval-select"
    >
      <option value="All Periods">All Periods</option>
      {[...new Set(evaluations.map(evaluation => evaluation.period))].map((period) => (
        <option key={period} value={period}>{period}</option>
      ))}
    </select>
    </div>
     {/* Button to download the report */}
    <button onClick={downloadReport} >Download Report</button>

    {/* Display the table */}
    <div>
      {Object.keys(evaluationsGroupedByPeriod).map((period) => (
        <div key={period}>
          <h2 className="eval-period-header">{period}</h2>
          <table className="eval-table">
            <thead >
              <tr className="">
                <th>Department</th>
                <th>Person</th>
                <th>Total Marks</th>
                <th>Achievement Marks</th>
                <th>Average</th>
                <th>Remarks</th>
                <th>Team Values (Total Marks, Achievement Marks, Average)</th>
              </tr>
            </thead>
            <tbody>
              {evaluationsGroupedByPeriod[period].map((evaluation) =>
                evaluation.departments
                  .filter((department) => department.dep_name) // Filter out departments with null dep_name
                  .map((department) =>
                    department.members.map((member, index) => (
                      <tr className='eve-tbl-raw' key={`${evaluation.id}-${department.dep_name}-${member.name}`}>
                        {index === 0 && (
                          <td rowSpan={department.members.length}>{department.dep_name}</td>
                        )}
                        <td>{member.name}</td>
                        <td>{member.totalMarks}</td>
                        <td>{member.achievementMarks}</td>
                        <td>{member.average}%</td>
                        <td>{member.remarks}</td>
                        {index === 0 && (
                          <td rowSpan={department.members.length}>
                            <ul>
                              <li>Total Marks: {department.teamValues.totalMarks}</li>
                              <li>Achievement Marks: {department.teamValues.achievementMarks}</li>
                              <li>Average Achievement: {department.teamValues.averageAchievement.toFixed(2)}%</li>
                              <li>Average Team Mark: {department.teamValues.averageTeamMark.toFixed(2)}</li>
                            </ul>
                          </td>
                        )}
                        <td>
                            <button className='edit-button' style={{margin:'5px'}}
                                onClick={() =>
                                  openEditModal(evaluation.id, department, member)
                                }
                              >
                                <EditNoteRoundedIcon />
                                Edit
                              </button>
                            </td>
                      </tr>
                    ))
                  )
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>
  <EditMemberModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  memberData={selectedMember}
  onSave={handleSave}
  evaluationId={selectedEvaluationId} // Pass evaluationId to modal
/>

     
     

      {/* Modal for format selection */}
{/* Modal for format selection */}
{isModalOpen && (
  <div className="modal-overlay" onClick={handleModalClose}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <h3 className="modal-heading">Select Report Format</h3>
      <button className="modal-button" onClick={() => handleFormatSelection("CSV")}>
        Download CSV
      </button>
      <button className="modal-button" onClick={() => handleFormatSelection("PDF")}>
        Download PDF
      </button>
      <button className="modal-close" onClick={handleModalClose}>
        ✖
      </button>
    </div>
  </div>
)}
</div>
  );
};

export default ViewEvaluations;
