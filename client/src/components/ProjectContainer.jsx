import React from "react";

export default function ProjectContainer({ projects = [] }) {
  // Dummy data for testing UI
  const dummyProjects = [
    {
      _id: "1",
      name: "Beach Sunset Edit",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
      updatedAt: "2025-08-01T10:30:00Z",
    },
    {
      _id: "2",
      name: "Mountain Landscape",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500",
      updatedAt: "2025-08-10T14:15:00Z",
    },
    {
      _id: "3",
      name: "City Night Lights",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
      updatedAt: "2025-08-12T18:45:00Z",
    },
  ];

  // Use dummy data if no real projects are passed
  const displayProjects = projects.length > 0 ? projects : dummyProjects;

  return (
    <div className="mt-6 bg-zinc-900 p-4 sm:p-10 rounded-xl">
      {/* 2 per row on mobile */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayProjects.map((project) => (
          <div
            key={project._id}
            className="bg-zinc-100 rounded-xl shadow hover:shadow-lg transition p-2 sm:p-3 cursor-pointer"
            onClick={() =>
              (window.location.href = `/studio/editor/${project._id}`)
            }
          >
            <img
              src={project.thumbnailUrl || "/placeholder.jpg"}
              alt={project.name}
              className="w-full h-28 md:h-40 object-cover rounded-lg mb-2 sm:mb-3"
            />
            <h3 className="text-sm sm:text-lg font-medium text-gray-800 truncate">
              {project.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Last edited: {new Date(project.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
