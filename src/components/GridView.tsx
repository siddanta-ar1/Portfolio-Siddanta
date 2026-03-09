"use client";

import { useEffect, useRef } from "react";
import { Project } from "@/types/project";
import { getImageUrl, handleImageError } from "@/lib/placeholder";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GridViewProps {
  filteredProjects: Project[];
  onSelectProject: (index: number) => void;
}

export default function GridView({
  filteredProjects,
  onSelectProject,
}: GridViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller || filteredProjects.length === 0) return;

    const ctx = gsap.context(() => {
      // Wave Deformation / Paper Curl setup
      gsap.set(".grid-curl-item", { transformPerspective: 800, transformOrigin: "center center" });

      // Staggered enter animation for wave effect
      ScrollTrigger.batch(".grid-curl-item", {
        scroller: scroller,
        interval: 0.1,
        batchMax: 4,
        onEnter: (batch) =>
          gsap.fromTo(batch,
            { opacity: 0, y: 100, rotateX: -45, scale: 0.9 },
            { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", overwrite: true }
          ),
        start: "top bottom-=50px",
      });

      // Based on velocity: skew and rotate items (paper curl under scroll pressure)
      const proxy = { skew: 0, rotateX: 0 };
      const setterSkew = gsap.quickSetter(".grid-curl-item", "skewY", "deg");
      const setterRotateX = gsap.quickSetter(".grid-curl-item", "rotateX", "deg");
      const clampSkew = gsap.utils.clamp(-12, 12);
      const clampRotate = gsap.utils.clamp(-20, 20);

      ScrollTrigger.create({
        scroller: scroller,
        trigger: scroller,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const targetSkew = clampSkew(velocity / -150);
          const targetRotate = clampRotate(velocity / -100);

          if (Math.abs(targetSkew) > Math.abs(proxy.skew) || Math.abs(targetRotate) > Math.abs(proxy.rotateX)) {
            proxy.skew = targetSkew;
            proxy.rotateX = targetRotate;
            gsap.to(proxy, {
              skew: 0,
              rotateX: 0,
              duration: 1.2,
              ease: "elastic.out(1, 0.4)", // Bouncy elastic return adds jellyfish/wave behavior
              overwrite: true,
              onUpdate: () => {
                setterSkew(proxy.skew);
                setterRotateX(proxy.rotateX);
              }
            });
          }
        }
      });
    }, scroller);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1] overflow-y-auto overflow-x-hidden scrollbar-none pt-20 pb-28 px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24"
    >
      <div className="group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 lg:gap-14 xl:gap-16 max-w-[1600px] mx-auto">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(index)}
            onMouseEnter={(e) => {
              const video = e.currentTarget.querySelector("video");
              if (video) video.play().catch(() => { });
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector("video");
              if (video) {
                video.pause();
                video.currentTime = 0; // Optional: Reset to start when mouse leaves, making it a true "preview hover"
              }
            }}
            className="grid-curl-item cursor-pointer overflow-hidden h-[140px] sm:h-[170px] md:h-[210px] lg:h-[250px] xl:h-[280px] transition-opacity duration-500 ease-out group-hover:opacity-30 hover:!opacity-100"
            style={{ backgroundColor: "var(--background)", willChange: "transform, opacity" }}
          >
            {project.video_url ? (
              <video
                src={project.video_url}
                loop
                muted
                playsInline
                className="w-full h-full object-contain block transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.04]"
              />
            ) : project.category === "RESEARCH" ? (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs md:text-sm tracking-widest text-foreground opacity-30 select-none uppercase border border-foreground/10 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.04]">
                [ Coming Soon ]
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={getImageUrl(project.image_url, project.category)}
                onError={handleImageError(project.category)}
                alt={project.title}
                loading={index <= 11 ? "eager" : "lazy"}
                draggable={false}
                className="w-full h-full object-contain block transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.04]"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
