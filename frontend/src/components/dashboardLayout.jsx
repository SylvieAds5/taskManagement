import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, user }) {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">

      {/* SIDEBAR FIXE */}
      <aside className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </aside>


      {/* CONTENU A DROITE */}
      <div className="flex-1 ml-64 flex flex-col">


        {/* NAVBAR FIXE */}
        <Navbar user={user} />


        {/* SEUL CETTE PARTIE SCROLLE */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {children}
        </main>


      </div>

    </div>
  );
}