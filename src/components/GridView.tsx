"use client";

import { Project } from "@/types/project";
import { getImageUrl, handleImageError } from "@/lib/placeholder";

interface GridViewProps {
  filteredProjects: Project[];
  onSelectProject: (index: number) => void;
}

export default function GridView({
  filteredProjects,
  onSelectProject,
}: GridViewProps) {
  return (
    <div className="fixed inset-0 z-[1] overflow-y-auto overflow-x-hidden scrollbar-none pt-24 pb-36 px-12 md:px-16 lg:px-20 xl:px-24">
      <div className="group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-14 xl:gap-16 max-w-[1600px] mx-auto">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(index)}
            className="cursor-pointer overflow-hidden h-[170px] md:h-[210px] lg:h-[250px] xl:h-[280px] transition-opacity duration-500 ease-out group-hover:opacity-30 hover:!opacity-100"
            style={{ backgroundColor: "var(--background)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(project.image_url, project.category)}
              onError={handleImageError(project.category)}
              alt={project.title}
              loading={index <= 11 ? "eager" : "lazy"}
              draggable={false}
              className="w-full h-full object-contain block transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
