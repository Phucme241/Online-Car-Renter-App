import React, { useEffect, useState } from "react";
import ChooseBar from "../../modules/components/ChooseBarAdmin";
import "../../styles/admin/UserManagement.css";
import defaultAvatar from "../../assets/img/user.png";
import Loader from "../../modules/components/Loader";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const usersPerPage = 3;
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/account");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();


        const activeUsers = data.filter((user) => user.Status === true);
        setUsers(activeUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewFull = (user) => {
    setSelectedUser(user);
  };


  const filteredUsers = users.filter((user) => {
    return selectedRole ? user.Role === parseInt(selectedRole) : true;
  });


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleDeleteUser = async (id, UserName, Role) => {

    if (Role === 1) {
      alert("Admin accounts cannot be deactivated.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate ${UserName}?`
    );

    if (confirmDelete) {
      setIsDeleting(true); 
      try {
        const response = await fetch(
          `http://localhost:5000/api/deactivate-user/${id}`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          alert(`${UserName} has been deactivated.`);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } else {
          console.error("Failed to deactivate user");
        }
      } catch (err) {
        console.error("Error deactivating user:", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCloseInfo = () => {
    setSelectedUser(null);
  };


  if (loading) return <Loader />;

 
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="AllPage">
      <div className="LeftSide">
        <div className="Bar">
          <ChooseBar />
        </div>
      </div>
      <div className="RightSide">
        <div className="manage-user-container">
          <h1 className="title">Manage Users</h1>

          <div className="filter-container">
            <label htmlFor="roleFilter">Filter by Role:</label>
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="1">Admin</option>
              <option value="3">Customer</option>
              <option value="2">Car Owner</option>
            </select>
          </div>

          <div className="user-list">
            {currentUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <img
                    className="user-avatar"
                    src={user.Avatar || defaultAvatar}
                    alt={`${user.UserName}'s avatar`}
                  />
                  <p>
                    <strong>Username:</strong> {user.UserName}
                  </p>
                </div>
                <div className="user-actions">
                  <button
                    className="view-btn"
                    onClick={() => handleViewFull(user)}
                  >
                    View
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleDeleteUser(user.id, user.UserName, user.Role)
                    }
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            usersPerPage={usersPerPage}
            totalUsers={filteredUsers.length}
            currentPage={currentPage}
            paginate={paginate}
          />

          {selectedUser && (
            <div className="user-details-modal">
              <div className="user-details-content">
                <button className="close-modal-btn" onClick={handleCloseInfo}>
                  Close
                </button>
                <div className="user-details-left">
                  <img
                    src={selectedUser.Avatar || defaultAvatar}
                    alt={selectedUser.UserName}
                    className="user-details-avatar"
                  />
                </div>
                <div className="user-details-right">
                  <h2>{selectedUser.UserName}</h2>
                  <p>
                    <strong>Email:</strong> {selectedUser.Email}
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {selectedUser.Role === 1
                      ? "Admin"
                      : selectedUser.Role === 2
                      ? "Customer"
                      : "Car Owner"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedUser.Address || "No address provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            onClick={() => paginate(currentPage - 1)}
            className="page-link"
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === pageNumbers.length ? "disabled" : ""
          }`}
        >
          <button
            onClick={() => paginate(currentPage + 1)}
            className="page-link"
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default UserManagement;
