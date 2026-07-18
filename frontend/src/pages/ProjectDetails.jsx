import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import TaskItem from "../components/TaskItem";

import {
  getTasks,
  getProjects,
  updateProject,
  deleteProject,
} from "../services/api";


export default function ProjectDetails() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchData = async () => {

      try {

        const projectsRes = await getProjects();


        const currentProject = projectsRes.data.find(
          (p) => p._id === id
        );


        setProject(currentProject);



        const tasksRes = await getTasks();


        const projectTasks = tasksRes.data.filter(
          (task) =>
            task.project?._id === id ||
            task.project === id
        );


        setTasks(projectTasks);



      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, [id]);



   
  const handleStatusChange = async (e) => {

    const newStatus = e.target.value;

    try {

      await updateProject(project._id, {
        status: newStatus,
      });


      setProject((prev) => ({
        ...prev,
        status: newStatus,
      }));


    } catch (error) {

      console.log(error);

    }

  };



  const handleDeleteProject = async () => {

    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce projet ?"
    );


    if (!confirmDelete) return;


    try {

      await deleteProject(project._id);

      navigate("/projects");


    } catch (error) {

      console.log(error);

    }

  };



  if (loading) {

    return (
      <DashboardLayout user={user}>
        <div className="text-gray-500">
          Chargement...
        </div>
      </DashboardLayout>
    );

  }




  if (!project) {

    return (
      <DashboardLayout user={user}>
        <div className="text-gray-500">
          Projet introuvable.
        </div>
      </DashboardLayout>
    );

  }





  return (

    <DashboardLayout user={user}>


      <div className="space-y-6">


        {/* DETAILS PROJET */}


        <div className="bg-white rounded-xl shadow-sm p-6">


          <div className="flex justify-between items-start">


            <div>


              <h1 className="text-2xl font-bold text-gray-800">
                {project.name}
              </h1>


              <p
                className="text-gray-500 mt-3 line-clamp-3"
                title={project.description}
              >
                {project.description}
              </p>


            </div>


          </div>




          <div className="flex justify-between items-center mt-4">


            <div>


              <label className="block text-sm text-gray-600 mb-2">
                Statut du projet
              </label>


              <select
                value={project.status}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >

                <option value="En attente">
                  En attente
                </option>

                <option value="En cours">
                  En cours
                </option>

                <option value="Terminé">
                  Terminé
                </option>

              </select>


            </div>



<div className="flex gap-3">


  {/* Modifier projet : carré bleu avec crayon uniquement */}
  <button
    onClick={() =>
      navigate(`/projects/edit/${project._id}`)
    }
    className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
    title="Modifier"
  >
    <Pencil size={18} />
  </button>



  {/* Supprimer projet : bouton rouge avec texte */}
 <button
  onClick={handleDeleteProject}
  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
>
  Supprimer
</button>


</div>


          </div>




          <div className="mt-3 text-sm text-gray-400">

            Du{" "}
            {new Date(project.startDate)
              .toLocaleDateString("fr-FR")}

            {" "}au{" "}

            {new Date(project.endDate)
              .toLocaleDateString("fr-FR")}


          </div>



        </div>
                {/* TACHES DU PROJET */}


        <div className="bg-white rounded-xl shadow-sm">



          {tasks.length === 0 ? (


            <div className="p-6 text-gray-500">

              Aucune tâche pour ce projet.

            </div>


          ) : (


            <>


              {/* ENTETE TABLEAU */}


              <div className="grid grid-cols-6 gap-6 px-6 py-4 font-semibold text-gray-600 border-b border-gray-200">


                <div>
                  Titre
                </div>


                <div>
                  Description
                </div>


                <div>
                  Statut
                </div>


                <div>
                  Date début
                </div>


                <div>
                  Date fin
                </div>


                <div className="text-right">
                  Actions
                </div>


              </div>





              {/* LISTE DES TACHES */}


              {tasks.map((task) => (


                <TaskItem

                  key={task._id}

                  task={task}


                  onDelete={(id) =>


                    setTasks((prev) =>

                      prev.filter(
                        (t) => t._id !== id
                      )

                    )

                  }


                />


              ))}



            </>


          )}



        </div>



      </div>



    </DashboardLayout>

  );

}