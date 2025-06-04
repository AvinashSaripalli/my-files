import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import EmployeeSidebar from './Components/EmployeeSidebar';
import HrSidebar from './Components/HrSidebar';
import Workgroups from './Components/Workgroups';
import Tasks from './Components/Tasks';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/employeesidebar" element={<EmployeeSidebar />} />
        <Route path="/hrsidebar" element={<HrSidebar />} />
        <Route path="/workgroups" element={<Workgroups />} />
        <Route path="/tasks/:partnerCompanyId" element={<Tasks />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
