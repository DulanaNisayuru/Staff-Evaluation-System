// import React, { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';

// const UserEvaluation = () => {
//   const [period, setPeriod] = useState(''); // Default period
//   const [periods, setPeriods] = useState([]); // For storing periods
//   const [userEvaluation, setUserEvaluation] = useState(null);
//   const [teamValues, setTeamValues] = useState(null); // For storing team values
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
//   const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage
//   const [assessorCount, setAssessorCount] = useState(0);

//   // Fetch available periods from the backend
//   useEffect(() => {
//     const fetchPeriods = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/v1/users/evaluations', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           const periodsArray = data.map((item) => item.period); // Extract periods
//           const uniquePeriods = [...new Set(periodsArray)]; // Ensure uniqueness
//           setPeriods(uniquePeriods);
//         } else {
//           setError('Error fetching periods');
//           console.error('Error fetching periods:', response.status, response.statusText);
//         }
//       } catch (error) {
//         setError('An error occurred while fetching the periods');
//         console.error('Error fetching periods:', error);
//       }
//     };
  
//     fetchPeriods();
//   }, [token]);
  

//   // Fetch user evaluation data for the selected period
//   useEffect(() => {
//     if (period) {
//       const fetchEvaluationData = async () => {
//         try {
//           const response = await fetch(`http://localhost:8080/api/v1/users/marks?period=${period}`, {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });

//           if (response.ok) {
//             const data = await response.json();
//             setUserEvaluation(data);
//             setError(null);
//           } else {
//             setError('Error fetching evaluation data');
//             console.error('Error fetching evaluation data:', response.status, response.statusText);
//           }
//         } catch (error) {
//           setError('An error occurred while fetching the evaluation data');
//           console.error('Error fetching evaluation data:', error);
//         }
//       };

//       fetchEvaluationData();
//     }
//   }, [period, token]);

  




  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  
  //   if (token && period) {
  //     try {
  //       // Decode the token and log the entire decoded object
  //       const decodedToken = jwtDecode(token);
  //       console.log('Decoded Token:', decodedToken); // Log the entire decoded token
  
  //       // Try accessing the email field, assuming it's directly available
  //       const email = decodedToken.email || decodedToken.sub; // Use `sub` if `email` is not found
  //       console.log('Decoded Email:', email);
  
  //       if (email) {
  //         const fetchTeamValues = async () => {
  //           try {
  //             const url = `http://localhost:8080/api/v1/users/team-values?email=${email}&period=${period}`;
  //             console.log('Fetching team values from:', url);
  
  //             const response = await fetch(url, {
  //               method: 'GET',
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 'Content-Type': 'application/json',
  //               },
  //             });
  
  //             if (response.ok) {
  //               const data = await response.json();
  //               console.log('Fetched team values:', data);
  //               setTeamValues(data);
  //             } else {
  //               setError('Error fetching team values');
  //               console.error('Error fetching team values:', response.status, response.statusText);
  //             }
  //           } catch (error) {
  //             setError('An error occurred while fetching the team values');
  //             console.error('Error fetching team values:', error);
  //           }
  //         };
  
  //         fetchTeamValues();
  //       } else {
  //         console.log('No email found in the token');
  //       }
  //     } catch (err) {
  //       console.error('Error decoding token:', err);
  //       setError('Error decoding token');
  //     }
  //   } else {
  //     console.log('Missing period or token');
  //   }
  // }, [period, token]);
  

//   // Fetch assessor count
//   useEffect(() => {
//     fetch('http://localhost:8080/api/v1/users/assessors/count', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch assessor count');
//         }
//         return response.json(); // The response is a number, not an object
//       })
//       .then((data) => {
//         setAssessorCount(data); // Directly set the number
//       })
//       .catch((err) => {
//         setError(err.message);
//         console.error('Error fetching assessor count:', err);
//       });
//   }, [token]);

//   // Calculate achievement marks if data is available
//   const achievementMarks =
//     userEvaluation && assessorCount > 0
//       ? (userEvaluation.achievementMarks / assessorCount).toFixed(2)
//       : 0;

//   const average =
//     userEvaluation && assessorCount > 0
//       ? ((userEvaluation.average / assessorCount) * 100).toFixed(2)
//       : 0;

      

//   return (
//     <div>
//       <h1>User Evaluation</h1>

//       <div>
//         <label>Select Evaluation Period: </label>
//         <select onChange={(e) => setPeriod(e.target.value)} value={period}>
//           {periods.length > 0 ? (
//             periods.map((p, index) => (
//               <option key={index} value={p}>
//                 {p}
//               </option>
//             ))
//           ) : (
//             <option value="">No periods available</option>
//           )}
//         </select>
//       </div>

//       {error && <div style={{ color: 'red' }}>{error}</div>}

//       {userEvaluation ? (
//         <div>
//          <p>Total Marks:10</p>
//           <p>Achievement Marks: {achievementMarks}</p>
//           <p>Average: {average}%</p>
//           <p>Remarks: {userEvaluation.remarks}</p>
//         </div>
//       ) : (
//         <div>Loading evaluation data...</div>
//       )}

//       {period && !teamValues ? (
//         <div>Loading team values...</div>
//       ) : (
//         teamValues && (
//           <div>
//             <h2>Your Team Values</h2>
            
//             <p>
//             Total Achievement Marks: {teamValues.achievementMarks}
//             </p>

