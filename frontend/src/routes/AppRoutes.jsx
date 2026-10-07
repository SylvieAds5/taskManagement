import { Routes, Route } from "react-router-dom";

import Register from "../pages/register";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Tasks from "../pages/tasks"; 
import CreateTask from "../pages/createTask";
import EditTask from "../pages/editTask";
import CreateProject from "../pages/createProject";
import Projects from "../pages/Projects";
import ProjectDetails from"../pages/ProjectDetails";
import EditProject from "../pages/editProject";
import AcceptInvitation from "../pages/AcceptInvitation";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/invitations/:token" element={<AcceptInvitation />} />
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
