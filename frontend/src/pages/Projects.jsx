import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getProjects } from "../services/api";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";


export default function Projects() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filteredProjects = projects.filter((project) =>
  project.name.toLowerCase().includes(search.toLowerCase())
);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mes projets
          </h1>

          <p className="text-gray-500">
            Gérez vos projets et leurs tâches
          </p>
        </div>
 <div className="relative w-80">
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
  />

  <input
    type="text"
    placeholder="Rechercher un projet..."
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Rechercher un projet..."
    className="
      w-full
      pl-10 pr-4 py-2.5
      rounded-xl
      border border-gray-200
      bg-gray-50
      focus:bg-white
      focus:outline-none
      focus:ring-2
      focus:ring-primary/20
      focus:border-primary
      transition
    "
  />
</div>
        {/* LISTE PROJETS */}

        {loading ? (

          <div className="text-gray-500">
            Chargement...
          </div>

        ) : projects.length === 0 ? (

          <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">
            Aucun projet pour le moment.
          </div>

        ) : (

          <div className="grid grid-cols-3 gap-5">

          { filteredProjects.map((project) => (

              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5"
              >

              <h2
  className="font-semibold text-gray-800 text-lg overflow-hidden line-clamp-2"
  title={project.name}
>
  {project.name}
</h2>


               <p
  className="text-gray-500 text-sm mt-2 overflow-hidden line-clamp-3"
  title={project.description}
>
  {project.description}
</p>

               <div className="mt-4 text-sm">

  <span
    className={
      project.status === "Terminé"
        ? "bg-green-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700"
        : project.status === "En cours" && new Date(project.endDate) < new Date()
        ? "bg-red-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700"
        : project.status === "En cours"
        ? "bg-pink-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700"
        : "bg-orange-200 w-28 inline-block text-center px-3 py-1.5 rounded-lg text-gray-700"
    }
  >
    {project.status === "En cours" && new Date(project.endDate) < new Date()
      ? "En retard"
      : project.status}
  </span>

</div>


                <div className="mt-3 text-xs text-gray-400">
                  Du{" "}
                  {new Date(project.startDate).toLocaleDateString("fr-FR")}
                  {" "}au{" "}
                  {new Date(project.endDate).toLocaleDateString("fr-FR")}
                </div>


              </Link>

            ))}

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}