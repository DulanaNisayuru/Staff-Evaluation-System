import React, { useState, useEffect } from "react";
import './css/Modal.css'

const EditMemberModal = ({ isOpen, onClose, memberData, onSave }) => {
  // State for form fields
  const [newAchievementMarks, setNewAchievementMarks] = useState(0);
  const [newRemarks, setNewRemarks] = useState("");

  // Reset state whenever the modal opens with new member data
  useEffect(() => {
    if (memberData) {
      setNewAchievementMarks(memberData.achievementMarks || 0);
      setNewRemarks(memberData.remarks || "");
    }
  }, [memberData]);

  // Handle form submission
  const handleSubmit = () => {
    if (newAchievementMarks < 0) {
      alert("Achievement Marks cannot be negative.");
      return;
    }
   

    const updatedData = {
      dep_name: memberData?.depName,
      memberName: memberData?.name,
      newAchievementMarks,
      newRemarks,
    };

    onSave(updatedData); // Pass updated data to parent component
  };

  // If modal is not open, do not render anything
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-labelledby="modal-heading"
      aria-modal="true"
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <h3 id="modal-heading" className="modal-heading">
          Edit Member Data
        </h3>

        <div className="modal-field">
          <label htmlFor="achievementMarks">Achievement Marks</label>
          <input
            type="number"
            id="achievementMarks"
            value={newAchievementMarks}
            onChange={(e) => setNewAchievementMarks(Number(e.target.value))}
          />
        </div>

        <div className="modal-field">
          <label htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            value={newRemarks}
            onChange={(e) => setNewRemarks(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-button" onClick={handleSubmit}>
            Save Changes
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;
