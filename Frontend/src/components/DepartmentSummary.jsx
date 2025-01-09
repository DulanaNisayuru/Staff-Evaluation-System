import React, { useEffect, useState } from "react";
import './css/DepartmentSummary.css';
import MissingAssessors from "./MissingAssessors";
import './css/DepartmentSummary.css';

const DepartmentSummary = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [monthlyTargetData, setMonthlyTargetData] = useState(null);
  const [achievedTargetData,setAchievedTargetData]=useState(null);
  const [assessorCount, setAssessorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("All Periods");
  const [departmentUserCounts, setDepartmentUserCounts] = useState({});
  const token = localStorage.getItem("token");
  const [userCount, setUserCount] = useState(0);


  useEffect(() => {
    // Fetch evaluations data
    fetch("http://localhost:8080/api/v1/admin/evaluations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch evaluations");
        }
        return response.json();
      })
      .then((data) => {
        setEvaluations(data);
        // Determine the latest period from the fetched data
        const periods = [...new Set(data.map((evaluation) => evaluation.period))];
        const latestPeriod = periods.sort((a, b) => new Date(b) - new Date(a))[0];
        setSelectedPeriod(latestPeriod || null); // Default to latest period
        setLoading(false);
      })
      

      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch monthly target data
    fetch("http://localhost:8080/api/v1/admin/assessment", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch monthly target data");
        }
        return response.json();
      })
      .then((data) => {
        setMonthlyTargetData(data); 
        setAchievedTargetData(data);// Store monthly target data
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch assessor count data
    fetch("http://localhost:8080/api/v1/admin/assessors/count", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch assessor count");
        }
        return response.json(); // The response is a number, not an object.
      })
      .then((data) => {
        setAssessorCount(data); // Directly set the number since it's not inside an object
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [token]);


// Fetch user count and average marks
fetch("http://localhost:8080/api/v1/admin/user", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const users = data.filter(user => user.role === "USER");
    setUserCount(users.length);
  })
  .catch((err) => console.error("Error fetching user data:", err));


