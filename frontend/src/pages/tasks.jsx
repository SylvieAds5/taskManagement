import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TaskItem from "../components/TaskItem";
import { getTasks } from "../services/api";

export default function Tasks() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [tasks, setTasks] = useState([]);

 useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchTasks();
}, []);

  return (
    <DashboardLayout user={user}>

      <div className="space-y-3">

        {tasks.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8 text-center text-gray-500">
            Aucune tâche pour le moment.
          </div>
        ) : (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100">

    {/* En-tête */}
    <div className="grid grid-cols-6 gap-6 px-6 py-4 font-semibold text-gray-600 border-b border-gray-200">
      <div>Titre</div>
      <div>Description</div>
      <div>Statut</div>
      <div>Date début</div>
      <div>Date fin</div>
      <div className="text-right">Actions</div>
    </div>

    {/* Liste des tâches */}
    {tasks.map((task) => (
      <TaskItem
        key={task._id}
        task={task}
        onDelete={(id) =>
          setTasks((prev) => prev.filter((t) => t._id !== id))
        }
      />
    ))}

  </div>
)}

      </div>

    </DashboardLayout>
  );
}