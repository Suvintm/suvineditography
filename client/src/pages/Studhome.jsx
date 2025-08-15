import React, { useEffect, useState, useContext } from "react";
import StudNav from "../components/StudNav";
import ProjectContainer from "../components/ProjectContainer";
import { AppContext } from "../context/AppContext";

export default function StudHome() {
  const { backendUrl, token } = useContext(AppContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${backendUrl}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, [backendUrl, token]);

  return (
    <div className="min-h-screen bg- flex flex-col">
      <StudNav />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="bg-gradient-to-bl from-purple-700 to-purple-100 rounded-2xl p-8 shadow mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Start Editing Your Photo with Suvin Studio
          </h1>
          <p className="text-gray-600 mb-4">
            Create, edit, and manage your photo projects with ease.
          </p>
          <button
            onClick={() => (window.location.href = "/studio/editor")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700 transition"
          >
            Start New Project
          </button>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Previous Projects
          </h2>
          <ProjectContainer projects={projects} />
        </section>
      </main>
    </div>
  );
}
