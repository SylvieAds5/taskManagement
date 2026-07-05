const Task = require("../models/task");

const createTask = async (req, res) => {
  try {
    const { title, description, dateDebut, dateFin } = req.body;

    const task = await Task.create({
      title,
      description,
      dateDebut,
      dateFin,
      user: req.user
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({
        message: "Tâche introuvable",
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: req.user });

    if (!task) {
      return res.status(404).json({
        message: "Tâche introuvable"
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
  { _id: id, user: req.user },
  req.body,
  { new: true }
);

if (!updatedTask) {
  return res.status(404).json({
    message: "Tâche introuvable"
  });
}

    res.status(200).json({
      message: "Tâche mise à jour",
      task: updatedTask
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({
        message: "Tâche introuvable"
      });
    }

    res.status(200).json({
      message: "Tâche supprimée avec succès"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
};