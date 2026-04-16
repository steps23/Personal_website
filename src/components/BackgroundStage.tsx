import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

const SECTION_ORDER = ['hero', 'services', 'about', 'contact', 'site-footer'] as const;

type SectionId = (typeof SECTION_ORDER)[number];

type Measurement = {
  id: SectionId;
  top: number;
};

const ENTER_VIEWPORT_START = 0.82;
const ENTER_VIEWPORT_END = 0.18;

const SECTION_BACKGROUNDS: Record<SectionId, { light: string; dark: string }> = {
  hero: {
    light: `
      radial-gradient(circle at 50% 16%, rgba(125, 189, 255, 0.24) 0, rgba(125, 189, 255, 0) 40%),
      radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.92) 0, rgba(255, 255, 255, 0) 30%),
      linear-gradient(180deg, #f6f7fb 0%, #eef4ff 52%, #d9e7ff 100%)
    `,
    dark: `
      radial-gradient(circle at 52% 16%, rgba(74, 144, 226, 0.16) 0, rgba(74, 144, 226, 0) 38%),
      radial-gradient(circle at 82% 10%, rgba(19, 42, 99, 0.48) 0, rgba(19, 42, 99, 0) 26%),
      linear-gradient(180deg, #0d1220 0%, #111b34 54%, #0f172a 100%)
    `,
  },
  services: {
    light: `
      radial-gradient(circle at 50% 38%, rgba(125, 189, 255, 0.20) 0, rgba(125, 189, 255, 0) 36%),
      linear-gradient(180deg, #091692 0%, #08127f 48%, #07106f 100%)
    `,
    dark: `
      radial-gradient(circle at 50% 38%, rgba(74, 144, 226, 0.16) 0, rgba(74, 144, 226, 0) 36%),
      linear-gradient(180deg, #07105a 0%, #060c47 48%, #050a3d 100%)
    `,
  },
  about: {
    light: `
      radial-gradient(circle at 20% 16%, rgba(125, 189, 255, 0.16) 0, rgba(125, 189, 255, 0) 34%),
      linear-gradient(180deg, #edf3ff 0%, #f6f7fb 56%, #f2f5fb 100%)
    `,
    dark: `
      radial-gradient(circle at 20% 18%, rgba(74, 144, 226, 0.12) 0, rgba(74, 144, 226, 0) 34%),
      linear-gradient(180deg, #111827 0%, #0f172a 56%, #111827 100%)
    `,
  },
  contact: {
    light: `
      radial-gradient(circle at 50% 24%, rgba(125, 189, 255, 0.18) 0, rgba(125, 189, 255, 0) 36%),
      linear-gradient(180deg, #091692 0%, #08127f 48%, #07106f 100%)
    `,
    dark: `
      radial-gradient(circle at 50% 24%, rgba(74, 144, 226, 0.16) 0, rgba(74, 144, 226, 0) 36%),
      linear-gradient(180deg, #07105a 0%, #060c47 48%, #050a3d 100%)
    `,
  },
  'site-footer': {
    light: `
      radial-gradient(circle at 50% 24%, rgba(125, 189, 255, 0.18) 0, rgba(125, 189, 255, 0) 36%),
      linear-gradient(180deg, #091692 0%, #08127f 48%, #07106f 100%)
    `,
    dark: `
      radial-gradient(circle at 50% 24%, rgba(74, 144, 226, 0.16) 0, rgba(74, 144, 226, 0) 36%),
      linear-gradient(180deg, #07105a 0%, #060c47 48%, #050a3d 100%)
    `,
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const readMeasurements = (): Measurement[] =>
  SECTION_ORDER.map((id) => {
    const element = document.getElementById(id);
    if (!element) return null;

    const rect = element.getBoundingClientRect();

    return {
      id,
      top: rect.top + window.scrollY,
    };
  }).filter((item): item is Measurement => item !== null);

const computeLayers = (
  scrollY: number,
  viewportHeight: number,
  measurements: Measurement[]
) => {
  const fallbackId = measurements[measurements.length - 1]?.id ?? 'hero';

  for (let index = 0; index < measurements.length - 1; index += 1) {
    const current = measurements[index];
    const next = measurements[index + 1];

    const start = next.top - viewportHeight * ENTER_VIEWPORT_START;
    const end = next.top - viewportHeight * ENTER_VIEWPORT_END;

    if (scrollY < start) {
      return {
        currentId: current.id,
        nextId: next.id,
        progress: 0,
      };
    }

    if (scrollY <= end) {
      return {
        currentId: current.id,
        nextId: next.id,
        progress: clamp(
          (scrollY - start) / Math.max(1, end - start),
          0,
          1
        ),
      };
    }
  }

  return {
    currentId: fallbackId,
    nextId: fallbackId,
    progress: 1,
  };
};

export const BackgroundStage = React.memo(() => {
  const prefersReducedMotion = Boolean(useReducedMotion());

  const transitionProgress = useMotionValue(0);
  const smoothedProgress = useSpring(transitionProgress, {
    stiffness: 210,
    damping: 30,
    mass: 0.25,
  });

  const currentBg = useMotionValue(SECTION_BACKGROUNDS['hero'].light);
  const nextBg = useMotionValue(SECTION_BACKGROUNDS['services'].light);

  const measurementsRef = useRef<Measurement[]>([]);
  const rafRef = useRef<number | null>(null);

  const prevIds = useRef({ currentId: 'hero', nextId: 'services', isDark: false });

  const getIsDark = () => document.documentElement.classList.contains('dark');

  const applyScrollState = (scrollY: number) => {
    if (!measurementsRef.current.length) return;

    const computed = computeLayers(
      scrollY,
      window.innerHeight,
      measurementsRef.current
    );

    const isDark = getIsDark();
    const themeKey = isDark ? 'dark' : 'light';

    const newCurrentBg = SECTION_BACKGROUNDS[computed.currentId as SectionId][themeKey];
    const newNextBg = SECTION_BACKGROUNDS[computed.nextId as SectionId][themeKey];

    currentBg.set(newCurrentBg);
    nextBg.set(newNextBg);

    if (
      prevIds.current.currentId !== computed.currentId ||
      prevIds.current.nextId !== computed.nextId ||
      prevIds.current.isDark !== isDark
    ) {
      transitionProgress.set(computed.progress);
      if (smoothedProgress.jump) {
        smoothedProgress.jump(computed.progress);
      } else {
        smoothedProgress.set(computed.progress);
      }
      
      prevIds.current = {
        currentId: computed.currentId as SectionId,
        nextId: computed.nextId as SectionId,
        isDark,
      };
    } else {
      transitionProgress.set(computed.progress);
    }
  };

  const refreshMeasurements = () => {
    measurementsRef.current = readMeasurements();
    applyScrollState(window.scrollY);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        applyScrollState(window.scrollY);
      });
    };

    refreshMeasurements();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => refreshMeasurements())
        : null;

    SECTION_ORDER.forEach((id) => {
      const element = document.getElementById(id);
      if (element && resizeObserver) {
        resizeObserver.observe(element);
      }
    });

    const themeObserver = new MutationObserver(() => {
      applyScrollState(window.scrollY);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', refreshMeasurements);
    window.addEventListener('load', refreshMeasurements);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      resizeObserver?.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', refreshMeasurements);
      window.removeEventListener('load', refreshMeasurements);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ background: currentBg }} />

      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: prefersReducedMotion ? transitionProgress : smoothedProgress,
          background: nextBg,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.06),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/20 to-transparent dark:from-white/4" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/6 to-transparent dark:from-black/18" />
    </div>
  );
});

BackgroundStage.displayName = 'BackgroundStage';
