import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateEmployee from "./components/CreateEmployee";
import EditEmployee from "./components/EditEmployee";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee" element={<EditEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
