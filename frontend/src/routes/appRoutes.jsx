import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks"; 
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/EditTask";
import CreateProject from "../pages/createProject";
import Projects from "../pages/Projects";
import ProjectDetails from"../pages/ProjectDetails";
import EditProject from "../pages/EditProject";








function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

       {/* TASKS */}
       <Route path="/tasks" element={<Tasks />} />
       <Route path="/tasks/new" element={<CreateTask />} />
       <Route path="/tasks/edit/:id" element={<EditTask />} />

        {/* PROJECTS */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route 
 path="/projects/:id/tasks/new" 
 element={<CreateTask />} 
/>

<Route path="/projects/:id" element={<ProjectDetails />} />
<Route path="/projects/edit/:id" element={<EditProject />} />

       


       
    </Routes>
  );
}

export default AppRoutes;