import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { Terminal, Code2, BookOpen } from 'lucide-react';

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

type ServiceCardProps = {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  isMobile: boolean;
  reducedMotion: boolean;
};

const ServiceCard = React.memo(
  ({ service, index, progress, isMobile, reducedMotion }: ServiceCardProps) => {
    const { Icon } = service;

    const enterEnd = 0.18;
    const fanEnd = 0.42;

    const spreadX = reducedMotion ? 0 : isMobile ? 0 : (index - 1) * 290;
    const spreadY = reducedMotion ? 0 : isMobile ? (index - 1) * 170 : 0;
    const spreadRotate = reducedMotion ? 0 : isMobile ? 0 : (index - 1) * 6;

    const flipStart = reducedMotion ? 0 : 0.54 + index * 0.1;
    const flipEnd = reducedMotion ? 0 : flipStart + 0.12;

    const x = useTransform(progress, [0, enterEnd, fanEnd, 1], [0, 0, spreadX, spreadX]);
    const y = useTransform(
      progress,
      [0, enterEnd, fanEnd, 1],
      [reducedMotion ? 0 : 140, 0, spreadY, spreadY]
    );
    const rotateZ = useTransform(
      progress,
      [0, enterEnd, fanEnd, 1],
      [0, 0, spreadRotate, spreadRotate]
    );
    const rotateY = useTransform(
      progress,
      [0, flipStart, flipEnd || 1, 1],
      [reducedMotion ? 0 : 180, reducedMotion ? 0 : 180, 0, 0]
    );
    const scale = useTransform(
      progress,
      [0, enterEnd, fanEnd, 1],
      [isMobile ? 0.92 : 0.96, 1, isMobile ? 0.92 : 1, isMobile ? 0.92 : 1]
    );

    const zIndex = 20 - Math.abs(index - 1);

    return (
      <motion.div
        className="absolute w-[260px] h-[360px] md:w-[320px] md:h-[460px] will-change-transform"
        style={{
          x,
          y,
          rotateZ,
          rotateY,
          scale,
          zIndex,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 rounded-[2rem] border-[10px] border-white bg-[#f4f4f5] p-6 text-gray-900 shadow-2xl md:border-[12px] md:p-8"
          style={{ backfaceVisibility: 'hidden' }}
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
          className="absolute inset-0 overflow-hidden rounded-[2rem] border-[10px] border-white bg-[#000080] shadow-2xl md:border-[12px]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.9) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="absolute inset-3 rounded-xl border-2 border-white/60" />
          <div className="absolute inset-5 rounded-lg border border-white/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-[#000080] shadow-[0_0_40px_rgba(255,255,255,0.28)] md:h-24 md:w-24">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 md:h-20 md:w-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm md:h-16 md:w-16">
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
      </motion.div>
    );
  }
);

ServiceCard.displayName = 'ServiceCard';

export const ServicesSection = React.memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.16, 0.3], [0, -20, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.18, 0.3], [1, 1, 0]);

  const sectionHeight = isMobile ? '440vh' : '380vh';

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-[#000080]"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[12vh] z-0 px-6 text-center md:top-[14vh]"
        >
          <h2 className="text-5xl font-extrabold uppercase leading-none tracking-tighter text-white md:text-[8rem]">
            Area of
            <br />
            Expertise
          </h2>
        </motion.div>

        <div
          className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-center justify-center px-6"
          style={{ perspective: 1800 }}
        >
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              progress={scrollYProgress}
              isMobile={isMobile}
              reducedMotion={Boolean(reducedMotion)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';