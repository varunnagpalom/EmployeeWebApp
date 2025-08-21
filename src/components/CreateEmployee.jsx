import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateEmployee.css";

function CreateEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: "",
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

  const clearForm = () => {
    setFormData({
      name: "",
      dateOfJoining: "",
      department: "",
      salary: "",
      managerId: "",
      status: "ACTIVE",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the data for API call
      const submitData = {
        name: formData.name,
        dateOfJoining: new Date(formData.dateOfJoining).toISOString(),
        department: formData.department,
        salary: parseFloat(formData.salary),
        managerId: parseInt(formData.managerId),
        status: formData.status,
      };

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.status === 201) {
        setShowSuccessModal(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(`Failed to create employee. Please try again. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewEmployee = () => {
    setShowSuccessModal(false);
    clearForm();
  };

  const handleGoBack = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="create-employee-container">
      <div className="create-employee-content">
        <h1>Create Employee</h1>

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
            <label htmlFor="dateOfJoining">Date of Joining</label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
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
              {loading ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Employee Created Successfully</h2>
            <div className="modal-actions">
              <button
                className="modal-btn create-new-btn"
                onClick={handleCreateNewEmployee}
              >
                Create New Employee
              </button>
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

export default CreateEmployee;
