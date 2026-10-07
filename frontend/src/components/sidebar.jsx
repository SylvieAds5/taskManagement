import { LayoutDashboard, ClipboardList, Settings, LogOut,  FolderKanban  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

 const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  navigate("/login");
};

  return (
    <div className="w-56 h-screen bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between px-6 pt-0 pb-6">
      {/* TOP */}       
      <div>
       
<div className="-mt-8 mb-6 flex justify-center">
  <img
    src={logo}
    alt="Logo"
    className="h-36 object-contain"
  />
</div>
        <nav className="space-y-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-primary transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
  to="/projects"
  className="flex items-center gap-3 text-gray-700 hover:text-primary transition"
>
  <FolderKanban size={20} />
  Mes projets
</Link>

          <Link
            to="/tasks"
            className="flex items-center gap-3 text-gray-700 hover:text-primary transition"
          >
            <ClipboardList size={20} />
            Mes tâches
          </Link>

          <Link
            to="/tasks/new"
            className="flex items-center gap-3 text-gray-700 hover:text-primary transition"
          >
            <Settings size={20} />
            Paramètres
          </Link>
        </nav>
      </div>

      {/* BOTTOM */}
      <div>
        <button
  onClick={() => setShowLogoutModal(true)}
  className="
    flex items-center gap-3 text-red-500 
    hover:text-white hover:bg-red-500 
    px-3 py-2 rounded-lg 
    transition-all duration-200
  "
>
  <LogOut size={20} />
  Déconnexion
</button>
      </div>
    {showLogoutModal && (
  <div className="
    fixed inset-0 
    bg-black/30 
    flex 
    items-center 
    justify-center 
    z-50
  ">

    <div className="
      bg-white 
      rounded-xl 
      shadow-lg 
      p-6 
      w-80
    ">

      <h2 className="
        text-lg 
        font-semibold 
        text-gray-800
      ">
        Déconnexion
      </h2>

      <p className="
        text-sm 
        text-gray-500 
        mt-2
      ">
        Voulez-vous vraiment vous déconnecter ?
      </p>


      <div className="
        flex 
        justify-end 
        gap-3 
        mt-6
      ">

        <button
          onClick={() => setShowLogoutModal(false)}
          className="
            px-4 
            py-2 
            rounded-lg
            text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          Annuler
        </button>


        <button
          onClick={handleLogout}
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
          Déconnexion
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}
