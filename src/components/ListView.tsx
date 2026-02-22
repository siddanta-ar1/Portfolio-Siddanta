"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Project } from "@/types/project";

interface ListViewProps {
  projects: Project[];
  onHoverProject: (project: Project | null) => void;
}

const IMAGE_W = 340;
const IMAGE_H = 440;

export default function ListView({ projects, onHoverProject }: ListViewProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const xTo = useRef<((value: number) => void) | null>(null);
  const yTo = useRef<((value: number) => void) | null>(null);
  const isHovering = useRef(false);
  const [activeImageUrl, setActiveImageUrl] = useState("");
  const [activeImageAlt, setActiveImageAlt] = useState("");

  // Preload all project images on mount
  useEffect(() => {
    projects.forEach((p) => {
      if (p.image_url) {
        const img = new Image();
        img.src = p.image_url;
      }
    });
  }, [projects]);

  // Initialize GSAP quickTo for buttery-smooth cursor following
  useEffect(() => {
    if (!imageRef.current) return;

    xTo.current = gsap.quickTo(imageRef.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(imageRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });
  }, []);

  const handleRowEnter = useCallback(
    (project: Project) => {
      isHovering.current = true;
      setActiveImageUrl(project.image_url);
      setActiveImageAlt(project.title);
      onHoverProject(project);

      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current, "opacity,scale");
        gsap.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    },
    [onHoverProject]
  );

  const handleContainerLeave = useCallback(() => {
    isHovering.current = false;
    onHoverProject(null);

    if (imageRef.current) {
      gsap.killTweensOf(imageRef.current, "opacity,scale");
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.4,
        ease: "power3.in",
        overwrite: "auto",
      });
    }
  }, [onHoverProject]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!xTo.current || !yTo.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Adaptive positioning — flip side based on cursor position
    let targetX: number;
    if (e.clientX > vw / 2) {
      // Cursor on right half → image appears to the left
      targetX = e.clientX - IMAGE_W - 40;
    } else {
      // Cursor on left half → image appears to the right
      targetX = e.clientX + 40;
    }

    // Vertically center on cursor, clamped to viewport
    let targetY = e.clientY - IMAGE_H / 2;
    targetY = Math.max(16, Math.min(targetY, vh - IMAGE_H - 16));

    xTo.current(targetX);
    yTo.current(targetY);
  }, []);

  return (
    <div className="list-view" onMouseLeave={handleContainerLeave}>
      <div className="list-container" onMouseMove={handleMouseMove}>
        {/* Project counter */}
        <div className="list-header">
          <span className="list-count">
            {String(projects.length).padStart(2, "0")} PROJECTS
          </span>
        </div>

        {/* Project rows */}
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="list-row"
            onMouseEnter={() => handleRowEnter(project)}
          >
            <span className="list-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="list-title">{project.title}</span>
            <div className="list-meta">
              <span className="list-category">{project.category}</span>
              <span className="list-year">{project.year}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cursor-following hover image */}
      <div
        ref={imageRef}
        className="list-hover-image"
        style={{
          opacity: 0,
          transform: "scale(0.92)",
          width: IMAGE_W,
          height: IMAGE_H,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgElRef}
          src={activeImageUrl}
          alt={activeImageAlt}
          draggable={false}
        />
      </div>
    </div>
  );
}
