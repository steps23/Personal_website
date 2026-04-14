import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Terminal, Code2, BookOpen } from 'lucide-react';
import { useSectionBackgroundColor } from '../hooks/useSectionBackgroundColor';

type Service = {
  title: string;
  items: string[];
  Icon: React.ComponentType<{ className?: string }>;
};

const servicesData: Service[] = [
  {
    title: 'AUDIT & ROADMAP',
    items: [
      'Analisi del contesto',
      'Mappatura processi',
      "Casi d'uso prioritari",
      "Adozione dell'AI",
    ],
    Icon: Terminal,
  },
  {
    title: 'SVILUPPO AI',
    items: [
      'Strumenti interni',
      'Workflow automatizzati',
      'Soluzioni su misura',
      'Integrazione AI',
    ],
    Icon: Code2,
  },
  {
    title: 'FORMAZIONE',
    items: [
      'Percorsi pratici',
      'Competenze operative',
      'Strumenti digitali',
      'Formazione AI/IT',
    ],
    Icon: BookOpen,
  },
];

const MOBILE_BREAKPOINT = 1024;
const DESKTOP_SECTION_HEIGHT = '380vh';
const MOBILE_INTRO_HEIGHT = '120svh';
const MOBILE_STEP_HEIGHT = '152svh';
const MOBILE_SPACER_HEIGHT = '36svh';

const face3dStyles: React.CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transformStyle: 'preserve-3d',
  WebkitTransformStyle: 'preserve-3d',
};

type CardFacesProps = {
  service: Service;
};

