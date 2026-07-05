import { LayoutDashboard, ClipboardList, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Voulez-vous vraiment vous déconnecter ?",
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between p-6">
      {/* TOP */}
      <div>
        <h1 className="text-xl font-bold text-primary mb-10">
          Gestion des tâches
        </h1>

        <nav className="space-y-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-700 hover:text-primary transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
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
          onClick={handleLogout}
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
    </div>
  );
}
