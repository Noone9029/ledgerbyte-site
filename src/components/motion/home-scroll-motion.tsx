"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { desktopStoryQuery } from "./desktop-story";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Scene = { element: HTMLElement; trigger: ScrollTrigger };

export function HomeScrollMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const media = gsap.matchMedia();
    // Keep scene ownership outside matchMedia so its cleanup can bookmark the
    // active pin before removing spacing and restoring the server-rendered art.
    const context = gsap.context(() => {}, root);
    const seen = new WeakSet<HTMLElement>();
    let disposed = false;

    media.add(desktopStoryQuery, (mediaContext) => {
      const header = document.querySelector<HTMLElement>(".accounting-header");
      const stages = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
      const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
      let scenes: Scene[] = [];
      let timer = 0;
      let failed = false;
      let dimensions = "";
      let lastActive: { element: HTMLElement; progress: number } | undefined;

      const pinTop = () => (header?.offsetHeight ?? 0) + 16;
      const measure = () => [window.innerWidth, window.innerHeight, header?.offsetHeight,
        ...stages.flatMap((stage) => [stage.offsetWidth, stage.offsetHeight])].join(":");

      function capturePosition() {
        // ScrollTrigger temporarily unpins before matchMedia cleanup. Preserve
        // the last normal update rather than that intermediate reverted state.
        const active = scenes.find(({ trigger }) => trigger.isActive) ??
          scenes.find(({ element }) => element === lastActive?.element);
        const anchor = active?.element ?? Array.from(root!.querySelectorAll<HTMLElement>("main > section"))
          .find((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= pinTop() && rect.bottom > pinTop();
          });
        return { active, progress: active?.trigger.isActive ? active.trigger.progress : lastActive?.progress ?? 0, anchor,
          top: anchor?.getBoundingClientRect().top ?? 0 };
      }

      function restorePosition(position: ReturnType<typeof capturePosition>) {
        if (!position.anchor?.isConnected) return;
        const updated = scenes.find((scene) => scene.element === position.active?.element);
        const top = updated
          ? updated.trigger.start + position.progress * (updated.trigger.end - updated.trigger.start)
          : window.scrollY + position.anchor.getBoundingClientRect().top -
            (position.active ? pinTop() : position.top);
        window.scrollTo({ top, behavior: "instant" });
        ScrollTrigger.update();
      }

      function revertContext() {
        if (!context.isReverted) context.revert();
      }

      function build(preservePosition = true) {
        if (disposed || failed || !root!.isConnected) return;
        const position = preservePosition ? capturePosition() : undefined;
        try {
          revertContext();
          scenes = [];
          lastActive = undefined;
          stages.forEach((stage) => delete stage.dataset.sceneState);
          context.add(() => {
            const top = pinTop();
            const available = window.innerHeight - top - 20;

            stages.forEach((stage) => {
              if (stage.offsetHeight > available) {
                stage.dataset.sceneState = "static";
                return;
              }
              const hero = stage.dataset.scrollScene === "hero";
              const timeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  id: `ledgerbyte-${stage.dataset.scrollScene}`,
                  trigger: stage,
                  start: () => `top ${pinTop()}px`,
                  end: () => `+=${window.innerHeight * (hero ? 0.6 : 1.4)}`,
                  pin: stage,
                  pinSpacing: true,
                  scrub: true,
                  invalidateOnRefresh: true,
                  onUpdate: ({ isActive, progress }) => {
                    if (isActive) lastActive = { element: stage, progress };
                    else if (lastActive?.element === stage) lastActive = undefined;
                  },
                  onToggle: ({ isActive }) => {
                    const artwork = stage.querySelector<HTMLElement>("[data-hero-artwork]");
                    if (artwork) artwork.style.willChange = isActive ? "transform" : "auto";
                  },
                },
              });
              // Explicit full-length track gives the final diagram a quiet hold.
              timeline.to({}, { duration: 1 }, 0);
              if (hero) {
                timeline.fromTo(stage.querySelector("[data-hero-line]"),
                  { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7 }, 0);
                timeline.fromTo(stage.querySelector("[data-hero-artwork]"),
                  { y: 0, scale: 1 }, { y: -20, scale: 1.035, duration: 0.55 }, 0.1);
                timeline.fromTo(stage.querySelector("[data-hero-accents]"),
                  { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.6);
              } else {
                stage.querySelectorAll<SVGGElement>("[data-ledger-row]").forEach((row, index) => {
                  const offsets = [[-16, -12], [12, -4], [-9, 5], [16, 9], [-11, 16], [9, 21]];
                  timeline.fromTo(row, { x: offsets[index][0], y: offsets[index][1], opacity: 0.45 },
                    { x: 0, y: 0, opacity: 1, duration: 0.35 }, 0);
                });
                timeline.fromTo(stage.querySelector("[data-report-panel]"),
                  { x: -18, y: 12, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.4 }, 0.25);
                timeline.fromTo(stage.querySelector("[data-report-line]"),
                  { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 0.25);
                timeline.fromTo(stage.querySelector("[data-report-bars]"),
                  { scaleY: 0.15, svgOrigin: "340 368" }, { scaleY: 1, duration: 0.4 }, 0.25);
                timeline.fromTo(stage.querySelector("[data-report-point]"),
                  { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.55);
                timeline.fromTo(stage.querySelector("[data-forecast-reveal]"),
                  { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35 }, 0.55);
                timeline.fromTo(stage.querySelector("[data-forecast-point]"),
                  { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.8);
              }
              if (timeline.scrollTrigger) scenes.push({ element: stage, trigger: timeline.scrollTrigger });
              stage.dataset.sceneState = "pinned";
            });

            groups.forEach((group) => {
              if (seen.has(group)) return;
              gsap.fromTo(group, { y: 12 }, {
                y: 0,
                duration: parseFloat(getComputedStyle(root!).getPropertyValue("--motion-story-settle")) / 1000,
                ease: "power3.out",
                clearProps: "transform",
                scrollTrigger: {
                  trigger: group,
                  start: "top 90%",
                  once: true,
                  onEnter: () => seen.add(group),
                },
              });
            });
          });
          ScrollTrigger.refresh();
          if (position) restorePosition(position);
          dimensions = measure();
          root!.dataset.motionState = "ready";
        } catch {
          revertContext();
          scenes = [];
          stages.forEach((stage) => { stage.dataset.sceneState = "static"; });
          root!.dataset.motionState = "static";
          failed = true;
          if (position) restorePosition(position);
        }
      }

      const schedule = (refreshLayout = false) => {
        if (disposed || failed) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (measure() !== dimensions) build();
          else if (refreshLayout === true) ScrollTrigger.refresh();
        }, 180);
      };
      const resize = () => schedule();
      const assetsReady = () => schedule(true);
      const focus = (event: FocusEvent) => {
        const group = (event.target as Element).closest<HTMLElement>("[data-scroll-reveal]");
        if (!group) return;
        seen.add(group);
        gsap.killTweensOf(group);
        gsap.set(group, { clearProps: "transform" });
      };
      mediaContext.ignore(() => build(false));
      const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(resize);
      stages.forEach((stage) => observer?.observe(stage));
      if (header) observer?.observe(header);
      window.addEventListener("resize", resize);
      window.addEventListener("pageshow", assetsReady);
      root.addEventListener("focusin", focus);
      const images = Array.from(root.querySelectorAll("img"));
      images.forEach((image) => image.addEventListener("load", assetsReady));
      void document.fonts.ready.then(assetsReady);

      return () => {
        const position = capturePosition();
        const path = window.location.pathname;
        window.clearTimeout(timer);
        observer?.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pageshow", assetsReady);
        root.removeEventListener("focusin", focus);
        images.forEach((image) => image.removeEventListener("load", assetsReady));
        revertContext();
        scenes = [];
        stages.forEach((stage) => {
          delete stage.dataset.sceneState;
          stage.querySelector<HTMLElement>("[data-hero-artwork]")?.style.removeProperty("will-change");
        });
        delete root.dataset.motionState;
        // A media-query change should keep the current chapter in view.
        requestAnimationFrame(() => {
          if (!disposed && root.isConnected && window.location.pathname === path) restorePosition(position);
        });
      };
    });

    return () => {
      disposed = true;
      media.revert();
    };
  }, { scope });

  return <div className="accounting-scroll-story" ref={scope}>{children}</div>;
}
