
import { Link } from "react-router-dom";
import { deleteTask } from "../services/api";
import { Pencil } from "lucide-react";

export default function TaskItem({ task, onDelete }) {

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Voulez-vous vraiment supprimer cette tâche ?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTask(task._id);

    if (onDelete) {
      onDelete(task._id);
    }

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};

  return (
    <div className="grid grid-cols-6 gap-6 items-center px-6 py-4 border-b border-gray-100 min-w-0">

      {/* TITRE (pas coupé) */}
    <div className="font-medium text-gray-800 text-sm leading-snug min-w-0 truncate" title={task.title}>
  {task.title}
</div>
      {/* DESCRIPTION (pas coupée) */}
      <div className="text-gray-500 text-sm leading-snug min-w-0 truncate" title={task.description}>
  {task.description}
</div>

      {/* STATUS */}
<div>
  {(() => {
    const isLate =
      !task.status && new Date(task.dateFin) < new Date();

    if (task.status) {
      return (
        <span className="text-green-600">
          Terminée
        </span>
      );
    }

    if (isLate) {
      return (
        <span className="text-red-600 font-medium">
          En retard
        </span>
      );
    }

    return (
      <span className="text-yellow-600">
        En cours
      </span>
    );
  })()}
</div>

      {/* DATE DEBUT */}
      <div className="text-gray-500 whitespace-nowrap">
        {new Date(task.dateDebut).toLocaleDateString("fr-FR")}
      </div>

      {/* DATE FIN */}
      <div className="text-gray-500 whitespace-nowrap">
        {new Date(task.dateFin).toLocaleDateString("fr-FR")}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 justify-end">

        {/* MODIFIER (bouton carré pro) */}
        <Link
          to={`/tasks/edit/${task._id}`}
          className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-md hover:opacity-90 transition"
        >
          <Pencil size={16} />
        </Link>

        {/* SUPPRIMER (rouge pro) */}
        <button
          onClick={handleDelete}
          className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
        >
          Supprimer
        </button>

      </div>

    </div>
  );
}