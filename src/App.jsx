import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateEmployee from "./components/CreateEmployee";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
