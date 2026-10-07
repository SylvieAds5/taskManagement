import { Link } from "react-router-dom";
import { deleteTask } from "../services/api";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function TaskItem({ task, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {

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
    <>
    <div className="grid grid-cols-6 gap-6 items-center px-6 py-4 border-b border-gray-100 min-w-0">
      {/* TITRE */}
      <div
        className="font-medium text-gray-800 text-sm leading-snug min-w-0 truncate"
        title={task.title}
      >
        {task.title}
      </div>
      {/* DESCRIPTION */}
      <div
        className="text-gray-500 text-sm leading-snug min-w-0 truncate"
        title={task.description}
      >
        {task.description}
      </div>

     {/* STATUS */}
<div>
  {(() => {
    const isLate = !task.status && new Date(task.dateFin) < new Date();

    if (task.status) {
      return (
        <span className="bg-green-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm">
          Terminée
        </span>
      );
    }

    if (isLate) {
      return (
        <span className="bg-red-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm">
          En retard
        </span>
      );
    }

    return (
      <span className="bg-pink-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm">
        En cours
      </span>
    );
  }
 
  )()}
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
        {/* MODIFIER */}
        <Link
          to={`/tasks/edit/${task._id}`}
          className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-md hover:opacity-90 transition"
        >
          <Pencil size={16} />
        </Link>

        {/* SUPPRIMER */}
        <button
  onClick={() => setShowDeleteModal(true)}
  className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
>
  Supprimer
</button>
      </div>
    </div>

    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

        <div className="bg-white rounded-xl shadow-lg p-6 w-80">

          <h2 className="text-lg font-semibold text-gray-800">
            Supprimer la tâche
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Voulez-vous vraiment supprimer cette tâche ?
          </p>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </button>

          </div>

        </div>

      </div>
)}
</>
);
}
