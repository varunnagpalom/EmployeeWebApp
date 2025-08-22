import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditEmployee.css";

function EditEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeData = location.state?.employee;

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
    managerId: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const departments = ["HR", "IT", "Finance", "Sales", "Marketing"];
  const statusOptions = ["ACTIVE", "NOT_ACTIVE"];

  // Pre-fill form with employee data
  useEffect(() => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || "",
        department: employeeData.department || "",
        salary: employeeData.salary?.toString() || "",
        managerId: employeeData.managerId?.toString() || "",
        status: employeeData.status || "ACTIVE",
      });
    } else {
      // If no employee data, redirect to dashboard
      navigate("/");
    }
  }, [employeeData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the data for API call
      const submitData = {
        name: formData.name,
        department: formData.department,
        salary: parseFloat(formData.salary),
        managerId: parseInt(formData.managerId),
        status: formData.status,
      };

      const response = await fetch(`/api/employees/${employeeData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(`Failed to edit employee. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  if (!employeeData) {
    return (
      <div className="edit-employee-container">
        <div className="edit-employee-content">
          <h1>No Employee Data</h1>
          <p>Please select an employee from the dashboard to edit.</p>
          <button onClick={handleCancel} className="cancel-btn">
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-employee-container">
      <div className="edit-employee-content">
        <h1>Edit Employee</h1>

        {/* Display employee info that cannot be edited */}
        <div className="employee-info">
          <div className="info-item">
            <span className="info-label">Employee ID:</span>
            <span className="info-value">{employeeData.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Joining:</span>
            <span className="info-value">
              {new Date(employeeData.dateOfJoining).toLocaleDateString()}
            </span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerId">Manager ID</label>
            <input
              type="number"
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Employee Data Modified Successfully</h2>
            <div className="modal-actions">
              <button className="modal-btn go-back-btn" onClick={handleGoBack}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEmployee;
