import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getProjects } from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
console.log(res.data);
setProjects(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  const total = projects.length;

  const enCours = projects.filter(
  (p) => p.status === "En cours"
).length;

const terminees = projects.filter(
  (p) => p.status === "Terminé"
).length;


  const today = new Date();

  const enRetard = projects.filter(
  (p) =>
    p.status === "En cours" &&
    new Date(p.endDate) < today
).length;


  const filteredProjects = projects.filter((p) => {

    if (filter === "all") return true;

   if (filter === "enCours")
  return p.status === "En cours";

if (filter === "terminees")
  return p.status === "Terminé";

if (filter === "retard")
  return p.status === "En cours" && new Date(p.endDate) < today;

  });


  const visibleProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );


  return (
    <DashboardLayout user={user}>

      <div className="space-y-6">


        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bonjour, {user.firstName || "Utilisateur"}
          </h1>

          <p className="text-gray-500">
            Vue d’ensemble de vos projets
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
            <p className="text-sm text-gray-500">
              Total projets
            </p>

            <p className="text-2xl font-bold">
              {total}
            </p>

          </div>



          <div
            onClick={() => setFilter("enCours")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-yellow-400 ${
              filter === "enCours" ? "ring-2 ring-yellow-300" : ""
            }`}
          >

            <p className="text-sm text-gray-500">
              En cours
            </p>

            <p className="text-2xl font-bold text-yellow-600">
              {enCours}
            </p>

          </div>




          <div
            onClick={() => setFilter("terminees")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-green-400 ${
              filter === "terminees" ? "ring-2 ring-green-300" : ""
            }`}
          >

            <p className="text-sm text-gray-500">
              Terminés
            </p>

            <p className="text-2xl font-bold text-green-600">
              {terminees}
            </p>

          </div>





          <div
            onClick={() => setFilter("retard")}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4 border-red-400 ${
              filter === "retard" ? "ring-2 ring-red-300" : ""
            }`}
          >

            <p className="text-sm text-gray-500">
              En retard
            </p>

            <p className="text-2xl font-bold text-red-600">
              {enRetard}
            </p>

          </div>


        </div>





        {/* LISTE */}
        <div className="bg-white rounded-xl shadow-sm">


          {/* Entête */}
          <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-100 font-semibold text-gray-700">

            <div>
              Mes projets
            </div>

            <div className="text-right">
              Statut
            </div>

          </div>



          {loading ? (

            <div className="p-6 text-gray-500">
              Chargement...
            </div>


          ) : visibleProjects.length === 0 ? (

            <div className="p-6 text-gray-500">
              Aucun projet pour le moment.
            </div>


          ) : (


            visibleProjects.map((project) => (

              <div
                key={project._id}
                className="flex justify-between items-center px-6 py-3 border-b border-gray-50 last:border-none"
              >


                <div className="text-gray-800">
                  {project.name}
                </div>



               <div
  className={
    project.status === "Terminé"
      ? "bg-green-200 w-28 text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm"
      : project.status === "En cours" && new Date(project.endDate) < new Date()
      ? "bg-red-200 w-28 text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm"
      : project.status === "En cours"
      ? "bg-pink-200 w-28 text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm"
      : "bg-orange-200 w-28 text-center px-3 py-1.5 rounded-lg text-gray-700 text-sm"
  }
>
  {project.status === "En cours" && new Date(project.endDate) < new Date()
    ? "En retard"
    : project.status}
</div>

              </div>

            ))

          )}


        </div>


      </div>


    </DashboardLayout>
  );
}