const CardFaces = React.memo(({ service }: CardFacesProps) => {
  const { Icon } = service;

  return (
    <>
      <div
        className="absolute inset-0 rounded-[2rem] border-[10px] border-white bg-[#f4f4f5] p-6 text-gray-900 shadow-2xl md:border-[12px] md:p-8"
        style={{
          ...face3dStyles,
          transform: 'rotateY(0deg) translateZ(0.1px)',
          WebkitTransform: 'rotateY(0deg) translateZ(0.1px)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="w-3/4 text-2xl font-black uppercase leading-none tracking-tighter md:text-3xl">
            {service.title}
          </h3>
          <Icon className="h-8 w-8 shrink-0" />
        </div>

        <div className="mt-8 md:mt-10">
          <ul className="space-y-3 text-sm font-medium text-gray-700 md:space-y-4">
            {service.items.map((item) => (
              <li key={item} className="border-b border-gray-300 pb-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex rotate-180 items-end justify-between md:bottom-8 md:left-8 md:right-8">
          <h3 className="w-3/4 text-2xl font-black uppercase leading-none tracking-tighter text-gray-300 md:text-3xl">
            {service.title}
          </h3>
          <Icon className="h-8 w-8 shrink-0 text-gray-300" />
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden rounded-[2rem] border-[10px] border-white shadow-2xl md:border-[12px]"
        style={{
          ...face3dStyles,
          transform: 'rotateY(180deg) translateZ(0.1px)',
          WebkitTransform: 'rotateY(180deg) translateZ(0.1px)',
          backgroundColor: '#000080',
        }}
      >
        <div className="absolute inset-0 bg-[#000080]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.9) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="absolute inset-[10px] rounded-[1.45rem] border border-white/25" />
        <div className="absolute inset-3 rounded-xl border-2 border-white/60" />
        <div className="absolute inset-5 rounded-lg border border-white/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-[#000080] shadow-[0_0_40px_rgba(255,255,255,0.28)] md:h-24 md:w-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 md:h-20 md:w-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 md:h-16 md:w-16">
                <span className="text-2xl font-black tracking-tighter text-white md:text-3xl">
                  SR
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-6 top-6 h-4 w-4 border-l-2 border-t-2 border-white/60 md:left-8 md:top-8 md:h-6 md:w-6" />
        <div className="absolute right-6 top-6 h-4 w-4 border-r-2 border-t-2 border-white/60 md:right-8 md:top-8 md:h-6 md:w-6" />
        <div className="absolute bottom-6 left-6 h-4 w-4 border-b-2 border-l-2 border-white/60 md:bottom-8 md:left-8 md:h-6 md:w-6" />
        <div className="absolute bottom-6 right-6 h-4 w-4 border-b-2 border-r-2 border-white/60 md:bottom-8 md:right-8 md:h-6 md:w-6" />
      </div>
    </>
  );
});

CardFaces.displayName = 'CardFaces';

type DesktopServiceCardProps = {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
};

const DesktopServiceCard = React.memo(
  ({ service, index, progress, reducedMotion }: DesktopServiceCardProps) => {
    const enterEnd = 0.18;
    const fanEnd = 0.42;

    const spreadX = reducedMotion ? 0 : (index - 1) * 290;
    const spreadRotate = reducedMotion ? 0 : (index - 1) * 6;

    const flipStart = reducedMotion ? 0 : 0.54 + index * 0.08;
    const flipEnd = reducedMotion ? 0 : flipStart + 0.18;

    const x = useTransform(progress, [0, enterEnd, fanEnd, 1], [0, 0, spreadX, spreadX]);
    const y = useTransform(progress, [0, enterEnd, fanEnd, 1], [reducedMotion ? 0 : 140, 0, 0, 0]);
    const rotateZ = useTransform(progress, [0, enterEnd, fanEnd, 1], [0, 0, spreadRotate, spreadRotate]);
    const scale = useTransform(progress, [0, enterEnd, fanEnd, 1], [0.96, 1, 1, 1]);

    const flipRotateY = useTransform(
      progress,
      [0, flipStart, flipEnd || 1, 1],
      [reducedMotion ? 0 : 180, reducedMotion ? 0 : 180, 0, 0]
    );

    const flipTransform = useMotionTemplate`perspective(1800px) rotateY(${flipRotateY}deg)`;

    return (
      <motion.div
        className="absolute h-[360px] w-[260px] will-change-transform md:h-[460px] md:w-[320px]"
        style={{
          x,
          y,
          rotateZ,
          scale,
          zIndex: 20 - Math.abs(index - 1),
        }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            transform: flipTransform,
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <CardFaces service={service} />
        </motion.div>
      </motion.div>
    );
  }
);

DesktopServiceCard.displayName = 'DesktopServiceCard';

type MobileServiceStepProps = {
  service: Service;
  index: number;
  reducedMotion: boolean;
  total: number;
};

const MobileServiceStep = React.memo(
  ({ service, index, reducedMotion, total }: MobileServiceStepProps) => {
    const stepRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
      target: stepRef,
      offset: ['start start', 'end end'],
    });

    const cardY = useTransform(scrollYProgress, [0, 0.14, 0.32, 1], [reducedMotion ? 0 : 96, 0, 0, -16]);
    const cardScale = useTransform(scrollYProgress, [0, 0.14, 0.32, 1], [0.95, 1, 1, 0.985]);
    const cardOpacity = useTransform(scrollYProgress, [0, 0.06, 0.12, 1], [0.55, 0.9, 1, 1]);

    const flipRotateY = useTransform(
      scrollYProgress,
      [0, 0.20, 0.82, 1],
      [reducedMotion ? 0 : 180, reducedMotion ? 0 : 180, 0, 0]
    );

    const flipTransform = useMotionTemplate`perspective(1800px) rotateY(${flipRotateY}deg)`;

    const labelOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 1], [0, 1, 1, 0.22]);
    const labelY = useTransform(scrollYProgress, [0, 1], [12, -12]);
    const haloOpacity = useTransform(scrollYProgress, [0, 0.20, 0.75, 1], [0.16, 0.38, 0.28, 0.14]);

    return (
      <div ref={stepRef} className="relative" style={{ height: MOBILE_STEP_HEIGHT }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#7dbdff]/50 via-[#7dbdff]/20 to-transparent" />

          <motion.div
            aria-hidden="true"
            style={{ opacity: haloOpacity }}
            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7dbdff]/20 blur-3xl"
          />

          <motion.div
            style={{ opacity: labelOpacity, y: labelY }}
            className="pointer-events-none absolute inset-x-0 top-[8svh] z-10 text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
          </motion.div>

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <motion.div
              className="h-[390px] w-[282px] will-change-transform sm:h-[440px] sm:w-[316px]"
              style={{
                y: cardY,
                scale: cardScale,
                opacity: cardOpacity,
              }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{
                  transform: flipTransform,
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                <CardFaces service={service} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);

MobileServiceStep.displayName = 'MobileServiceStep';

type MobileSpacerProps = {
  height?: string;
};

const MobileSpacer = React.memo(({ height = MOBILE_SPACER_HEIGHT }: MobileSpacerProps) => (
  <div className="relative" style={{ height }} aria-hidden="true">
    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#7dbdff]/20 via-[#7dbdff]/12 to-transparent" />
  </div>
));

MobileSpacer.displayName = 'MobileSpacer';

type MobileServicesIntroProps = {
  reducedMotion: boolean;
};

const MobileServicesIntro = React.memo(({ reducedMotion }: MobileServicesIntroProps) => {
  const introRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start start', 'end end'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [0, 0, -82, -140]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [1, 1, 0.2, 0]);
  const connectorOpacity = useTransform(scrollYProgress, [0, 0.36, 1], [0.92, 0.74, 0.18]);
  const connectorY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 30]);

  return (
    <div ref={introRef} className="relative" style={{ height: MOBILE_INTRO_HEIGHT }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

        <motion.div
          aria-hidden="true"
          style={{ opacity: connectorOpacity, y: connectorY }}
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[28svh]"
        >
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#000080]/0 via-[#000080]/20 to-transparent" />

          <motion.svg className="absolute inset-x-0 top-0 h-full w-full" viewBox="0 0 1440 320" fill="none">
            <defs>
              <linearGradient id="services-entry-line-mobile" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7DBDFF" stopOpacity="0" />
                <stop offset="0.38" stopColor="#7DBDFF" stopOpacity="0.9" />
                <stop offset="0.72" stopColor="#0078D7" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FFCC00" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[
              'M0 0 C268 0 326 206 720 206 C1114 206 1172 0 1440 0',
              'M108 0 C322 0 466 150 720 150 C974 150 1118 0 1332 0',
              'M238 0 C432 0 552 94 720 94 C888 94 1008 0 1202 0',
            ].map((d, index) => (
              <motion.path
                key={d}
                d={d}
                stroke="url(#services-entry-line-mobile)"
                strokeWidth={index === 0 ? 1.6 : 1.05}
                strokeLinecap="round"
                initial={{ pathLength: 0.3, opacity: 0.14 }}
                animate={
                  reducedMotion
                    ? { pathLength: 1, opacity: index === 0 ? 0.34 : 0.22 }
                    : {
                        pathLength: [0.3, 1, 0.3],
                        opacity: [0.12, index === 0 ? 0.5 : 0.28, 0.12],
                      }
                }
                transition={{
                  duration: 5.4 + index * 0.6,
                  delay: index * 0.26,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.svg>

          <div className="absolute left-1/2 top-0 h-[22svh] w-px -translate-x-1/2 bg-gradient-to-b from-[#7dbdff]/70 via-[#7dbdff]/35 to-transparent" />
          <div className="absolute left-1/2 top-[12svh] h-24 w-24 -translate-x-1/2 rounded-full bg-[#7dbdff]/15 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[16svh] z-10 px-6 text-center"
        >
          <h2 className="text-[3.2rem] font-extrabold uppercase leading-none tracking-tighter text-white">
            Servizi
          </h2>
        </motion.div>
      </div>
    </div>
  );
});

MobileServicesIntro.displayName = 'MobileServicesIntro';

type DesktopServicesSectionProps = {
  reducedMotion: boolean;
};

const DesktopServicesSection = React.memo(({ reducedMotion }: DesktopServicesSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.16, 0.3], [0, -20, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 0.3], [1, 1, 0]);
  const connectorOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0.9, 0.72, 0.16]);
  const connectorY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 36]);

  const backgroundColor = useSectionBackgroundColor(sectionRef, (isDark) => ({
    start: isDark ? '#0f1117' : '#f9fafb',
    mid: '#000080',
    end: isDark ? '#1e1e1e' : '#f9fafb'
  }));

  return (
    <motion.section
      ref={sectionRef}
      id="services"
      className="relative py-56"
      style={{ height: DESKTOP_SECTION_HEIGHT, backgroundColor }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

        <motion.div
          aria-hidden="true"
          style={{ opacity: connectorOpacity, y: connectorY }}
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[30vh]"
        >
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#000080]/0 via-[#000080]/20 to-transparent" />

          <motion.svg className="absolute inset-x-0 top-0 h-full w-full" viewBox="0 0 1440 320" fill="none">
            <defs>
              <linearGradient id="services-entry-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7DBDFF" stopOpacity="0" />
                <stop offset="0.38" stopColor="#7DBDFF" stopOpacity="0.9" />
                <stop offset="0.72" stopColor="#0078D7" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FFCC00" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[
              'M0 0 C268 0 326 206 720 206 C1114 206 1172 0 1440 0',
              'M108 0 C322 0 466 150 720 150 C974 150 1118 0 1332 0',
              'M238 0 C432 0 552 94 720 94 C888 94 1008 0 1202 0',
            ].map((d, index) => (
              <motion.path
                key={d}
                d={d}
                stroke="url(#services-entry-line)"
                strokeWidth={index === 0 ? 1.6 : 1.05}
                strokeLinecap="round"
                initial={{ pathLength: 0.3, opacity: 0.14 }}
                animate={
                  reducedMotion
                    ? { pathLength: 1, opacity: index === 0 ? 0.34 : 0.22 }
                    : { pathLength: [0.3, 1, 0.3], opacity: [0.12, index === 0 ? 0.5 : 0.28, 0.12] }
                }
                transition={{
                  duration: 5.4 + index * 0.6,
                  delay: index * 0.26,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.svg>

          <div className="absolute left-1/2 top-0 h-[24vh] w-px -translate-x-1/2 bg-gradient-to-b from-[#7dbdff]/70 via-[#7dbdff]/35 to-transparent" />
          <div className="absolute left-1/2 top-[15vh] h-28 w-28 -translate-x-1/2 rounded-full bg-[#7dbdff]/15 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[12vh] z-0 px-6 text-center md:top-[14vh]"
        >
          <h2 className="text-5xl font-extrabold uppercase leading-none tracking-tighter text-white md:text-[8rem]">
            Servizi
          </h2>
        </motion.div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-center justify-center px-6">
          {servicesData.map((service, index) => (
            <DesktopServiceCard
              key={service.title}
              service={service}
              index={index}
              progress={scrollYProgress}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
});

DesktopServicesSection.displayName = 'DesktopServicesSection';

type MobileServicesSectionProps = {
  reducedMotion: boolean;
};

const MobileServicesSection = React.memo(({ reducedMotion }: MobileServicesSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundColor = useSectionBackgroundColor(sectionRef, (isDark) => ({
    start: isDark ? '#0f1117' : '#f9fafb',
    mid: '#000080',
    end: isDark ? '#1e1e1e' : '#f9fafb'
  }));

  return (
    <motion.section 
      ref={sectionRef}
      id="services" 
      className="relative py-56"
      style={{ backgroundColor }}
    >
      <MobileServicesIntro reducedMotion={reducedMotion} />

      {servicesData.map((service, index) => (
        <React.Fragment key={service.title}>
          <MobileServiceStep
            service={service}
            index={index}
            reducedMotion={reducedMotion}
            total={servicesData.length}
          />
          {index < servicesData.length - 1 && <MobileSpacer />}
        </React.Fragment>
      ))}

      <MobileSpacer height="18svh" />
    </motion.section>
  );
});

MobileServicesSection.displayName = 'MobileServicesSection';

export const ServicesSection = React.memo(() => {
  const reducedMotion = Boolean(useReducedMotion());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(media.matches);

    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return isMobile ? (
    <MobileServicesSection reducedMotion={reducedMotion} />
  ) : (
    <DesktopServicesSection reducedMotion={reducedMotion} />
  );
});

ServicesSection.displayName = 'ServicesSection';