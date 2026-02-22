"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Project } from "@/types/project";
import { getImageUrl, handleImageError } from "@/lib/placeholder";

interface ImageCarouselProps {
  projects: Project[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImageCarousel({
  projects,
  activeIndex,
  onIndexChange,
}: ImageCarouselProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── React state — only drives JSX re-renders ──
  const [slideWidth, setSlideWidth] = useState(0);
  const [maxImgHeight, setMaxImgHeight] = useState(0);
  const [slideGap, setSlideGap] = useState(128);
  const [padLeft, setPadLeft] = useState(0);
  const [ready, setReady] = useState(false);

  // ── All-ref animation state — zero React re-renders during motion ──
  const liveXRef = useRef(0); // actual rendered position right now
  const targetXRef = useRef(0); // destination we are lerping toward
  const targetIndexRef = useRef(0); // destination slide index
  const lastReportedIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // ── Dimension refs — mirror state so event handlers / RAF can read
  //    them without closing over stale state values ──
  const swRef = useRef(0); // slideWidth
  const sgRef = useRef(0); // slideGap
  const plRef = useRef(0); // padLeft
  const pcRef = useRef(projects.length); // project count

  useEffect(() => {
    swRef.current = slideWidth;
  }, [slideWidth]);
  useEffect(() => {
    sgRef.current = slideGap;
  }, [slideGap]);
  useEffect(() => {
    plRef.current = padLeft;
  }, [padLeft]);
  useEffect(() => {
    pcRef.current = projects.length;
  }, [projects.length]);

  // ── Stable callback ref ──
  const onIndexChangeRef = useRef(onIndexChange);
  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  // ────────────────────────────────────────────────
  // 1. Responsive dimensions
  // ────────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let w: number, mh: number, gap: number;

      if (vw <= 480) {
        w = vw * 0.7;
        mh = vh * 0.5;
        gap = (vw - w) / 2 - 20;
      } else if (vw <= 768) {
        w = vw * 0.55;
        mh = vh * 0.55;
        gap = (vw - w) / 2 - 35;
      } else if (vw <= 1024) {
        w = vw * 0.36;
        mh = vh * 0.58;
        gap = (vw - w) / 2 - 60;
      } else {
        w = Math.min(vw * 0.27, 460);
        mh = vh * 0.6;
        gap = (vw - w) / 2 - vw * 0.065;
      }

      gap = Math.max(gap, 16);
      const pl = Math.round(vw / 2 - w / 2);
      const rw = Math.round(w);
      const rg = Math.round(gap);

      // Keep refs in sync immediately so the RAF loop picks up new dims
      // even before React flushes the state update.
      swRef.current = rw;
      sgRef.current = rg;
      plRef.current = pl;

      setSlideWidth(rw);
      setMaxImgHeight(Math.round(mh));
      setSlideGap(rg);
      setPadLeft(pl);
      setReady(true);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ────────────────────────────────────────────────
  // 2. Center-focus visual effect
  //    Reads only from refs — safe to call from RAF with no stale-closure risk.
  // ────────────────────────────────────────────────
  const applyCenterFocus = useCallback((x: number) => {
    const sw = swRef.current;
    const sg = sgRef.current;
    const pl = plRef.current;
    if (sw <= 0) return;

    const viewportCenter = window.innerWidth / 2;
    const influence = (sw + sg) * 1.1;

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const center = pl + i * (sw + sg) + sw / 2 + x;
      const dist = Math.abs(center - viewportCenter);
      const t = Math.min(dist / influence, 1);

      gsap.set(slide, {
        scale: 1.18 - t * 0.26, // 1.18 at center → 0.92 at edge
        opacity: 1 - t * 0.22, // 1.00 at center → 0.78 at edge
        zIndex: Math.round((1 - t) * 20) + 1,
        force3D: true,
      });
    });
  }, []); // intentionally empty — only uses refs

