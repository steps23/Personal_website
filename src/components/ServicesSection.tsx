import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Terminal, Code2, BookOpen } from 'lucide-react';

const servicesData = [
  {
    title: "Audit AI/IT e Roadmap Operativa",
    description: "Analisi del contesto aziendale, mappatura dei processi e individuazione dei casi d'uso prioritari per l'adozione dell'AI.",
    icon: <Terminal className="w-6 h-6 text-blue-600 dark:text-[#0078d7]" />,
    color: "#0078d7",
    label: "Fase 1"
  },
  {
    title: "Sviluppo e Integrazione AI su Misura",
    description: "Realizzazione di strumenti interni, workflow automatizzati e soluzioni operative specifiche su misura.",
    icon: <Code2 className="w-6 h-6 text-yellow-600 dark:text-[#ffcc00]" />,
    color: "#ffcc00",
    label: "Fase 2"
  },
  {
    title: "Formazione AI/IT Applicata",
    description: "Percorsi formativi pratici per sviluppare competenze operative su AI e strumenti digitali.",
    icon: <BookOpen className="w-6 h-6 text-green-600 dark:text-[#00ff00]" />,
    color: "#00ff00",
    label: "Fase 3"
  }
];

export const ServicesSection = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Title Animations (Phase 1 to Phase 2)
  const titleOpacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.25], ["0vh", "-30vh"]);
  const titleScale = useTransform(smoothProgress, [0, 0.25], [1, 0.8]);

  // Arcs Animations (Phase 2 onwards)
  const arcsOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 0.6]);
  const arcsRotate = useTransform(smoothProgress, [0, 1], [0, 90]);
  const arcsRotateReverse = useTransform(smoothProgress, [0, 1], [0, -90]);

  // General Card Stack Scale & Y
  // On mobile, we keep them smaller so they fit when stacked/fanned vertically
  const stackScale = useTransform(smoothProgress, [0, 0.2, 0.4], [isMobile ? 0.8 : 0.6, isMobile ? 0.8 : 0.6, isMobile ? 0.9 : 1]);
  const stackY = useTransform(smoothProgress, [0, 0.2, 0.4], ["35vh", "35vh", isMobile ? "10vh" : "5vh"]);
  
  // Card 1 (Audit)
  const card1X = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", isMobile ? "0%" : "-110%", isMobile ? "0%" : "-105%"]);
  const card1Y = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", isMobile ? "-105%" : "10%", isMobile ? "-105%" : "0%"]);
  const card1Rotate = useTransform(smoothProgress, [0.4, 0.6, 0.8], [0, isMobile ? -5 : -12, 0]);

  // Card 2 (Sviluppo)
  const card2X = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", "0%", "0%"]);
  const card2Y = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", isMobile ? "0%" : "-5%", "0%"]);
  const card2Rotate = useTransform(smoothProgress, [0.4, 0.6, 0.8], [0, 0, 0]);

  // Card 3 (Formazione)
  const card3X = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", isMobile ? "0%" : "110%", isMobile ? "0%" : "105%"]);
  const card3Y = useTransform(smoothProgress, [0.4, 0.6, 0.8], ["0%", isMobile ? "105%" : "10%", isMobile ? "105%" : "0%"]);
  const card3Rotate = useTransform(smoothProgress, [0.4, 0.6, 0.8], [0, isMobile ? 5 : 12, 0]);

  // Symbol object shadow fades out when cards split
  const shadowOpacity = useTransform(smoothProgress, [0.4, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-[#000080]"
      id="services"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Arcs */}
        <motion.div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ opacity: arcsOpacity }}
        >
          <motion.div style={{ rotate: arcsRotate }} className="absolute w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] rounded-full border-[1px] border-white/10" />
          <motion.div style={{ rotate: arcsRotateReverse }} className="absolute w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] rounded-full border-[1px] border-white/20 border-dashed" />
          <motion.div style={{ rotate: arcsRotate }} className="absolute w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] rounded-full border-[1px] border-white/10" />
        </motion.div>

        {/* Phase 1: Giant Heading */}
        <motion.div 
          className="absolute top-1/4 md:top-1/3 left-0 w-full text-center z-10 px-4 pointer-events-none"
          style={{ 
             opacity: titleOpacity, 
             y: titleY,
             scale: titleScale
          }}
        >
          <h2 className="text-white font-extrabold uppercase tracking-tighter leading-[0.85] text-[15vw] md:text-[12vw]">
            <span className="block opacity-90">Area of</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white">Expertise</span>
          </h2>
        </motion.div>

        {/* Main Card Container */}
        <motion.div 
          className="relative w-full max-w-7xl mx-auto flex items-center justify-center z-20 h-[70vh] md:h-[65vh]"
          style={{ 
            scale: stackScale,
            y: stackY
          }}
        >
          {/* Base shadow/glow for the stack */}
          <motion.div 
             className="absolute w-[80%] md:w-[85%] max-w-[380px] h-[450px] bg-blue-400/30 rounded-3xl blur-2xl"
             style={{ opacity: shadowOpacity }}
          />

          {/* Cards */}
          {[
            { x: card1X, y: card1Y, rotate: card1Rotate },
            { x: card2X, y: card2Y, rotate: card2Rotate },
            { x: card3X, y: card3Y, rotate: card3Rotate }
          ].map((transforms, index) => {
            const service = servicesData[index];
            
            return (
              <motion.div
                key={index}
                className="absolute w-[90%] md:w-[85%] max-w-[360px] h-[400px] md:h-[480px] bg-white dark:bg-[#1e1e1e] rounded-[2rem] p-6 md:p-8 flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 group hover:border-[#0078d7] transition-colors duration-500 will-change-transform"
                style={{
                  x: transforms.x,
                  y: transforms.y,
                  rotateZ: transforms.rotate,
                  zIndex: 10 + index,
                }}
              >
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 dark:bg-[#252526] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#252526] px-3 py-1.5 rounded-full">
                    {service.label}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 md:mb-4 leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 flex-grow leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between cursor-pointer group-hover:text-[#0078d7] transition-colors">
                  <span className="font-bold text-xs md:text-sm uppercase tracking-wider text-gray-900 dark:text-white group-hover:text-[#0078d7] transition-colors">Scopri il servizio</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-2 transition-transform duration-300 text-gray-900 dark:text-white group-hover:text-[#0078d7]" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
});
