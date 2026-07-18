import { Plus,Bell, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
export default function Navbar({ user }) {
  console.log(user);
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

const handleNotifications = () => {
  alert("Vous n'avez pas de nouvelles notifications");
};
const toggleTheme = () => {
  const newTheme = !darkMode;

  setDarkMode(newTheme);

  if (newTheme) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
  const location = useLocation();

  const isProjectDetails =
    /^\/projects\/[a-f0-9]{24}$/.test(location.pathname);

    const isDashboard = location.pathname === "/dashboard";


  return (
   <div className="h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6">

      <div className="text-sm text-gray-600 dark:text-gray-200">
        Bonjour, {user?.firstName}
      </div>


     <div className="flex items-center gap-3">


{isDashboard && (
  <div className="flex gap-3">

    <button
      onClick={handleNotifications}
      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
    >
      <Bell size={18}/>
    </button>

<button
  onClick={toggleTheme}
  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
>
  <Moon size={18}/>
</button>

  </div>
)}
  <Link
    to={
      isProjectDetails
        ? `${location.pathname}/tasks/new`
        : "/projects/new"
    }
    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
  >
    <Plus size={18} />

    {isProjectDetails
      ? "Nouvelle tâche"
      : "Nouveau projet"
    }

  </Link>

</div>


    </div>
  );
}
