import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks"; 
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/EditTask";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/tasks" element={<Tasks />} />
       <Route path="/tasks/new" element={<CreateTask />} />
       <Route path="/tasks/edit/:id" element={<EditTask />} />
       
    </Routes>
  );
}

export default AppRoutes;