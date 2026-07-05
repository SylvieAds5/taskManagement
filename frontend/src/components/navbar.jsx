import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <div className="h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6">

      {/* GAUCHE */}
      <div className="text-sm text-gray-600">
        Bonjour, {user?.firstName}
      </div>

      {/* DROITE */}
      <Link
        to="/tasks/new"
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        <Plus size={18} />
        Nouvelle tâche
      </Link>

    </div>
  );
}

