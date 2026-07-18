import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SimpleLayout from "../components/SimpleLayout";

import { getProjects, updateProject } from "../services/api";


export default function EditProject() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { id } = useParams();

  const navigate = useNavigate();


  const [formData, setFormData] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchProject = async () => {

      try {

        const res = await getProjects();


        const currentProject = res.data.find(
          (p) => p._id === id
        );


        setFormData(currentProject);


      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


    fetchProject();

  }, [id]);





  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData({

      ...formData,

      [name]: value,

    });

  };





  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      await updateProject(id, formData);


      navigate(`/projects/${id}`);


    } catch (error) {

      console.log(error.response?.data || error.message);

    }

  };





  if (loading) {

    return (

      <SimpleLayout user={user}>

        <div className="text-gray-500">
          Chargement...
        </div>

      </SimpleLayout>

    );

  }




  return (

    <SimpleLayout user={user}>


      <div className="max-w-xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-6">


        <h1 className="text-xl font-semibold mb-6">
          Modifier le projet
        </h1>




        {/* PROJET ACTUEL */}


        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">


          <p className="text-sm text-gray-500 mb-2">
            Projet actuel
          </p>


          <p className="font-semibold">
            {formData.name}
          </p>


          <p className="text-gray-600 text-sm">
            {formData.description}
          </p>



          <p className="text-sm mt-2">

            Statut :{" "}

            <span
              className={
                formData.status === "Terminé"
                ? "text-green-600"
                : formData.status === "En cours"
                ? "text-yellow-600"
                : "text-gray-500"
              }
            >

              {formData.status}

            </span>

          </p>


        </div>






        {/* FORMULAIRE */}


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >



          <input

            name="name"

            value={formData.name}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />





          <textarea

            name="description"

            value={formData.description}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />






          <input

            type="date"

            name="startDate"

            value={formData.startDate?.split("T")[0]}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />






          <input

            type="date"

            name="endDate"

            value={formData.endDate?.split("T")[0]}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />






          <select

            name="status"

            value={formData.status}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

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






          <button

            type="submit"

            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90"

          >

            Enregistrer les modifications

          </button>




        </form>


      </div>



    </SimpleLayout>

  );

}