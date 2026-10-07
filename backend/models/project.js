const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["En attente", "En cours", "Terminé"],
      default: "En attente",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Propriétaire du projet
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Collaborateurs du projet
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["lecture", "modification"],
          default: "lecture",
        },
      },
    ],
    invitations: [
      {
        email: { type: String, required: true, lowercase: true, trim: true },
        role: { type: String, enum: ["lecture", "modification"], default: "lecture" },
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