//             <p>Average Achievement: {teamValues.averageAchievement}%</p>
//             <p>Average Team Mark: {teamValues.averageTeamMark}</p>
            
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default UserEvaluation;
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { jwtDecode } from 'jwt-decode';

const UserEvaluation = () => {
  const [period, setPeriod] = useState(''); // Default period
  const [periods, setPeriods] = useState([]); // For storing periods
  const [userEvaluation, setUserEvaluation] = useState(null);
  const [teamValues, setTeamValues] = useState(null); // For storing team values
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
  const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage
  const [assessorCount, setAssessorCount] = useState(0);

  // Fetch available periods from the backend
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/users/evaluations', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const periodsArray = data.map((item) => item.period); // Extract periods
          const uniquePeriods = [...new Set(periodsArray)]; // Ensure uniqueness
          setPeriods(uniquePeriods);

          // Automatically select the first available period if none is selected
          if (!period && uniquePeriods.length > 0) {
            setPeriod(uniquePeriods[0]);
          }
        } else {
          setError('Error fetching periods');
        }
      } catch (error) {
        setError('An error occurred while fetching the periods');
      }
    };

    fetchPeriods();
  }, [token, period]); // Adding 'period' to ensure fetch is triggered on period change

  // Fetch user evaluation data for the selected period
  useEffect(() => {
    if (period) {
      const fetchEvaluationData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/users/marks?period=${period}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserEvaluation(data);
            setError(null);
          } else {
            setError('Error fetching evaluation data');
          }
        } catch (error) {
          setError('An error occurred while fetching the evaluation data');
        }
      };

      fetchEvaluationData();
    }
  }, [period, token]); // Trigger this effect when 'period' or 'token' changes

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token && period) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email || decodedToken.sub;
  
        if (email) {
          const fetchTeamValues = async () => {
            try {
              const url = `http://localhost:8080/api/v1/users/team-values?email=${email}&period=${period}`;
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
  
              if (response.ok) {
                const data = await response.json();
                setTeamValues(data);
              } else {
                setError('Error fetching team values');
              }
            } catch (error) {
              setError('An error occurred while fetching the team values');
            }
          };
  
          fetchTeamValues();
        }
      } catch (err) {
        setError('Error decoding token');
      }
    }
  }, [period, token]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/users/assessors/count', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAssessorCount(data);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const achievementMarks =
    userEvaluation && assessorCount > 0
      ? (userEvaluation.achievementMarks / assessorCount).toFixed(1)
      : 0;

  const average =
    userEvaluation && assessorCount > 0
      ? ((userEvaluation.average / assessorCount) * 100).toFixed(2)
      : 0;

  return (
    <div style={{ padding: '20px' }}>
      <div className="dropdown" style={{ marginTop: '-50px' }}>
        <label>Select Evaluation Period: </label>
        <select onChange={(e) => setPeriod(e.target.value)} value={period}>
          {periods.length > 0 ? (
            periods.map((p, index) => (
              <option key={index} value={p}>
                {p}
              </option>
            ))
          ) : (
            <option value="">No periods available</option>
          )}
        </select>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div
        className="all-values"
        style={{
          display: 'flex',
          gap: '60px',
          padding: '20px',
        }}
      >
        {userEvaluation ? (
          <div className="achieved-score" style={{ display: 'flex', gap: '60px' }}>
            <div style={{ width: '200px', height: '200px' }}>
              <CircularProgressbar
                value={achievementMarks}
                maxValue={10} // Assuming the max achievement marks is 10
                text={`${achievementMarks}`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: '#4caf50',
                  textColor: '#000',
                  pathTransitionDuration: 2, // Add animation duration
                  pathTransition: 'stroke-dashoffset 0.5s ease 0s', // Animation timing
                })}
              />
              <p style={{ textAlign: 'center' }}>Total Achieved Score</p>
            </div>

            <div style={{ width: '200px', height: '200px' }}>
              <CircularProgressbar
                value={average}
                maxValue={100}
                text={`${average}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: '#ff9800',
                  textColor: '#000',
                  pathTransitionDuration: 2, // Add animation duration
                  pathTransition: 'stroke-dashoffset 0.5s ease 0s', // Animation timing
                })}
              />
              <p style={{ textAlign: 'center' }}>Average</p>
            </div>
          </div>
        ) : (
          <div>Loading evaluation data...</div>
        )}

        {period && !teamValues ? (
          <div>Loading team values...</div>
        ) : (
          teamValues && (
            <div style={{ display: 'flex', gap: '60px' }}>
              <div style={{ width: '200px' }}>
                <CircularProgressbar
                  value={teamValues.achievementMarks || 0}
                  maxValue={100}
                  text={`${teamValues.achievementMarks || 'N/A'}`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: `#2196f3`,
                    textColor: '#000',
                    pathTransitionDuration: 2, // Add animation duration
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s', // Animation timing
                  })}
                />
                <p style={{ textAlign: 'center' }}>Team Average Achievement</p>
              </div>
              <div style={{ width: '200px' }}>
                <CircularProgressbar
                  value={teamValues.averageTeamMark || 0}
                  maxValue={100}
                  text={`${teamValues.averageTeamMark || 'N/A'}`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: `#2196f3`,
                    textColor: '#000',
                    pathTransitionDuration: 2, // Add animation duration
                    pathTransition: 'stroke-dashoffset 0.5s ease 0s', // Animation timing
                  })}
                />
                <p style={{ textAlign: 'center' }}>Average Team Mark</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserEvaluation;
