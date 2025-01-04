import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MissingAssessors = ({period}) => {
    const [assessors, setAssessors] = useState([]); // Stores the list of missing assessors
    const [error, setError] = useState(""); // Stores any error message
    const navigate = useNavigate(); // To handle navigation


    // Fetch missing assessors based on the selected period
        const fetchMissingAssessors = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/"); // Redirect to login page if no token is found
            return;
        }

        try {
            if (!period) {
                setError("Please select a valid period.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/v1/admin/missing-assessors?period=${period}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass the token in the request header
                },
            });

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setAssessors(response.data); // Display missing assessors
                setError(""); // Clear any previous error
            } else {
                setAssessors([]); // Clear previous assessors if none found
                setError("No missing assessors for the selected period.");
            }
        } catch (error) {
            setError("An error occurred while fetching the data.");
        }
    };

    // Call fetchPeriods when the component is mounted
    useEffect(() => {
        if(period){
            fetchMissingAssessors();
        }
        
    }, [period]);

    

    return (
        <div>
            
            {/* Display missing assessors */}
            
     
                
                {assessors.length > 0 ? (
                    <ul>
                         <h3>Unmarked Assessors </h3>
                        {assessors.map((assessor) => (
                           
                            <li key={assessor.id} style={{ color: 'red' }}>
                             {assessor.name} {/* Display missing assessor name in red */}
                            </li>
                        ))}
                    </ul>
                ) : null} {/* Removed the "No missing assessors" message */}
            
        </div>
    );
};

export default MissingAssessors;
