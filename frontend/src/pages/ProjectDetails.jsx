import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, UserPlus, X } from "lucide-react";

import Toast from "../components/Toast";
import DashboardLayout from "../components/dashboardLayout";
import TaskItem from "../components/taskItem";

import {
  getTasks,
  getProjects,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
} from "../services/api";

export default function ProjectDetails() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  /* DELETE PROJECT */

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* TOAST */

  const [toast, setToast] = useState(null);

  /* ADD COLLABORATOR */

  const [showCollaboratorModal, setShowCollaboratorModal] =
    useState(false);

  const [collaboratorEmail, setCollaboratorEmail] =
    useState("");

  const [collaboratorRole, setCollaboratorRole] =
    useState("lecture");

  const [collaboratorError, setCollaboratorError] =
    useState("");
  const [invitationUrl, setInvitationUrl] = useState("");

  const [addingCollaborator, setAddingCollaborator] =
    useState(false);

  /* ALL COLLABORATORS */

  const [showAllCollaboratorsModal, setShowAllCollaboratorsModal] =
    useState(false);

  /* REMOVE COLLABORATOR */

  const [showRemoveCollaboratorModal, setShowRemoveCollaboratorModal] =
    useState(false);

  const [selectedCollaborator, setSelectedCollaborator] =
    useState(null);

  const [removingCollaborator, setRemovingCollaborator] =
    useState(false);

  /* =========================
     FETCH PROJECT + TASKS
  ========================= */

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

        setToast({
          message: "Impossible de charger le projet.",
          type: "error",
        });

        setTimeout(() => {
          setToast(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* =========================
     TOAST HELPER
  ========================= */

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =========================
     PROJECT STATUS
  ========================= */

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

      showToast("Statut du projet modifié avec succès !");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Impossible de modifier le statut.";

      showToast(message, "error");
    }
  };

  /* =========================
     DELETE PROJECT
  ========================= */

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project._id);

      setShowDeleteModal(false);

      showToast("Projet supprimé avec succès !");

      navigate("/projects");
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Impossible de supprimer le projet.";

      showToast(message, "error");
    }
  };

  /* =========================
     ADD COLLABORATOR
  ========================= */

  const openCollaboratorModal = () => {
    setCollaboratorEmail("");
    setCollaboratorRole("lecture");
    setCollaboratorError("");
    setInvitationUrl("");

    setShowCollaboratorModal(true);
  };

  const closeCollaboratorModal = () => {
    setShowCollaboratorModal(false);

    setCollaboratorEmail("");
    setCollaboratorRole("lecture");
    setCollaboratorError("");
    setInvitationUrl("");
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();

    try {
      setAddingCollaborator(true);
      setCollaboratorError("");

      const res = await addCollaborator(project._id, {
        email: collaboratorEmail,
        role: collaboratorRole,
      });

      /*
       * Le backend retourne le projet
       * avec la nouvelle liste des collaborateurs.
       */
      if (res.data.invitationUrl) {
        setInvitationUrl(res.data.invitationUrl);
      } else {
        setProject(res.data.project);
        closeCollaboratorModal();
        showToast("Collaborateur ajouté avec succès !");
      }
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Une erreur est survenue.";

      setCollaboratorError(message);
    } finally {
      setAddingCollaborator(false);
    }
  };

  /* =========================
     ALL COLLABORATORS
  ========================= */

  const openAllCollaboratorsModal = () => {
    setShowAllCollaboratorsModal(true);
  };

  const closeAllCollaboratorsModal = () => {
    setShowAllCollaboratorsModal(false);
  };

  /* =========================
     REMOVE COLLABORATOR
  ========================= */

  const openRemoveCollaboratorModal = (collaborator) => {
    setSelectedCollaborator(collaborator);

    /*
     * On ferme la modale "Tous les collaborateurs"
     * avant d'afficher la confirmation.
     */
    setShowAllCollaboratorsModal(false);

    setShowRemoveCollaboratorModal(true);
  };

  const closeRemoveCollaboratorModal = () => {
    setShowRemoveCollaboratorModal(false);
    setSelectedCollaborator(null);
  };

  const handleRemoveCollaborator = async () => {
    if (!selectedCollaborator) {
      return;
    }

    try {
      setRemovingCollaborator(true);

      const res = await removeCollaborator(
        project._id,
        selectedCollaborator.user._id
      );

      /*
       * Mise à jour du projet avec la nouvelle
       * liste des collaborateurs.
       */
      setProject(res.data.project);

      closeRemoveCollaboratorModal();

      showToast(
        "Collaborateur retiré avec succès !"
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Impossible de retirer le collaborateur.";

      showToast(message, "error");
    } finally {
      setRemovingCollaborator(false);
    }
  };

  /* =========================
     CHANGE COLLABORATOR ROLE
  ========================= */

  const handleRoleChange = async (
    collaboratorId,
    newRole
  ) => {
    try {
      const res = await updateCollaboratorRole(
        project._id,
        collaboratorId,
        {
          role: newRole,
        }
      );

      /*
       * Mise à jour du projet retourné par le backend.
       */
      setProject(res.data.project);

      showToast(
        "Rôle du collaborateur modifié avec succès !"
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Impossible de modifier le rôle.";

      showToast(message, "error");
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="text-gray-500">
          Chargement...
        </div>
      </DashboardLayout>
    );
  }

  /* =========================
     PROJECT NOT FOUND
  ========================= */

  if (!project) {
    return (
      <DashboardLayout user={user}>
        <div className="text-gray-500">
          Projet introuvable.
        </div>
      </DashboardLayout>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <DashboardLayout user={user}>

      {/* TOAST */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      <div className="space-y-6">

        {/* =====================================================
            DETAILS PROJET
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* HEADER */}

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

          {/* STATUS + ACTIONS */}

          <div className="flex justify-between items-center mt-4">

            {/* STATUS */}

            <div>

              <label className="block text-sm text-gray-600 mb-2">
                Statut du projet
              </label>

              <select
                value={project.status}
                onChange={handleStatusChange}
                className="
                  border
                  border-gray-300
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
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

            {/* ACTIONS */}

            <div className="flex gap-3">

              {/* AJOUTER COLLABORATEUR */}

              <button
                type="button"
                onClick={openCollaboratorModal}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  bg-primary
                  text-white
                  hover:opacity-90
                  transition
                "
              >
                <UserPlus size={18} />

                Collaborateur
              </button>

              {/* MODIFIER */}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/projects/edit/${project._id}`
                  )
                }
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-500
                  text-white
                  hover:bg-blue-600
                  transition
                "
                title="Modifier"
              >
                <Pencil size={18} />
              </button>

              {/* SUPPRIMER */}

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-500
                  text-white
                  hover:bg-red-600
                  transition
                "
              >
                Supprimer
              </button>

            </div>

          </div>

          {/* DATES */}

          <div className="mt-3 text-sm text-gray-400">

            Du{" "}

            {new Date(
              project.startDate
            ).toLocaleDateString("fr-FR")}

            {" "}au{" "}

            {new Date(
              project.endDate
            ).toLocaleDateString("fr-FR")}

          </div>

        </div>

        {/* =====================================================
            COLLABORATEURS
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-lg font-semibold text-gray-800">
                Collaborateurs
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Les personnes ayant accès à ce projet.
              </p>

            </div>

            <button
              type="button"
              onClick={openAllCollaboratorsModal}
              className="
                text-sm
                font-medium
                text-primary
                hover:underline
              "
            >
              Voir tous
            </button>

          </div>

          {/* AUCUN COLLABORATEUR */}

          {project.collaborators?.length === 0 ? (

            <div className="text-sm text-gray-500 py-5">
              Aucun collaborateur pour le moment.
            </div>

          ) : (

            <div className="flex items-center justify-between mt-5">

              {/* AVATARS */}

              <div className="flex items-center">

                <div className="flex -space-x-3">

                  {project.collaborators
                    ?.slice(0, 5)
                    .map((collaborator) => (

                      <div
                        key={collaborator.user._id}
                        className="
                          w-10
                          h-10
                          rounded-full
                          border-2
                          border-white
                          bg-primary
                          text-white
                          flex
                          items-center
                          justify-center
                          font-semibold
                          text-sm
                          shadow-sm
                        "
                        title={`
                          ${collaborator.user.firstName}
                          ${collaborator.user.lastName}
                        `}
                      >

                        {collaborator.user.firstName
                          ?.charAt(0)
                          .toUpperCase()}

                        {collaborator.user.lastName
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                    ))}

                  {/* +N */}

                  {project.collaborators?.length > 5 && (

                    <button
                      type="button"
                      onClick={
                        openAllCollaboratorsModal
                      }
                      className="
                        w-10
                        h-10
                        rounded-full
                        border-2
                        border-white
                        bg-gray-100
                        text-gray-600
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-semibold
                        shadow-sm
                        hover:bg-gray-200
                        transition
                      "
                      title="Voir tous les collaborateurs"
                    >
                      +
                      {project.collaborators.length - 5}
                    </button>

                  )}

                </div>

                {/* NOMBRE */}

                <span className="ml-4 text-sm text-gray-500">

                  {project.collaborators?.length || 0}

                  {" "}collaborateur
                  {project.collaborators?.length > 1
                    ? "s"
                    : ""}

                </span>

              </div>

              {/* VOIR TOUS */}

              <button
                type="button"
                onClick={openAllCollaboratorsModal}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-200
                  text-sm
                  text-gray-600
                  hover:bg-gray-50
                  transition
                "
              >
                Voir tous
              </button>

            </div>

          )}

        </div>

        {/* =====================================================
            TACHES DU PROJET
        ====================================================== */}

        <div className="bg-white rounded-xl shadow-sm">

          {tasks.length === 0 ? (

            <div className="p-6 text-gray-500">
              Aucune tâche pour ce projet.
            </div>

          ) : (

            <>

              {/* HEADER TABLEAU */}

              <div
                className="
                  grid
                  grid-cols-6
                  gap-6
                  px-6
                  py-4
                  font-semibold
                  text-gray-600
                  border-b
                  border-gray-200
                "
              >

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
                  onDelete={(taskId) => {
                    setTasks((prev) =>
                      prev.filter(
                        (t) => t._id !== taskId
                      )
                    );
                  }}
                />

              ))}

            </>

          )}

        </div>

      </div>

      {/* =====================================================
          MODALE SUPPRESSION PROJET
      ====================================================== */}

      {showDeleteModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/30
            flex
            items-center
            justify-center
            z-50
            px-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-lg
              p-6
              w-full
              max-w-sm
            "
          >

            <h2 className="
              text-lg
              font-semibold
              text-gray-800
            ">
              Supprimer le projet
            </h2>

            <p className="
              text-sm
              text-gray-500
              mt-2
            ">
              Voulez-vous vraiment supprimer ce projet ?
              Cette action est irréversible.
            </p>

            <div className="
              flex
              justify-end
              gap-3
              mt-6
            ">

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  text-gray-600
                  hover:bg-gray-100
                "
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDeleteProject}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-500
                  text-white
                  hover:bg-red-600
                "
              >
                Supprimer
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MODALE AJOUT COLLABORATEUR
      ====================================================== */}

      {showCollaboratorModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/30
            flex
            items-center
            justify-center
            z-50
            px-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              p-6
              w-full
              max-w-md
            "
          >

            {/* HEADER */}

            <div className="
              flex
              justify-between
              items-center
              mb-5
            ">

              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-gray-800
                ">
                  Ajouter un collaborateur
                </h2>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  Donnez accès à ce projet à un utilisateur.
                </p>

              </div>

              <button
                type="button"
                onClick={closeCollaboratorModal}
                className="
                  text-gray-400
                  hover:text-gray-600
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* FORMULAIRE */}

            <p className="mb-4 text-sm text-gray-500">
              Invitez une personne par e-mail, même si elle n’a pas encore de compte.
            </p>
            {invitationUrl && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                <p className="mb-2">L’e-mail d’invitation a été envoyé à {collaboratorEmail}. Vous pouvez aussi copier ce lien :</p>
                <div className="flex gap-2">
                  <input readOnly value={invitationUrl} className="min-w-0 flex-1 rounded border bg-white px-2 py-2 text-xs" />
                  <button type="button" onClick={() => navigator.clipboard.writeText(invitationUrl)} className="rounded bg-primary px-3 py-2 text-white">Copier</button>
                </div>
                <a className="mt-2 inline-block text-primary underline" href={`mailto:${encodeURIComponent(collaboratorEmail)}?subject=${encodeURIComponent(`Invitation au projet ${project.name}`)}&body=${encodeURIComponent(`Bonjour,\n\nJe vous invite à rejoindre le projet ${project.name}. Créez votre compte ou connectez-vous avec cette adresse e-mail, puis acceptez l’invitation :\n${invitationUrl}`)}`}>
                  Ouvrir un e-mail prérempli
                </a>
              </div>
            )}

            <form onSubmit={handleAddCollaborator}>

              {/* EMAIL */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">
                  Adresse email
                </label>

                <input
                  type="email"
                  value={collaboratorEmail}
                  onChange={(e) =>
                    setCollaboratorEmail(
                      e.target.value
                    )
                  }
                  placeholder="exemple@email.com"
                  required
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                />

              </div>

              {/* ROLE */}

              <div className="mb-4">

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">
                  Rôle
                </label>

                <select
                  value={collaboratorRole}
                  onChange={(e) =>
                    setCollaboratorRole(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                >

                  <option value="lecture">
                    Lecture
                  </option>

                  <option value="modification">
                    Modification
                  </option>

                </select>

              </div>

              {/* ERREUR */}

              {collaboratorError && (

                <div className="
                  mb-4
                  p-3
                  rounded-lg
                  bg-red-50
                  text-red-600
                  text-sm
                ">
                  {collaboratorError}
                </div>

              )}

              {/* BUTTONS */}

              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                <button
                  type="button"
                  onClick={closeCollaboratorModal}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    text-gray-600
                    hover:bg-gray-100
                  "
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={addingCollaborator}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-primary
                    text-white
                    hover:opacity-90
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {addingCollaborator
                    ? "Ajout..."
                    : "Ajouter"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          MODALE TOUS LES COLLABORATEURS
      ====================================================== */}

      {showAllCollaboratorsModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/30
            flex
            items-center
            justify-center
            z-50
            px-4
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-xl
              p-6
              w-full
              max-w-lg
              max-h-[80vh]
              overflow-y-auto
            "
          >

            {/* HEADER */}

            <div className="
              flex
              justify-between
              items-center
              mb-5
            ">

              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-gray-800
                ">
                  Collaborateurs
                </h2>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">

                  {project.collaborators?.length || 0}

                  {" "}collaborateur

                  {project.collaborators?.length > 1
                    ? "s"
                    : ""}

                </p>

              </div>

              <button
                type="button"
                onClick={closeAllCollaboratorsModal}
                className="
                  text-gray-400
                  hover:text-gray-600
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* LISTE */}

            {project.collaborators?.length === 0 ? (

              <div className="
                text-sm
                text-gray-500
                py-6
                text-center
              ">
                Aucun collaborateur.
              </div>

            ) : (

              <div className="space-y-3">

                {project.collaborators.map(
                  (collaborator) => (

                    <div
                      key={collaborator.user._id}
                      className="
                        flex
                        items-center
                        justify-between
                        border
                        border-gray-100
                        rounded-lg
                        p-3
                        hover:bg-gray-50
                        transition
                        gap-3
                      "
                    >

                      {/* USER */}

                      <div className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      ">

                        {/* AVATAR */}

                        <div
                          className="
                            w-10
                            h-10
                            flex-shrink-0
                            rounded-full
                            bg-primary
                            text-white
                            flex
                            items-center
                            justify-center
                            font-semibold
                            text-sm
                          "
                        >

                          {collaborator.user.firstName
                            ?.charAt(0)
                            .toUpperCase()}

                          {collaborator.user.lastName
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        {/* INFOS */}

                        <div className="min-w-0">

                          <p className="
                            font-medium
                            text-gray-800
                            truncate
                          ">
                            {collaborator.user.firstName}{" "}
                            {collaborator.user.lastName}
                          </p>

                          <p className="
                            text-sm
                            text-gray-500
                            truncate
                          ">
                            {collaborator.user.email}
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="
                        flex
                        items-center
                        gap-2
                        flex-shrink-0
                      ">

                        {/* ROLE */}

                        <select
                          value={collaborator.role}
                          onChange={(e) =>
                            handleRoleChange(
                              collaborator.user._id,
                              e.target.value
                            )
                          }
                          className="
                            border
                            border-gray-300
                            rounded-lg
                            px-2
                            py-1.5
                            text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-primary
                          "
                        >

                          <option value="lecture">
                            Lecture
                          </option>

                          <option value="modification">
                            Modification
                          </option>

                        </select>

                        {/* RETIRER */}

                        <button
                          type="button"
                          onClick={() =>
                            openRemoveCollaboratorModal(
                              collaborator
                            )
                          }
                          className="
                            px-2
                            py-1.5
                            rounded-lg
                            text-sm
                            text-red-600
                            hover:bg-red-50
                            transition
                          "
                        >
                          Retirer
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

            {/* FOOTER */}

            <div className="
              flex
              justify-end
              mt-6
            ">

              <button
                type="button"
                onClick={closeAllCollaboratorsModal}
                className="
                  px-4
                  py-2
                  rounded-lg
                  text-gray-600
                  hover:bg-gray-100
                  transition
                "
              >
                Fermer
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MODALE CONFIRMATION RETRAIT COLLABORATEUR
      ====================================================== */}

      {showRemoveCollaboratorModal &&
        selectedCollaborator && (

          <div
            className="
              fixed
              inset-0
              bg-black/30
              flex
              items-center
              justify-center
              z-[60]
              px-4
            "
          >

            <div
              className="
                bg-white
                rounded-xl
                shadow-xl
                p-6
                w-full
                max-w-md
              "
            >

              <h2 className="
                text-lg
                font-semibold
                text-gray-800
              ">
                Retirer le collaborateur
              </h2>

              <p className="
                text-sm
                text-gray-500
                mt-2
              ">

                Voulez-vous vraiment retirer{" "}

                <span className="
                  font-medium
                  text-gray-700
                ">
                  {selectedCollaborator.user.firstName}{" "}
                  {selectedCollaborator.user.lastName}
                </span>

                {" "}de ce projet ?

              </p>

              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                {/* ANNULER */}

                <button
                  type="button"
                  onClick={closeRemoveCollaboratorModal}
                  disabled={removingCollaborator}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    text-gray-600
                    hover:bg-gray-100
                    disabled:opacity-50
                  "
                >
                  Annuler
                </button>

                {/* RETIRER */}

                <button
                  type="button"
                  onClick={handleRemoveCollaborator}
                  disabled={removingCollaborator}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-red-500
                    text-white
                    hover:bg-red-600
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  {removingCollaborator
                    ? "Retrait..."
                    : "Retirer"}

                </button>

              </div>

            </div>

          </div>

        )}

    </DashboardLayout>
  );
}
