import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AllMarksByAss.css"; // Import the new CSS file
import Sidebar from "./Sidebar";
import HeaderImage from "./HeaderImage";

export default function AllMarksByAllAssessors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodFilter, setPeriodFilter] = useState(""); // State for Period filter
  const [assessorFilter, setAssessorFilter] = useState(""); // State for Assessor filter
  const [periods, setPeriods] = useState([]); // State for Period dropdown options
  const [assessors, setAssessors] = useState([]); // State for Assessor dropdown options
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the list of assessors
        const assessorsResponse = await fetch(
          "http://localhost:8080/api/v1/admin/assessors",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!assessorsResponse.ok) {
          throw new Error("Failed to fetch assessors");
        }

        const assessorsData = await assessorsResponse.json();
        setAssessors(assessorsData);

        // Fetch evaluations for each assessor
        const allEvaluations = [];
        const fetchEvaluations = async (assessors) => {
          for (const assessor of assessors) {
            const response = await fetch(
              `http://localhost:8080/api/v1/admin/evaluations/assessor/${encodeURIComponent(assessor.email)}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (response.ok) {
              const evaluations = await response.json();
              allEvaluations.push(...evaluations);
            }
          }

          setData(allEvaluations);
          // Extract periods for the dropdown
          const uniquePeriods = [
            ...new Set(allEvaluations.map((evaluation) => evaluation.period)),
          ];
          setPeriods(uniquePeriods);
        };

        fetchEvaluations(assessorsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredData = data.filter((evaluation) => {
    const matchesPeriod = periodFilter ? evaluation.period === periodFilter : true;
    const matchesAssessor =
      assessorFilter ? evaluation.assessor === assessorFilter : true;
    return matchesPeriod && matchesAssessor;
  });

  return (
    <div className="new-table-container">
      <Sidebar />

      <HeaderImage />
      <div className="new-table-content">
        
        <h1 className="new-table-heading">All Assessors' Evaluations</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="new-table-error">{error}</p>}

        {/* Dropdown for Period Filter */}
        <div className="dropdown">
          <label>Filter by Period: </label>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="">All Periods</option>
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Assessor Filter */}
        <div className="dropdown">
          <label>Filter by Assessor: </label>
          <select
            value={assessorFilter}
            onChange={(e) => setAssessorFilter(e.target.value)}
          >
            <option value="">All Assessors</option>
            {assessors.map((assessor) => (
              <option key={assessor.email} value={assessor.email}>
                {assessor.name} ({assessor.email})
              </option>
            ))}
          </select>
        </div>

        {!loading && !error && filteredData.length > 0 && (
          <div className="new-summary-table">
            <table className="new-table">
              <thead>
                <tr className="new-table-headers">
                  <th>Period</th>
                  <th>Assessor</th>
                  <th>Department Name</th>
                  <th>Member Name</th>
                  <th>Achievement Marks</th>
                  <th>Average Marks</th>
                  <th>Team Achievement Marks</th>
                  <th>Average Team Marks</th>
                </tr>
              </thead>
              <tbody className="new-table-body">
                {filteredData.map((evaluation) =>
                  evaluation.departments
                    ?.filter((department) => department.dep_name) // Filter out departments with null or empty dep_name
                    .map((department, departmentIndex) =>
                      department.members?.map((member, index) => (
                        <tr
                          key={`${evaluation.id || "evaluation"}-${department.dep_name || "department"}-${member.name || "member"}`}
                        >
                          {/* Display Period only once for the first row of each department */}
                          {index === 0 && (
                            <>
                              <td rowSpan={department.members.length}>
                                {evaluation.period || "N/A"}
                              </td>
                              <td rowSpan={department.members.length}>
                                {evaluation.assessor || "N/A"}
                              </td>
                              <td rowSpan={department.members.length}>
                                {department.dep_name || "N/A"}
                              </td>
                            </>
                          )}

                          <td>{member.name || "N/A"}</td>
                          <td>{member.achievementMarks || 0}</td>
                          <td>{member.average || 0}</td>
                          {index === 0 && department.teamValues && (
                            <>
                              <td rowSpan={department.members.length}>
                                {department.teamValues.achievementMarks || 0}
                              </td>
                              <td rowSpan={department.members.length}>
                                {department.teamValues.averageTeamMark.toFixed(2) || 0}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
