import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleLayout from "../components/SimpleLayout";
import { createProject } from "../services/api";

export default function CreateProject() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "En attente",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createProject(formData);

    navigate("/projects");

  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};


  return (
    <SimpleLayout>

      <div className="max-w-xl w-full bg-white border border-gray-100 shadow-sm rounded-xl p-6">

        <h1 className="text-xl font-semibold mb-6">
          Créer un projet
        </h1>


        <form onSubmit={handleSubmit} className="space-y-4">


          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom du projet"
            className="w-full p-3 border rounded-lg"
          />


          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du projet"
            className="w-full p-3 border rounded-lg"
          />


          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />


          <input
            type="date"
            name="endDate"
            value={formData.endDate}
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
            Créer le projet
          </button>


        </form>

      </div>

    </SimpleLayout>
  );
}