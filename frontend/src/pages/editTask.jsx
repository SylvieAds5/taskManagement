import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/api";
import SimpleLayout from "../components/SimpleLayout";



export default function EditTask() {


  const { id } = useParams();

  const navigate = useNavigate();



  const [formData, setFormData] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchTask = async () => {

      try {

        const res = await getTaskById(id);

        setFormData(res.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };



    fetchTask();

  }, [id]);



  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;



    setFormData({

      ...formData,

      [name]: type === "checkbox" ? checked : value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    try {

      await updateTask(id, formData);

      navigate("/tasks");

    } catch (error) {

      console.log(error.response?.data || error.message);

    }

  };



  if (loading) {
  return (
    <SimpleLayout>
      <div className="text-gray-500">Chargement...</div>
    </SimpleLayout>
  );
}


  return (

    <SimpleLayout>



      <div className="max-w-xl mx-auto bg-white border border-gray-100 shadow-sm rounded-xl p-6">



        <h1 className="text-xl font-semibold mb-6">

          Modifier la tâche

        </h1>



        {/* SECTION : ANCIENNE TACHE */}

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">

          <p className="text-sm text-gray-500 mb-2">Tâche actuelle</p>



          <p className="font-semibold">{formData.title}</p>

          <p className="text-gray-600 text-sm">{formData.description}</p>



          <p className="text-sm mt-2">

            Statut :{" "}

            <span className={formData.status ? "text-green-600" : "text-yellow-600"}>

              {formData.status ? "Terminée" : "En cours"}

            </span>

          </p>

        </div>



        {/* FORMULAIRE MODIFICATION */}

        <form onSubmit={handleSubmit} className="space-y-4">



          <input

            name="title"

            value={formData.title}

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

            name="dateDebut"

            value={formData.dateDebut?.split("T")[0]}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />



          <input

            type="date"

            name="dateFin"

            value={formData.dateFin?.split("T")[0]}

            onChange={handleChange}

            className="w-full p-3 border rounded-lg"

          />



          <label className="flex items-center gap-2 text-sm">

            <input

              type="checkbox"

              name="status"

              checked={formData.status}

              onChange={handleChange}

            />

            Marquer comme terminée

          </label>



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