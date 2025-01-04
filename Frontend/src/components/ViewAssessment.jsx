import React, { useState, useEffect } from 'react';
import EditAssessmentModal from './EditAssessmentModal';
import AddPeriod from './AddPeriod';
import HeaderImage from './HeaderImage';
import Sidebar from './Sidebar';
import AlertDialog from './AlertDialog';  // Import the AlertDialog component
import './css/ViewAssessment.css';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

const ViewAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/admin/assessment', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAssessments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load assessments. Please try again later.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleEditClick = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (assessment) => {
    setAssessmentToDelete(assessment); // Set the assessment to be deleted
    setIsAlertDialogOpen(true); // Open the confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/assessment/${assessmentToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setAssessments((prevAssessments) =>
          prevAssessments.filter((a) => a.id !== assessmentToDelete.id)
        );
        toast.success('Period Deleted'); // Show success toast
      } else {
        throw new Error('Failed to delete assessment');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting the assessment'); // Show error toast if deletion fails
    } finally {
      setIsAlertDialogOpen(false); // Close the alert dialog
    }
  };

  const handleDeleteCancel = () => {
    setIsAlertDialogOpen(false); // Close the alert dialog without deleting
  };

  if (loading) {
    return (
      <div className="center">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ass-main">
      <Sidebar />
      <div className="ass-sub-main">
        <HeaderImage />
        <div className="ass-sub">
          <AddPeriod />

          <table className="assessment-table">
            <thead className="assessment-table-head">
              <tr>
                <th className="assessment-table-header">Period</th>
                <th className="assessment-table-header">Date</th>
                <th className="assessment-table-header">Monthly Target</th>
                <th className="assessment-table-header">Achieved Target</th>
                <th className="assessment-table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="assessment-table-body">
              {assessments.map((assessment) => (
                <tr className="assessment-table-row" key={assessment.id}>
                  <td className="assessment-table-cell">{assessment.period}</td>
                  <td className="assessment-table-cell">{assessment.date}</td>
                  <td className="assessment-table-cell">{assessment.monthlyTarget}</td>
                  <td className="assessment-table-cell">{assessment.achievedTarget}</td>
                  <td className="assessment-table-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(assessment)}
                    >
                      <EditNoteRoundedIcon /> Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(assessment)}
                    >
                      <HighlightOffRoundedIcon /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
            <EditAssessmentModal
              assessment={selectedAssessment}
              onSave={(updatedAssessment) => {
                fetch(`http://localhost:8080/api/v1/admin/assessment/${updatedAssessment.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify(updatedAssessment),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    setAssessments((prevAssessments) =>
                      prevAssessments.map((assessment) =>
                        assessment.id === data.id ? data : assessment
                      )
                    );
                    setIsModalOpen(false);
                  })
                  .catch((err) => {
                    setError('Failed to save changes. Please try again.');
                    console.error(err);
                  });
              }}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {isAlertDialogOpen && (
            <AlertDialog
              open={isAlertDialogOpen}
              onConfirm={handleDeleteConfirm} // Pass handleDeleteConfirm to the AlertDialog
              onCancel={handleDeleteCancel} // Pass handleDeleteCancel to the AlertDialog
              message="Are you sure you want to delete this assessment?"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAssessments;
