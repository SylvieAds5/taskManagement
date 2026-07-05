import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getTasks } from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 NOUVEAU : filtre actif
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const total = tasks.length;
  const enCours = tasks.filter((t) => !t.status).length;
  const terminees = tasks.filter((t) => t.status).length;

  const today = new Date();
  const enRetard = tasks.filter(
    (t) => !t.status && new Date(t.dateFin) < today
  ).length;

  // 👇 NOUVEAU : filtre dynamique
  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "enCours") return !t.status;
    if (filter === "terminees") return t.status;
    if (filter === "retard") return !t.status && new Date(t.dateFin) < today;
  });

  const visibleTasks = [...filteredTasks]
  .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

  return (
    <DashboardLayout user={user}>

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bonjour, {user.firstName || "Utilisateur"}
          </h1>
          <p className="text-gray-500">
            Vue d’ensemble de vos tâches
          </p>
        </div>

        {/* STATS CLIQUABLES */}
        <div className="grid grid-cols-4 gap-4">

          <div
            onClick={() => setFilter("all")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition ${
              filter === "all" ? "ring-2 ring-gray-300" : ""
            }`}
          >
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div
            onClick={() => setFilter("enCours")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-yellow-400 ${
              filter === "enCours" ? "ring-2 ring-yellow-300" : ""
            }`}
          >
            <p className="text-sm text-gray-500">En cours</p>
            <p className="text-2xl font-bold text-yellow-600">{enCours}</p>
          </div>

          <div
            onClick={() => setFilter("terminees")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-green-400 ${
              filter === "terminees" ? "ring-2 ring-green-300" : ""
            }`}
          >
            <p className="text-sm text-gray-500">Terminées</p>
            <p className="text-2xl font-bold text-green-600">{terminees}</p>
          </div>

          <div
            onClick={() => setFilter("retard")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-red-400 ${
              filter === "retard" ? "ring-2 ring-red-300" : ""
            }`}
          >
            <p className="text-sm text-gray-500">En retard</p>
            <p className="text-2xl font-bold text-red-600">{enRetard}</p>
          </div>

        </div>

        {/* LISTE */}
        <div className="bg-white rounded-xl shadow-sm">

  {/* Entête */}
  <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-100 font-semibold text-gray-700">
    <div>Mes tâches</div>
    <div className="text-right">Statut</div>
  </div>

  {loading ? (
            <div className="p-6 text-gray-500">Chargement...</div>
          ) : visibleTasks.length === 0 ? (
            <div className="p-6 text-gray-500">
              Aucune tâche pour le moment.
            </div>
          ) : (
            visibleTasks.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center px-6 py-3 border-b border-gray-50 last:border-none"
              >
                <div className="text-gray-800">
                  {task.title}
                </div>

                <div
                  className={
                    task.status
                      ? "text-green-600 text-sm"
                      : "text-yellow-600 text-sm"
                  }
                >
                  {task.status ? "Terminée" : "En cours"}
                </div>
              </div>
            ))
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}