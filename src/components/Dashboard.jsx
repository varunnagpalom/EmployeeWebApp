import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/employees");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(`Failed to fetch employees: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    navigate("/create-employee");
  };

  const handleEditEmployee = (employeeId) => {
    // Find the employee data and navigate to Edit Employee Page
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      navigate("/edit-employee", { state: { employee } });
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setDeleteLoading(true);
      setError(null);

      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        // Success - show modal and refresh employee list
        setShowSuccessModal(true);
        await fetchEmployees(); // Refresh the employee list
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(`Failed to delete employee. Please try again. ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Employee Management Portal</h1>
        <button className="create-employee-btn" onClick={handleCreateEmployee}>
          Create Employee
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading && <div className="loading">Loading employees...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && employees.length === 0 && (
          <div className="no-data">No data available</div>
        )}

        {!loading && !error && employees.length > 0 && (
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Date of Joining</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Manager ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{formatDate(employee.dateOfJoining)}</td>
                    <td>{employee.department}</td>
                    <td>{formatSalary(employee.salary)}</td>
                    <td>{employee.managerId}</td>
                    <td>
                      <span
                        className={`status ${employee.status
                          .toLowerCase()
                          .replace("_", "-")}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditEmployee(employee.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Employee Deleted Successfully</h2>
            <div className="modal-actions">
              <button
                className="modal-btn close-btn"
                onClick={handleCloseSuccessModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
