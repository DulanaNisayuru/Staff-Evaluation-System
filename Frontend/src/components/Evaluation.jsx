import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import "./css/Evaluation.css"
const EvaluationsChart = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Retrieve JWT token

  useEffect(() => {
    // Fetch evaluations data from the server
    fetch('http://localhost:8080/api/v1/admin/evaluations', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEvaluations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div class="center">
    <div class="loader"></div>
        </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Flatten data for the detailed table
  const detailedTableData = [];
  evaluations.forEach((evaluation) => {
    evaluation.departments.forEach((department) => {
      department.members.forEach((member) => {
        detailedTableData.push({
          assessor: evaluation.assessor,
          memberName: member.name,
          achievementMarks: member.achievementMarks,
          departmentName: department.dep_name,
        });
      });
    });
  });

  // Summarize data for the summary table
  const summaryDataMap = {};
  detailedTableData.forEach((row) => {
    const key = `${row.memberName}-${row.departmentName}`;
    if (!summaryDataMap[key]) {
      summaryDataMap[key] = {
        memberName: row.memberName,
        departmentName: row.departmentName,
        totalAchievementMarks: 0,
        assessorsCount: 0,
      };
    }
    summaryDataMap[key].totalAchievementMarks += row.achievementMarks;
    summaryDataMap[key].assessorsCount += 1; // Increment the count of assessors
  });

  // Convert summary map to array and calculate average marks
  const summaryTableData = Object.values(summaryDataMap).map((data) => ({
    ...data,
    avgAchievementMarks: (data.totalAchievementMarks / data.assessorsCount).toFixed(2),
  }));



  return (
    <div className='evaluation-main'>
        <div className="evaluation-sub">
      <h1>My Evaluations</h1>
     
      
      {/* Summary Table */}
      <h2>Summary Table</h2>
      <table border="1" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Department</th>
            <th>Sum of Achievement Marks</th>
            <th>Average Marks</th>
          </tr>
        </thead>
        <tbody>
          {summaryTableData.map((row, index) => (
            <tr key={index}>
              <td>{row.memberName}</td>
              <td>{row.departmentName}</td>
              <td>{row.totalAchievementMarks}</td>
              <td>{row.avgAchievementMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      
      </div>
    </div>
  );
};

export default EvaluationsChart;
