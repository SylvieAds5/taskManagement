import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// token,
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// TASKS
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) =>API.delete(`/projects/${id}`);