import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SimpleLayout from "../components/SimpleLayout";
import { createTask } from "../services/api";

export default function CreateTask() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navigate = useNavigate();

  const { id } = useParams(); // id du projet

    console.log("ID PROJET :", id);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateDebut: "",
    dateFin: "",
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

      await createTask({

        ...formData,

        // liaison avec le projet
        project: id,

      });


      // retour vers le détail du projet
      navigate(`/projects/${id}`);


    } catch (error) {

      console.log(error.response?.data || error.message);

    }

  };



  return (

    <SimpleLayout user={user}>

      <div className="max-w-xl w-full bg-white shadow-sm rounded-xl p-6">


        <h1 className="text-xl font-semibold mb-6">
          Créer une tâche
        </h1>



        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre"
            required
            className="w-full p-3 border rounded-lg"
          />



          <textarea

            name="description"

            value={formData.description}

            onChange={handleChange}

            placeholder="Description"

            className="w-full p-3 border rounded-lg"

          />




          <input

            type="date"

            name="dateDebut"

            value={formData.dateDebut}

            onChange={handleChange}

            required

            className="w-full p-3 border rounded-lg"

          />




          <input

            type="date"

            name="dateFin"

            value={formData.dateFin}

            onChange={handleChange}

            required

            className="w-full p-3 border rounded-lg"

          />




          <button

            type="submit"

            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90"

          >

            Créer la tâche

          </button>



        </form>


      </div>


    </SimpleLayout>

  );

}