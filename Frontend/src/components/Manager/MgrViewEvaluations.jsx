import React, { useState, useEffect } from 'react';
import MgrSidebar from './MgrSidebar';
import MgrHeaderImage from './MgrHeaderImage';
import '../css/MgrViewEvaluation.css';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import EditMemberModal from '../EditMemberModal';



const ManagerViewEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("All Periods"); // For selected period
  const [managerEmail, setManagerEmail] = useState(""); // Store logged-in manager's email
  const token = localStorage.getItem("token");
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(""); 
  const [selectedMember, setSelectedMember] = useState(null); // State to track the member being edited
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);
 
  
  useEffect(() => {
    // Fetch logged-in manager's profile
    fetch('http://localhost:8080/api/v1/manager/profile', {
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

    // Fetch evaluations data
    fetch('http://localhost:8080/api/v1/manager/evaluations', {
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
  const openEditModal = (evaluationId, department, member) => {
    console.log("Setting evaluationId:", evaluationId); // Debugging
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
  
    fetch(`http://localhost:8080/api/v1/manager/${selectedEvaluationId}`, {
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
        alert("Member updated successfully!")// Close modal
      })
      .catch((error) => console.error("Error updating:", error));
  };
  
  
  return (
    <div className='eval-main'>
  <MgrSidebar />

  <div className="eval-sub">
    <MgrHeaderImage />
    <h1>Your Evaluations</h1>

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

    {/* Display the table */}
    <div>
      {Object.keys(evaluationsGroupedByPeriod).map((period) => (
        <div key={period}>
          <h2 className="eval-period-header">{period}</h2>
          <table className="eval-table">
            <thead >
              <tr className="eval-tbl-header">
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
                              <li>Average Achievement: {department.teamValues.averageAchievement}%</li>
                              <li>Average Team Mark: {department.teamValues.averageTeamMark}</li>
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
    <EditMemberModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  memberData={selectedMember}
  onSave={handleSave}
  evaluationId={selectedEvaluationId} // Pass evaluationId to modal
/>
  </div>
</div>
  );
};

export default ManagerViewEvaluations;
