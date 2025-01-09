import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import HeaderImage from './HeaderImage';
import './css/AddPeriod.css';
import Table from './Table';

export default function AddPeriod() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState('');
  const [achievedTarget, setAchievedTarget] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmitForm = () => {
    const formData = { startDate, endDate, monthlyTarget, achievedTarget };
    fetch("http://localhost:8080/api/v1/admin/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();

        if (data.id) {
          toast.success('Assessment period successfully saved!');
          setStartDate('');
          setEndDate('');
          setMonthlyTarget('');
          setAchievedTarget('');

        } else {
          toast.error('Failed to save assessment period.');
        }
      })
      .catch((error) => {
        toast.error('An error occurred. Please try again.');
        console.error('Error:', error);
      });
  };

  return (
    <div className="period-main">
      <ToastContainer />
      <div className="period-sub modern-form">
        <h3 className="form-heading">Add Monthly Assessment Period</h3>
        <div className="col">
          <div className="col1">
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div className="col2">
            <div className="form-group">
              <label htmlFor="monthlyTarget">Monthly Target:</label>
              <input
                type="number"
                id="monthlyTarget"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="form-input"
                placeholder="Enter monthly target"
              />
            </div>
            <div className="form-group">
              <label htmlFor="achievedTarget">Achieved Target (Optional):</label>
              <input
                type="number"
                id="achievedTarget"
                value={achievedTarget}
                onChange={(e) => setAchievedTarget(e.target.value)}
                className="form-input"
                placeholder="Enter achieved target"
              />
            </div>
          </div>
        </div>
        <button className="modern-button" onClick={handleSubmitForm}>
          Save
        </button>
      </div>
    </div>
  );
}
