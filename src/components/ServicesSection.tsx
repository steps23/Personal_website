import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Code2, BookOpen } from 'lucide-react';

const servicesData = [
  {
    title: "AUDIT & ROADMAP",
    items: [
      "Analisi del contesto",
      "Mappatura processi",
      "Casi d'uso prioritari",
      "Adozione dell'AI"
    ],
    icon: <Terminal className="w-8 h-8" />,
  },
  {
    title: "SVILUPPO AI",
    items: [
      "Strumenti interni",
      "Workflow automatizzati",
      "Soluzioni su misura",
      "Integrazione AI"
    ],
    icon: <Code2 className="w-8 h-8" />,
  },
  {
    title: "FORMAZIONE",
    items: [
      "Percorsi pratici",
      "Competenze operative",
      "Strumenti digitali",
      "Formazione AI/IT"
    ],
    icon: <BookOpen className="w-8 h-8" />,
  }
];

export const ServicesSection = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const titleY = useTransform(scrollYProgress, [0, 0.2], ["0vh", "-10vh"]);
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);

  return (
    <section ref={containerRef} id="services" className="relative bg-[#000080]" style={{ height: '400vh' }}>
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden" style={{ perspective: '2000px' }}>
        
        {/* Title */}
        <motion.div
           style={{ y: titleY, opacity: titleOpacity }}
           className="absolute top-[15%] md:top-1/4 text-center z-0 w-full px-6 pointer-events-none"
        >
          <h2 className="text-5xl md:text-[10rem] font-extrabold tracking-tighter text-white uppercase leading-none">
            Area of<br />Expertise
          </h2>
        </motion.div>

        {/* Cards container */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[480px] flex items-center justify-center z-10">
          {servicesData.map((service, index) => {
            // Phase 1: 0.0 - 0.2 -> Slide up into view from bottom of viewport
            // Phase 2: 0.2 - 0.5 -> Fan out (spread X/Y and rotate Z)
            // Phase 3: 0.5 - 0.9 -> Sequential Flip
            
            const y = useTransform(
              scrollYProgress,
              [0, 0.2, 0.5, 1],
              ["100vh", "0vh", isMobile ? `${(index - 1) * 220}px` : "0vh", isMobile ? `${(index - 1) * 220}px` : "0vh"]
            );

            const x = useTransform(
              scrollYProgress,
              [0, 0.2, 0.5, 1],
              ["0px", "0px", isMobile ? "0px" : `${(index - 1) * 340}px`, isMobile ? "0px" : `${(index - 1) * 340}px`]
            );

            const rotateZ = useTransform(
              scrollYProgress,
              [0, 0.2, 0.5, 1],
              [0, 0, isMobile ? 0 : (index - 1) * 6, isMobile ? 0 : (index - 1) * 6]
            );

            const flipStart = 0.5 + index * 0.13;
            const flipEnd = flipStart + 0.13;
            const rotateY = useTransform(
              scrollYProgress,
              [0, flipStart, flipEnd, 1],
              [180, 180, 0, 0]
            );
            
            const scale = isMobile ? 0.75 : 1;
            const zIndex = 10 - Math.abs(index - 1);

            return (
              <motion.div
                key={service.title}
                className="absolute w-[280px] h-[400px] md:w-[320px] md:h-[480px]"
                style={{
                  x,
                  y,
                  rotateZ,
                  rotateY,
                  scale,
                  zIndex,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Front of card (White side) */}
                <div 
                  className="absolute inset-0 bg-[#f4f4f5] rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col border-[8px] md:border-[12px] border-white text-gray-900"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Top Header */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter w-3/4 leading-none break-words">
                      {service.title}
                    </h3>
                    <div className="text-gray-900">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Middle Content */}
                  <div className="mt-8 md:mt-10 flex-grow">
                    <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-medium text-gray-700">
                      {service.items.map((item, i) => (
                        <li key={i} className="border-b border-gray-300 pb-2">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Footer (Upside down) */}
                  <div className="flex justify-between items-end rotate-180">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter w-3/4 leading-none break-words text-gray-300">
                      {service.title}
                    </h3>
                    <div className="text-gray-300">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Back of card (Blue side) */}
                <div 
                  className="absolute inset-0 bg-[#000080] rounded-[2rem] border-[8px] md:border-[12px] border-white shadow-2xl flex items-center justify-center overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  
                  {/* Decorative Borders */}
                  <div className="absolute inset-3 border-2 border-white/60 rounded-xl" />
                  <div className="absolute inset-5 border border-white/40 rounded-lg" />
                  
                  {/* Center Logo */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#000080] border-2 border-white rounded-full flex items-center justify-center z-10 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    <div className="w-16 h-16 md:w-20 md:h-20 border border-white/60 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 border border-white/40 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <span className="text-white font-black text-2xl md:text-3xl tracking-tighter">SR</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Ornaments */}
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/60" />
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/60" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/60" />
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/60" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
