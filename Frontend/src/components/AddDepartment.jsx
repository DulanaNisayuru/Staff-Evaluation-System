import React, { useState, useEffect } from "react";

const AddDepartment = () => {
  const [depName, setDepName] = useState("");
  const [existingDepartments, setExistingDepartments] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch existing departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/departments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
          },
        });
        if (response.ok) {
          const departments = await response.json();
          setExistingDepartments(departments.map((dept) => dept.dep_name.toLowerCase())); // Store names in lowercase for comparison
        } else {
          console.error("Failed to fetch departments.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if department already exists
    if (existingDepartments.includes(depName.toLowerCase())) {
      setMessage("Department already exists.");
      return;
    }

    const departmentData = { dep_name: depName };

    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
        },
        body: JSON.stringify(departmentData),
      });

      if (response.ok) {
        setMessage("Department added successfully!");
        setDepName(""); // Reset input
        // Refresh the list of existing departments
        setExistingDepartments((prev) => [...prev, depName.toLowerCase()]);
      } else {
        setMessage("Failed to add department.");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Department Name:</label>
          <input
            type="text"
            value={depName}
            onChange={(e) => setDepName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddDepartment;