  // ────────────────────────────────────────────────
  // 3. Initialize position once dimensions are ready
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || slideWidth === 0 || isInitializedRef.current) return;

    const offset = -(activeIndex * (swRef.current + sgRef.current));
    liveXRef.current = offset;
    targetXRef.current = offset;
    targetIndexRef.current = activeIndex;
    lastReportedIndexRef.current = activeIndex;

    if (trackRef.current) {
      gsap.set(trackRef.current, { x: offset, force3D: true });
    }
    applyCenterFocus(offset);
    isInitializedRef.current = true;
  }, [ready, slideWidth, activeIndex, applyCenterFocus]);

  // ────────────────────────────────────────────────
  // 4. RAF lerp loop — the engine of all smooth motion
  //
  //    Every frame:
  //      liveX += (targetX - liveX) * LERP
  //
  //    This gives butter-smooth easing for ANY source of motion
  //    (wheel, drag, arrows, keyboard) without ever killing/restarting
  //    a tween. No jerk possible.
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || slideWidth === 0) return;

    const LERP = 0.1; // 0.05 = silky/slow  |  0.1 = smooth  |  0.18 = snappy

    const tick = () => {
      const diff = targetXRef.current - liveXRef.current;

      if (Math.abs(diff) > 0.05) {
        liveXRef.current += diff * LERP;

        if (trackRef.current) {
          gsap.set(trackRef.current, { x: liveXRef.current, force3D: true });
        }
        applyCenterFocus(liveXRef.current);

        // Update parent state (for footer metadata) when live position
        // crosses into a new slide — NOT on every frame, NOT on every wheel event.
        const step = swRef.current + sgRef.current;
        if (step > 0) {
          const nearest = Math.max(
            0,
            Math.min(Math.round(-liveXRef.current / step), pcRef.current - 1),
          );
          if (nearest !== lastReportedIndexRef.current) {
            lastReportedIndexRef.current = nearest;
            onIndexChangeRef.current(nearest);
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, slideWidth, applyCenterFocus]);

  // ────────────────────────────────────────────────
  // 5. Sync target when activeIndex prop changes from outside
  //    (e.g. parent-level navigation, external controls)
  //    Skip if we triggered the change ourselves (goTo already set the ref).
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!isInitializedRef.current) return;
    if (activeIndex === targetIndexRef.current) return;
    targetIndexRef.current = activeIndex;
    targetXRef.current = -(activeIndex * (swRef.current + sgRef.current));
  }, [activeIndex]);

  // ────────────────────────────────────────────────
  // 6. Navigate to index — sets targetX directly, no React round-trip
  // ────────────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, pcRef.current - 1));
    targetIndexRef.current = clamped;
    targetXRef.current = -(clamped * (swRef.current + sgRef.current));
    // Also inform parent immediately so footer/metadata update right away
    onIndexChangeRef.current(clamped);
    lastReportedIndexRef.current = clamped;
  }, []); // uses only refs — never needs to be recreated

  const goNext = useCallback(() => goTo(targetIndexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(targetIndexRef.current - 1), [goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // ────────────────────────────────────────────────
  // 7. Wheel — directly updates targetX, zero React re-render path
  //    Accumulate small deltas (trackpad); step when threshold crossed.
  // ────────────────────────────────────────────────
  const wheelAccumRef = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !ready) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Use the dominant axis; normalise across deltaMode values
      let delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) delta *= 16; // line mode
      if (e.deltaMode === 2) delta *= window.innerHeight; // page mode

      wheelAccumRef.current += delta;

      // Step only once per accumulated threshold — prevents hyperspeed on
      // fast trackpads while still feeling instant on a click wheel.
      const THRESHOLD = 50;
      if (Math.abs(wheelAccumRef.current) < THRESHOLD) return;

      if (wheelAccumRef.current > 0) goNext();
      else goPrev();

      wheelAccumRef.current = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ready, goNext, goPrev]);

  // ────────────────────────────────────────────────
  // 8. Pointer drag / swipe
  //    During drag liveX === targetX so the finger tracks 1:1.
  //    On release we snap targetX to nearest slide and let the
  //    lerp loop ease the final settle.
  // ────────────────────────────────────────────────
  const isDragging = useRef(false);
  const dragStartClientX = useRef(0);
  const dragStartLiveX = useRef(0);
  const dragStartTime = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartClientX.current = e.clientX;
    dragStartLiveX.current = liveXRef.current;
    dragStartTime.current = Date.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const diff = e.clientX - dragStartClientX.current;
    const raw = dragStartLiveX.current + diff;

    // Rubber-band resistance beyond the first/last slide
    const sw = swRef.current;
    const sg = sgRef.current;
    const minX = -(pcRef.current - 1) * (sw + sg);
    const bounded =
      raw > 0 ? raw * 0.3 : raw < minX ? minX + (raw - minX) * 0.3 : raw;

    // During drag: live position follows finger exactly
    liveXRef.current = bounded;
    targetXRef.current = bounded;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const diff = e.clientX - dragStartClientX.current;
      const elapsed = Date.now() - dragStartTime.current;
      const velocity = diff / Math.max(elapsed, 1); // px/ms

      const sw = swRef.current;
      const sg = sgRef.current;

      // Flick: if fast enough, advance one slide in the flick direction
      let snapIndex: number;
      if (Math.abs(velocity) > 0.3) {
        snapIndex =
          velocity < 0
            ? Math.min(targetIndexRef.current + 1, pcRef.current - 1)
            : Math.max(targetIndexRef.current - 1, 0);
      } else {
        snapIndex = Math.max(
          0,
          Math.min(
            Math.round(-liveXRef.current / (sw + sg)),
            pcRef.current - 1,
          ),
        );
      }

      goTo(snapIndex);
    },
    [goTo],
  );

  // ────────────────────────────────────────────────
  // 9. Preload images
  // ────────────────────────────────────────────────
  useEffect(() => {
    projects.forEach((p) => {
      if (p.image_url) {
        const img = new Image();
        img.src = p.image_url;
      }
    });
  }, [projects]);

  // ────────────────────────────────────────────────
  // 10. Render
  // ────────────────────────────────────────────────
  if (!ready || slideWidth === 0) return null;

  return (
    <div
      ref={wrapRef}
      className="carousel-wrap"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <div
        ref={trackRef}
        className="carousel-track"
        style={{
          paddingLeft: `${padLeft}px`,
          paddingRight: `${padLeft}px`,
          gap: `${slideGap}px`,
        }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="carousel-slide"
            style={{
              width: slideWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: i === activeIndex ? "default" : "pointer",
            }}
            onClick={() => {
              if (i !== activeIndex) goTo(i);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(project.image_url, project.category)}
              onError={handleImageError(project.category)}
              alt={project.title}
              draggable={false}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: `${maxImgHeight}px`,
                width: "auto",
                height: "auto",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </div>
        ))}
      </div>

      {activeIndex > 0 && (
        <button
          className="nav-arrow left"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous project"
        >
          &#8592;
        </button>
      )}
      {activeIndex < projects.length - 1 && (
        <button
          className="nav-arrow right"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next project"
        >
          &#8594;
        </button>
      )}
    </div>
  );
}
