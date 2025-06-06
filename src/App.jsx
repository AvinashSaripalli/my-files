// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Register from './Components/Register';
// import Login from './Components/Login';
// import Sidebar from './Components/Sidebar';
// import EmployeeSidebar from './Components/EmployeeSidebar';
// import HrSidebar from './Components/HrSidebar';
// import Workgroups from './Components/Workgroups';
// import Tasks from './Components/Tasks';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/sidebar" element={<Sidebar />} />
//         <Route path="/employeesidebar" element={<EmployeeSidebar />} />
//         <Route path="/hrsidebar" element={<HrSidebar />} />
//         <Route path="/workgroups" element={<Workgroups />} />
//         <Route path="/tasks/:partnerCompanyId" element={<Tasks />} />
//         <Route path="/" element={<Register />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
        {/* Public routes without sidebar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />

        {/* Routes with Sidebar */}
        <Route
          path="/*"
          element={
            <Sidebar>
              <Routes>
                <Route path="/workgroups" element={<Workgroups />} />
                <Route path="/tasks/:partnerCompanyId" element={<Tasks />} />
                {/* Add other routes that should be rendered with Sidebar */}
              </Routes>
            </Sidebar>
          }
        />

        {/* Other sidebar routes (if needed) */}
        <Route path="/employeesidebar" element={<EmployeeSidebar />} />
        <Route path="/hrsidebar" element={<HrSidebar />} />
      </Routes>
    </Router>
  );
}

export default App;
