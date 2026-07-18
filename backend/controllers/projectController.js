const Project = require("../models/project");

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
      user: req.user,
    });

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
      user: req.user,
    });

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

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};