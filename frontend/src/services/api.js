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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// TASKS
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const getTaskById = (id) => API.get(`/tasks/${id}`);

// projects
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) =>API.delete(`/projects/${id}`);

export const addCollaborator = (projectId, data) =>
  API.post(`/projects/${projectId}/collaborators`, data);
export const getInvitation = (token) => API.get(`/projects/invitations/${token}`);
export const acceptInvitation = (token) => API.post(`/projects/invitations/${token}/accept`);
export const removeCollaborator = (projectId, collaboratorId) =>
  API.delete(
    `/projects/${projectId}/collaborators/${collaboratorId}`
  );
  export const updateCollaboratorRole = (
  projectId,
  collaboratorId,
  data
) =>
  API.put(
    `/projects/${projectId}/collaborators/${collaboratorId}`,
    data
  );