// Modify the useEffect where you fetch department users data
useEffect(() => {
  fetch("http://localhost:8080/api/v1/admin/department-users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch department users");
      }
      return response.json();
    })
    .then((data) => {
      if (data && typeof data === 'object') {  // Check if data is an object
        const departmentCounts = {};
        Object.keys(data).forEach((depName) => {
          departmentCounts[depName] = data[depName].length; // Get count of members for each department
        });
        setDepartmentUserCounts(departmentCounts);
        
        
      } else {
        console.error("Fetched data is not in expected format:", data);
      }
    })
    .catch((err) => {
      setError(err.message);
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


   // Handle period selection
   const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
    
  };

  const filteredEvaluations = selectedPeriod === "All Periods"
  ? evaluations // Include all evaluations if "All Periods" is selected
  : evaluations.filter((evaluation) => evaluation.period === selectedPeriod);

  // Get monthly target and achieved target for the selected period
  const monthlyTargetInfo = monthlyTargetData?.find(
    (item) => item.period === selectedPeriod
  ) || {};
  const achievedTargetInfo = achievedTargetData?.find(
    (item) => item.period === selectedPeriod
  ) || {};
  
  // Group evaluations by department
  const departmentsData = filteredEvaluations.reduce((acc, evaluation) => {
    
  
    evaluation.departments
      .filter((department) => {
        return department.dep_name; // Log filtered departments
      })
      .forEach((department) => {
  
        if (!acc[department.dep_name]) {
          acc[department.dep_name] = { totalMarks: 0, members: [], averageTeamMarks: 0 };
         
        }
  
        acc[department.dep_name].members.push(...department.members); // Collect members
       
  
        acc[department.dep_name].averageTeamMarks += department.teamValues.averageTeamMark; // Add to averageTeamMarks
       
  
        acc[department.dep_name].totalMarks += department.teamValues.totalMarks; // Add team total marks
       
      });
  
  
    return acc;
  }, {});

 
  

  // Prepare table data
  const tableData = Object.entries(departmentsData).map(([depName, data]) => {
    const totalScore=10;

    const totalAverageTeamMarks = data.averageTeamMarks; // Sum of averageTeamMarks across all evaluations
    const numberOfAssessors = assessorCount;

    const averageTeamMark = numberOfAssessors > 0 ? (totalAverageTeamMarks / numberOfAssessors).toFixed(2) : 0;

    // Achievement percentage calculation
    const achievementPercent =( (averageTeamMark / totalScore)*100);

    // Achievement allowance and other metrics
    const achievementAllowance = (achievedTargetInfo?.achievedTarget * 0.025).toFixed(2) || 0; // 2.5% of the monthly target
    // Allocated Allowance %
    
   const depUserCount = departmentUserCounts[depName]|| 0;
   
    const allocatedAllowancePercent = ((depUserCount / userCount) * 100).toFixed(2);

    // Allocated Allowance Amount
    const allocatedAllowanceAmount = ((allocatedAllowancePercent * achievementAllowance/100)).toFixed(2) ;

    // Achieved Allowance
    const achievedAllowance = (allocatedAllowanceAmount * (achievementPercent / 100)).toFixed(2);

    
    const numberOfPersons = departmentUserCounts[depName] || 0;
    

    // Personal Allowance Amount
    const personalAllowanceAmount = numberOfPersons > 0 ? (achievedAllowance / numberOfPersons).toFixed(2) : 0;

     

    return {
      depName,
     // totalAchievement,
      averageTeamMark,
      achievementPercent,
      achievementAllowance,
      monthlyTarget: monthlyTargetInfo?.monthlyTarget || 0,
      achievedTarget: monthlyTargetInfo?.achievedTarget || 0,
      allocatedAllowancePercent,
      allocatedAllowanceAmount,
      achievedAllowance,
      numberOfPersons,
      personalAllowanceAmount,
    };
  });

  // Calculate totals
  const totals = tableData.reduce(
    (acc, row) => {
      acc.averageTeamMark += parseFloat(row.averageTeamMark);
      acc.achievementPercent += row.achievementPercent;
      acc.achievementAllowance += parseFloat(row.achievementAllowance);
      acc.monthlyTarget += row.monthlyTarget;
      acc.achievedTarget += row.achievedTarget;
      acc.allocatedAllowancePercent += parseFloat(row.allocatedAllowancePercent);
      acc.allocatedAllowanceAmount += parseFloat(row.allocatedAllowanceAmount);
      acc.achievedAllowance += parseFloat(row.achievedAllowance);
      acc.numberOfPersons += row.numberOfPersons;
      acc.personalAllowanceAmount += parseFloat(row.personalAllowanceAmount);
      return acc;
    },
    {
      
      averageTeamMark: 0,
      achievementPercent: 0,
      achievementAllowance: 0,
      monthlyTarget: 0,
      achievedTarget: 0,
      allocatedAllowancePercent: 0,
      allocatedAllowanceAmount: 0,
      achievedAllowance: 0,
      numberOfPersons: 0,
      personalAllowanceAmount: 0,
    }
  );

  const totalExpectedCommissionToPay = tableData.reduce(
    (sum, row)=>sum + parseFloat(row.allocatedAllowanceAmount),
    0
  ).toFixed(2);
  const achievementCommission = tableData.reduce(
    (sum, row) => sum + parseFloat(row.achievedAllowance),
    0
  ).toFixed(2);

  const balanceAmountForWelfare = (
    parseFloat(totalExpectedCommissionToPay) - parseFloat(achievementCommission)
  ).toFixed(2);


  const formatCurrency = (value) =>
    new Intl.NumberFormat("si-LK", {
      style: "currency",
      currency: "LKR",
    }).format(value);
   

  return (
    
    <div className="depSummary-main">
    <div className="dep-summary">
      <div className="dep-head">      
        
        <div className="dep-head-1">
          <div className="dep-head-2">

            <h1 className="dep-sum-head">Department Summary</h1>
    

            {/* Dropdown for selecting period */}
            <div className="dep-sum-missing">
            <div className="dropdown">
            <label htmlFor="period">Select Period:</label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={handlePeriodChange}
                style={{ margin: "10px", padding: "5px" }}
              >
                {[...new Set(evaluations.map((evaluation) => evaluation.period))].map(
                  (period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  )
                )}
              </select>
            </div>
            <MissingAssessors period = {selectedPeriod}/>
              
            </div>
        </div>
        </div>
    <div style={{ marginBottom: "20px", padding: "10px" }}>
        <div className="monthly-target-details">
          
          <div className="dept-stat-card">
          <div className="dept-stat-label">
              <span>Total Expected Commission to Pay</span>
            </div>
            <div className="dept-stat-value">{formatCurrency(totalExpectedCommissionToPay)}</div> 
          </div>

          <div className="dept-stat-card">
          <div className="dept-stat-label">
              <span>Achieved Commission</span>
            </div>
            <div className="dept-stat-value">{formatCurrency(achievementCommission)}</div>
          </div>

          <div className="dept-stat-card">
          <div className="dept-stat-label">
              <span>Balance Amount for Welfare</span>
            </div>
            <div className="dept-stat-value">{formatCurrency(balanceAmountForWelfare)}</div>
          </div>

          <div className="dept-stat-card">
          <div className="dept-stat-label">
              <span>Monthly Target</span>
            </div>
            <div className="dept-stat-value">{formatCurrency(monthlyTargetInfo?.monthlyTarget || "N/A")}</div>
            
          </div>
          <div className="dept-stat-card">
          <div className="dept-stat-label">
              <span>Achieved Target</span>
            </div>
            <div className="dept-stat-value">{formatCurrency(monthlyTargetInfo?.achievedTarget || "N/A")}</div>
            
          </div>
          
        </div>

  </div>
  </div>

     
      {/* Display table */}
      <div className="dep-summary-tbl"></div>
      <table className="dep-table">
        <thead>
          <tr className="table-headers">
            <th>Department</th>
            {/* <th>Total Score</th> */}
            {/* <th>Total Achievement</th> */}
            <th>Average Team Mark (0 - 10)</th>
            <th>Achievement (%)</th>
            <th>Achievement Allowance Against Target</th>
            <th>Allocated Allowance (%)</th>
            <th>Allocated Allowance Amount</th>
            <th>Achieved Allowance</th>
            <th>Number of Persons</th>
            <th>Personal Allowance Amount</th>
          </tr>
        </thead>
       
       <tbody className="dep-table-body">
          {tableData.map((row, index) => (
            <tr key={index}>
              <td style={{
                fontWeight:"bold",
                fontSize:"15px"
              }}>{row.depName}</td>
              {/* <td>{row.totalScore}</td> */}
              {/* <td>{row.totalAchievement}</td> */}
              <td>{row.averageTeamMark}</td>
              <td>{row.achievementPercent.toFixed(2)}%</td>
              <td>{formatCurrency(row.achievementAllowance)}</td>
              <td>{row.allocatedAllowancePercent}%</td>
              <td>{formatCurrency(row.allocatedAllowanceAmount)}</td>
              <td>{formatCurrency(row.achievedAllowance)}</td>
              <td>{row.numberOfPersons}</td>
              <td>{formatCurrency(row.personalAllowanceAmount)}</td>
            </tr>
          ))}
          {/* Totals Row */}
          <tr style={{ fontWeight: "bold" }}>
            <td>Total</td>
            <td></td>
            <td>{totals.averageTeamMark.toFixed(2)}</td>
            <td>{(totals.achievementPercent / tableData.length).toFixed(2)}%</td>
            <td></td>
            <td>{(totals.allocatedAllowancePercent ).toFixed(2)}%</td>
            <td>{formatCurrency(totals.allocatedAllowanceAmount)}</td>
            <td>{formatCurrency(totals.achievedAllowance)}</td>
            <td>{(totals.numberOfPersons)}</td>
            <td></td>
          </tr>
        </tbody> 
      </table>
      </div>
    </div>

  );
};

export default DepartmentSummary;
