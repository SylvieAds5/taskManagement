const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getInvitation,
  acceptInvitation,
} = require("../controllers/projectController");

router.get("/invitations/:token", getInvitation);
router.post("/invitations/:token/accept", protect, acceptInvitation);
router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post( "/:id/collaborators", protect, addCollaborator );
router.delete( "/:id/collaborators/:collaboratorId",protect,removeCollaborator);
router.put("/:id/collaborators/:collaboratorId",protect,updateCollaboratorRole);
module.exports = router;
