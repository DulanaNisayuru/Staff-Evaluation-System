import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import UserProfile from "./components/User/UserProfile";
import ProtectedRoute from "./ProtectedRoute";
import AssessmentTable from "./components/Evaluation";
import SignIn from "./components/SignIn";
import './App.css'
import MgrEvaluation from "./components/Manager/MgrEvaluation";
import AdminEvaluation from "./components/AdminEvaluation";
import ViewEvaluations from "./components/ViewEvaluations";
import MgrViewEvaluations from "./components/Manager/MgrViewEvaluations";
import DepartmentSummary from "./components/DepartmentSummary";
import ViewAssessments from "./components/ViewAssessment";
import AllMarksByAllAssessors from "./components/AllMarksByAss";
import AddPeriod from "./components/AddPeriod";
import Manager from "./components/Manager";
import UserEvaluation from "./components/User/UserEvaluations";
import { ToastContainer } from "react-toastify";
import AlertDialog from "./components/AlertDialog";
import AddDepartment from "./components/AddDepartment";
import UsersTable from "./components/User";

const App = () => {

  return (
    <div className="main">
      {/* <div className="main-header">
      <h1 className="main-h1"> Evaluating Our Staff members </h1>
      <h3 className="main-h3">VYS international Pvt(Ltd)</h3>
      </div> */}
      <Router>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/assignMarks" element={<AdminEvaluation />} />
        <Route path="/viewEvaluations" element={<ViewEvaluations/>} />
        <Route path="/view-assessments" element={<ViewAssessments />} />
        <Route path="/allMarksByAssessors" element={<AllMarksByAllAssessors />} />
        <Route path="/add-period" element={<AddPeriod />} />
        <Route path="/department" element={<AddDepartment />} />
        <Route path="/user" element={<UsersTable />} />
        
        <Route path="/mgrAssignMarks" element={<MgrEvaluation />} />
        <Route path="/mgrViewEvaluations" element={<MgrViewEvaluations/>} />
        <Route path="/" element={<Login />} />
        <Route
          path="/adminPage"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
              <ToastContainer/>
              <AlertDialog/>
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/mgrPage"
          element={
            <ProtectedRoute role="MANAGER">
              <MgrEvaluation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute role="USER">
              <UserProfile />
              
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </div>
  );
};

export default App;