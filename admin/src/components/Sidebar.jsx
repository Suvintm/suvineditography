import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-20 text-xs sm:w-64  bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              Upload Stocks
            </NavLink>
          </li>
          

        <li>
          <NavLink
            to="/upload-pack"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Upload Pack
          </NavLink>
        </li>

        </ul>
      </nav>
    </aside>
  );
}
