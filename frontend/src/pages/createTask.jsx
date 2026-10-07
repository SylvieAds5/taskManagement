import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SimpleLayout from "../components/SimpleLayout";
import { createTask } from "../services/api";
import Toast from "../components/Toast";

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
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      setError("");
    }, 4000); // disparition après 4 secondes

    return () => clearTimeout(timer);
  }
}, [error]);



  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };



 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setError("");

   await createTask({

  ...formData,

  project: id,

});

setToast("Tâche créée avec succès !");

setTimeout(() => {
  navigate(`/projects/${id}`);
}, 2000);

  } catch (error) {

    const message =
      error.response?.data?.message ||
      "Une erreur est survenue.";

    setError(message);

  }

};



  return (

  <>
    {toast && (
      <Toast message={toast} />
    )}

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

{error && (
  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
)}



          <button

            type="submit"

            className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90"

          >

            Créer la tâche

          </button>



        </form>


      </div>


    </SimpleLayout>
    </>

  );

}