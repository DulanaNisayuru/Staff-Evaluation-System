import React, { useState } from 'react';
import './css/EditAssessmentModal.css';

const EditAssessmentModal = ({ assessment, onSave, onClose }) => {
  const [monthlyTarget, setMonthlyTarget] = useState(assessment?.monthlyTarget || '');
  const [achievedTarget, setAchievedTarget] = useState(assessment?.achievedTarget || '');

  const handleSave = () => {
    const updatedAssessment = {
      ...assessment,
      monthlyTarget,
      achievedTarget,
    };
    onSave(updatedAssessment);
  };

  return (
      
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ✖
          </button>
          <h2>Edit Assessment</h2>
          <div className="field">
            <label>Period:</label>
            <span>{assessment?.period || 'N/A'}</span>
          </div>
          <div className="field">
            <label>Monthly Target:</label>
            <input
              type="number"
              value={monthlyTarget}
              onChange={(e) => setMonthlyTarget(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Achieved Target:</label>
            <input
              type="number"
              value={achievedTarget}
              onChange={(e) => setAchievedTarget(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>

  );
};

export default EditAssessmentModal;
