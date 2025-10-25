import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔹 HEADER */}
      <header className="bg-gradient-to-r from-purple-100 to-indigo-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>

            <h1 className="text-lg font-semibold text-gray-700">
              InterviewBuddy Admin
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-indigo-700 hover:underline">
              Dashboard
            </Link>
            <i className="bi bi-bell text-gray-500"></i>
            <i className="bi bi-person-circle text-gray-600 text-xl"></i>
          </div>
        </div>
      </header>

      {/* 🔹 MAIN CONTENT */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">{children}</div>
      </main>

      {/* 🔹 FOOTER */}
      <footer className="bg-gradient-to-r from-indigo-100 to-purple-100 text-center py-4 text-gray-600 text-sm">
        © 2025 InterviewBuddy | Crafted with 💜 by Nikhilesh
      </footer>
    </div>
  );
}
