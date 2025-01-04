import React, { useEffect, useState } from "react";
import "./css/User.css";
import HeaderImage from "./HeaderImage";
import Sidebar from "./Sidebar";
import {
  EditNoteRounded,
  HighlightOffRounded,
} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';


const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/admin/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError("Failed to fetch users. Please check your API.");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by role, department, and search query
  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        (roleFilter ? user.role === roleFilter : true) &&
        (departmentFilter ? user.dep_name === departmentFilter : true) &&
        (searchQuery
          ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
          : true)
      );
    });
    setFilteredUsers(filtered);
  }, [roleFilter, departmentFilter, searchQuery, users]);

  // Handle Edit
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Handle Update
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/user/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingUser), // Send the updated user data
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null); // Exit editing mode
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(users.filter((user) => user.id !== id)); // Remove user by .id
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "220px" }} className="users-table-container">
        <HeaderImage />
        <div className="users-table-content">
          <h2 className="users-table-title">All Users</h2>
          {error && <p className="error-message">{error}</p>}

          {/* Search Bar */}
          
          <div className="search-bar-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-bar2"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          {/* Filters */}
          <div className="dropdown">
            <select
              className="dropdown"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Filter by Role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
            <select
              className="dropdown"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">Filter by Department</option>
              {Array.from(
                new Set(users.map((user) => user.dep_name))
              ).map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.dep_name}</td>
                  <td>
                    <div style={{ display: "flex" }}>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        <EditNoteRounded
                          style={{
                            padding: "2px",
                            paddingRight: "3px",
                            marginBottom: "-8px",
                          }}
                        />
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        <HighlightOffRounded
                          style={{ padding: "2px", marginBottom: "-7px" }}
                        />{" "}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <div className="edit-form">
              <h3>Edit User</h3>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                placeholder="Email"
              />
              <select
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
              </select>
              <input
                type="text"
                value={editingUser.dep_name}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    dep_name: e.target.value,
                  })
                }
                placeholder="Department"
              />
              <button onClick={handleUpdate}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
