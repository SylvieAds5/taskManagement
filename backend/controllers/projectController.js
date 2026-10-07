const Project = require("../models/project");
const User = require("../models/user");
const crypto = require("crypto");
const { sendProjectInvitation } = require("../utils/email");


const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;

    const project = await Project.create({
      name,
      description,
      endDate,
      startDate,
      status,
      user: req.user,
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
   const projects = await Project.find({
  $or: [{ user: req.user }, { "collaborators.user": req.user }],
}).populate(
  "collaborators.user",
  "firstName lastName email"
).populate("user", "firstName lastName email");

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

   const project = await Project.findOne({
  _id: id,
  $or: [{ user: req.user }, { "collaborators.user": req.user }],
}).populate(
  "collaborators.user",
  "firstName lastName email"
).populate("user", "firstName lastName email");

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    res.status(200).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: id,
        user: req.user,
      },
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Projet mis à jour",
      project: updatedProject,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable",
      });
    }

    res.status(200).json({
      message: "Projet supprimé avec succès",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================================
// AJOUTER UN COLLABORATEUR
// ======================================================

const addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    // Vérification de l'email
    if (!email) {
      return res.status(400).json({
        message: "L'email du collaborateur est requis.",
      });
    }

    // Vérification du rôle
    if (!["lecture", "modification"].includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide.",
      });
    }

    // Seul le propriétaire peut ajouter
    const project = await Project.findOne({
      _id: id,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    // Rechercher l'utilisateur par email
    const collaborator = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!collaborator) {
      const normalizedEmail = email.toLowerCase().trim();
      const rawToken = crypto.randomBytes(32).toString("hex");
      project.invitations = project.invitations.filter((item) => item.email !== normalizedEmail);
      project.invitations.push({
        email: normalizedEmail,
        role,
        tokenHash: crypto.createHash("sha256").update(rawToken).digest("hex"),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await project.save();
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      const invitationUrl = `${frontendUrl}/invitations/${rawToken}`;
      try {
        await sendProjectInvitation({
          to: normalizedEmail,
          projectName: project.name,
          invitationUrl,
          role,
        });
      } catch (emailError) {
        project.invitations = project.invitations.filter((item) => item.tokenHash !== crypto.createHash("sha256").update(rawToken).digest("hex"));
        await project.save();
        console.error("Échec de l'envoi de l'invitation :", emailError.message);
        return res.status(503).json({ message: emailError.message || "Impossible d'envoyer l'e-mail d'invitation." });
      }
      return res.status(201).json({
        message: "Invitation envoyée par e-mail.",
        invitationUrl,
        invited: true,
      });
    }

    // Empêcher le propriétaire de s'ajouter lui-même
    if (
      collaborator._id.toString() === req.user.toString()
    ) {
      return res.status(400).json({
        message: "Vous êtes déjà le propriétaire de ce projet.",
      });
    }

    // Vérifier si déjà collaborateur
    const alreadyCollaborator =
      project.collaborators.some(
        (item) =>
          item.user.toString() ===
          collaborator._id.toString()
      );

    if (alreadyCollaborator) {
      return res.status(400).json({
        message:
          "Cet utilisateur est déjà collaborateur du projet.",
      });
    }

    // Ajouter le collaborateur
    project.collaborators.push({
      user: collaborator._id,
      role,
    });

    await project.save();

    // Retourner le projet avec les informations
    // du collaborateur
    const updatedProject = await Project.findById(
      project._id
    ).populate(
      "collaborators.user",
      "firstName lastName email"
    );

    res.status(200).json({
      message: "Collaborateur ajouté avec succès.",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getInvitation = async (req, res) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const project = await Project.findOne({ "invitations.tokenHash": tokenHash }, { name: 1, invitations: 1 });
    const invitation = project?.invitations.find((item) => item.tokenHash === tokenHash);
    if (!invitation || invitation.expiresAt < new Date()) {
      return res.status(404).json({ message: "Invitation invalide ou expirée." });
    }
    return res.json({ email: invitation.email, projectName: project.name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const project = await Project.findOne({ "invitations.tokenHash": tokenHash });
    const invitation = project?.invitations.find((item) => item.tokenHash === tokenHash);
    if (!invitation || invitation.expiresAt < new Date()) {
      return res.status(404).json({ message: "Invitation invalide ou expirée." });
    }
    const user = await User.findById(req.user);
    if (!user || user.email.toLowerCase() !== invitation.email) {
      return res.status(403).json({ message: "Connectez-vous avec l'adresse e-mail invitée." });
    }
    if (!project.collaborators.some((item) => item.user.toString() === user._id.toString())) {
      project.collaborators.push({ user: user._id, role: invitation.role });
    }
    project.invitations = project.invitations.filter((item) => item.tokenHash !== tokenHash);
    await project.save();
    return res.json({ message: "Invitation acceptée.", projectId: project._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { id, collaboratorId } = req.params;

    // Seul le propriétaire peut retirer un collaborateur
    const project = await Project.findOne({
      _id: id,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    // Vérifier que le collaborateur existe dans le projet
    const collaboratorExists = project.collaborators.some(
      (item) =>
        item.user.toString() === collaboratorId
    );

    if (!collaboratorExists) {
      return res.status(404).json({
        message: "Collaborateur introuvable dans ce projet.",
      });
    }

    // Retirer le collaborateur
    project.collaborators = project.collaborators.filter(
      (item) =>
        item.user.toString() !== collaboratorId
    );

    await project.save();

    // Retourner le projet mis à jour
    const updatedProject = await Project.findById(
      project._id
    ).populate(
      "collaborators.user",
      "firstName lastName email"
    );

    res.status(200).json({
      message: "Collaborateur retiré avec succès.",
      project: updatedProject,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCollaboratorRole = async (req, res) => {
  try {
    const { id, collaboratorId } = req.params;
    const { role } = req.body;

    if (!["lecture", "modification"].includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide.",
      });
    }

    const project = await Project.findOne({
      _id: id,
      user: req.user,
    });

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    const collaborator = project.collaborators.find(
      (item) =>
        item.user.toString() === collaboratorId
    );

    if (!collaborator) {
      return res.status(404).json({
        message: "Collaborateur introuvable.",
      });
    }

    collaborator.role = role;

    await project.save();

    const updatedProject = await Project.findById(
      project._id
    ).populate(
      "collaborators.user",
      "firstName lastName email"
    );

    res.status(200).json({
      message: "Rôle du collaborateur mis à jour.",
      project: updatedProject,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
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
};
