import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
