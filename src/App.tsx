import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Terminal, Code2, BookOpen, ArrowRight, Mail, Phone, ChevronDown, X } from 'lucide-react';
import smoothscroll from 'smoothscroll-polyfill';

// Kick off the polyfill!
smoothscroll.polyfill();

const colors = [
  '#1e1e1e', // Dark Gray
  '#000080', // Navy
  '#0078d7', // Blue
  '#301024', // Dark Purple
  '#ffcc00', // Yellow
  '#00ff00', // Green
];

const Typewriter = ({ text, delay = 0, speed = 30, className = "" }: { text: string, delay?: number, speed?: number, className?: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, started, speed]);

  return (
    <span className={className}>
      {displayed}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[0.4em] h-[1em] bg-current align-middle ml-1"
      />
    </span>
  );
};

const StaggeredWord = ({ word, color = "white", delay = 0 }: { word: string, color?: string, delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ color }}
      className="inline-block"
    >
      {word}
    </motion.span>
  );
};

const CodeLine = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const LoadingScreen = ({ onComplete }: { onComplete: () => void; key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1e1e] overflow-hidden"
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {colors.map((color, index) => (
        <motion.div
          key={color}
          className="absolute inset-0"
          style={{ backgroundColor: color, zIndex: index }}
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1], 
            delay: index * 0.3 
          }}
        />
      ))}
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.15, rotate: 90, scale: 1.2 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        <div className="w-[30rem] h-[30rem] md:w-[50rem] md:h-[50rem] border-[2px] border-white rounded-full border-dashed" />
        <div className="absolute w-[20rem] h-[20rem] md:w-[35rem] md:h-[35rem] border-[1px] border-white rounded-full border-dotted" />
      </motion.div>

      <motion.div 
        className="absolute inset-0 z-50 flex items-center justify-center mix-blend-difference pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
      >
        <h1 className="text-white text-4xl md:text-7xl font-mono font-bold tracking-tighter">
          <Typewriter text="get_in_touch()" delay={2.0} speed={40} />
        </h1>
      </motion.div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full bg-white pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
      }}
      transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
    />
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const bgParallax1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const bgParallax2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20">
      {/* Background animated elements */}
      <motion.div style={{ y: bgParallax1 }} className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] pointer-events-none">
        <motion.div 
          className="w-full h-full bg-[#000080] rounded-full mix-blend-screen filter blur-[120px] opacity-40"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <motion.div style={{ y: bgParallax2 }} className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] pointer-events-none">
        <motion.div 
          className="w-full h-full bg-[#301024] rounded-full mix-blend-screen filter blur-[120px] opacity-40"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div style={{ y: y1, opacity }} className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[#00ff00] font-mono mb-4 tracking-wider uppercase text-sm"
            >
              Stefano Ruggiero
            </motion.p>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight flex flex-wrap gap-x-3 gap-y-2 md:gap-x-4">
              <StaggeredWord word="Costruire" delay={0.6} />
              <StaggeredWord word="un" delay={0.7} />
              <StaggeredWord word="ponte" delay={0.8} />
              <StaggeredWord word="tra" delay={0.9} />
              <StaggeredWord word="opportunità" color="#0078d7" delay={1.0} />
              <StaggeredWord word="e" delay={1.1} />
              <StaggeredWord word="tecnologia" color="#ffcc00" delay={1.2} />
            </h1>
            
            <div className="text-xl text-gray-400 max-w-xl mb-8 leading-relaxed min-h-[4rem]">
              <Typewriter 
                text="Consulenza AI/IT, sviluppo mirato e formazione applicata per PMI, professionisti ed enti di formazione." 
                delay={1.5} 
                speed={25} 
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-[#1e1e1e] font-bold rounded-full hover:bg-[#ffcc00] transition-colors flex items-center"
              >
                Prenota una call
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white transition-colors flex items-center"
              >
                Scopri i servizi
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex-1 w-full perspective-1000"
        >
          <div className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden group transform transition-transform hover:scale-[1.02] duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0078d7] via-[#ffcc00] to-[#00ff00]" />
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <pre className="font-mono text-sm md:text-base overflow-x-auto leading-relaxed">
              <code className="language-python">
                <CodeLine delay={1.5}><span className="text-[#569cd6]">def</span> <span className="text-[#dcdcaa]">get_in_touch</span>():</CodeLine>
                <CodeLine delay={1.7}>{'    '}name  = <span className="text-[#ce9178]">"Stefano Ruggiero"</span></CodeLine>
                <CodeLine delay={1.9}>{'    '}title = <span className="text-[#ce9178]">"Master's degree in Computer Engineering"</span></CodeLine>
                <CodeLine delay={2.1}>{'    '}phone = <span className="text-[#ce9178]">"+39 380 133 0809"</span></CodeLine>
                <CodeLine delay={2.3}>{'    '}email = <span className="text-[#ce9178]">"ruggierostefano2311@gmail.com"</span></CodeLine>
                <CodeLine delay={2.5}>{'\n'}</CodeLine>
                <CodeLine delay={2.7}><span className="text-[#dcdcaa]">get_in_touch</span>()</CodeLine>
              </code>
            </pre>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
};

const services = [
  {
    title: "Audit AI/IT e Roadmap",
    description: "Analisi del contesto aziendale, mappatura dei processi e individuazione dei casi d'uso prioritari per l'adozione dell'AI.",
    icon: <Terminal className="w-8 h-8 text-[#0078d7]" />,
    color: "#0078d7",
    details: [
      "Analisi dei requisiti e studio di fattibilità",
      "Sviluppo di modelli predittivi e NLP",
      "Integrazione con sistemi aziendali esistenti",
      "Monitoraggio e ottimizzazione continua"
    ]
  },
  {
    title: "Sviluppo e Integrazione",
    description: "Realizzazione di strumenti interni, workflow automatizzati e soluzioni operative specifiche su misura.",
    icon: <Code2 className="w-8 h-8 text-[#ffcc00]" />,
    color: "#ffcc00",
    details: [
      "Sviluppo di plugin e integrazioni API",
      "Automazione dei flussi di lavoro aziendali",
      "Creazione di dashboard personalizzate",
      "Supporto tecnico e manutenzione"
    ]
  },
  {
    title: "Formazione Applicata",
    description: "Percorsi formativi pratici per sviluppare competenze operative su AI e strumenti digitali.",
    icon: <BookOpen className="w-8 h-8 text-[#00ff00]" />,
    color: "#00ff00",
    details: [
      "Workshop interattivi sull'Intelligenza Artificiale",
      "Corsi pratici sull'uso di strumenti digitali",
      "Materiale didattico personalizzato",
      "Sessioni di Q&A e supporto post-formazione"
    ]
  }
];

const Services = () => {
  const ref = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Lock body scroll when expanded
  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [expandedIndex]);

  return (
    <section id="services" ref={ref} className="py-32 px-6 relative bg-[#121212] overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-10 left-10 w-64 h-64 bg-[#0078d7] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffcc00] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Servizi Principali</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Aiuto PMI, professionisti ed enti di formazione a individuare opportunità concrete di adozione AI, validarle con pilot mirati e trasformarle in soluzioni operative.
            </p>
          </div>
          <button className="hidden md:flex items-center text-white hover:text-[#0078d7] transition-colors font-semibold">
            Vedi tutti i servizi <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              layoutId={`card-${index}`}
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                opacity: { duration: 0.6, delay: index * 0.2 },
                y: { duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 100 },
                scale: { duration: 0.6, delay: index * 0.2 },
                layout: { type: "spring", stiffness: 350, damping: 30 }
              }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() => setExpandedIndex(index)}
              className="bg-[#1e1e1e] p-8 rounded-3xl border border-gray-800 hover:border-gray-600 transition-colors duration-300 group relative flex flex-col h-full cursor-pointer"
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: service.color }}
                />
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: service.color }} />
              </div>
              
              <motion.div 
                layoutId={`icon-container-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  default: { delay: index * 0.2 + 0.3, type: "spring", stiffness: 300, damping: 15 },
                  layout: { type: "spring", stiffness: 350, damping: 30 }
                }}
                className="mb-8 p-4 bg-[#252526] rounded-2xl inline-block w-fit group-hover:scale-110 transition-transform duration-300 relative group/icon z-20"
              >
                <motion.div layoutId={`icon-${index}`}>
                  {service.icon}
                </motion.div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-[#1e1e1e] text-xs font-bold rounded-md opacity-0 group-hover/icon:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg z-50 translate-y-2 group-hover/icon:translate-y-0">
                  Espandi
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              </motion.div>
              <motion.h3 layoutId={`title-${index}`} className="text-2xl font-bold mb-4 relative z-10">{service.title}</motion.h3>
              <motion.p layoutId={`desc-${index}`} className="text-gray-400 mb-8 leading-relaxed flex-grow relative z-10">{service.description}</motion.p>
              <motion.div layoutId={`btn-${index}`} className="flex items-center text-sm font-bold mt-auto relative z-10" style={{ color: service.color }}>
                Scopri di più <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setExpandedIndex(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[120] pointer-events-none p-4 py-12 md:p-8">
              <motion.div
                layoutId={`card-${expandedIndex}`}
                transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
                className="bg-[#1e1e1e] rounded-3xl border border-gray-700 w-full max-w-2xl pointer-events-auto relative max-h-full flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <motion.button 
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  onClick={() => setExpandedIndex(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors z-50 bg-[#252526] p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Top color bar */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 left-0 w-full h-2 z-40"
                  style={{ backgroundColor: services[expandedIndex].color }}
                />

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-6 w-full h-full">
                  {/* Icon */}
                  <div className="shrink-0">
                  <motion.div 
                    layoutId={`icon-container-${expandedIndex}`}
                    transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
                    className="p-4 md:p-6 bg-[#252526] rounded-2xl inline-block"
                  >
                    <motion.div layoutId={`icon-${expandedIndex}`}>
                      {React.cloneElement(services[expandedIndex].icon as React.ReactElement, { className: "w-10 h-10 md:w-12 md:h-12" })}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <motion.h3 layoutId={`title-${expandedIndex}`} className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 pr-10">
                    {services[expandedIndex].title}
                  </motion.h3>
                  
                  <motion.p 
                    layoutId={`desc-${expandedIndex}`}
                    className="text-gray-300 text-base md:text-lg mb-4 md:mb-8 leading-relaxed"
                  >
                    {services[expandedIndex].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4" style={{ color: services[expandedIndex].color }}>
                      Cosa include:
                    </h4>
                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      {services[expandedIndex].details.map((detail, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="flex items-start text-gray-400 text-sm md:text-base"
                        >
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-3 shrink-0 mt-0.5" style={{ color: services[expandedIndex].color }} />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div layoutId={`btn-${expandedIndex}`}>
                      <button 
                        className="px-6 py-3 md:px-8 md:py-4 bg-[#252526] hover:bg-[#333333] text-white font-bold rounded-xl transition-colors flex items-center w-full justify-center md:w-auto text-sm md:text-base"
                      >
                        Richiedi informazioni 
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" style={{ color: services[expandedIndex].color }} />
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-40 px-6 bg-[#000080] relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '48px 48px']
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-8xl font-bold mb-8 text-white tracking-tighter flex flex-wrap justify-center gap-x-4 gap-y-2">
            <StaggeredWord word="We" delay={0.2} />
            <StaggeredWord word="should" delay={0.4} />
            <StaggeredWord word="get_in_touch()" color="#ffcc00" delay={0.6} />
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-xl text-blue-200 max-w-2xl mx-auto"
          >
            Pronto a trasformare le opportunità in soluzioni concrete? Prenota una call conoscitiva senza impegno.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="px-10 py-5 bg-[#ffcc00] text-[#000080] font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 flex items-center text-lg shadow-[0_0_40px_rgba(255,204,0,0.4)]">
            <Phone className="w-6 h-6 mr-3" />
            Prenota una call
          </button>
          <button className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#000080] transition-all duration-300 flex items-center text-lg">
            <Mail className="w-6 h-6 mr-3" />
            Scrivimi
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#1e1e1e] border-t border-gray-800 py-12 px-6 text-center text-gray-500">
      <p className="font-mono">© {new Date().getFullYear()} Stefano Ruggiero. All rights reserved.</p>
    </footer>
  );
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-gradient-to-r from-[#0078d7] via-[#ffcc00] to-[#00ff00] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative bg-[#1e1e1e] min-h-screen text-white font-sans selection:bg-[#0078d7] selection:text-white overflow-x-hidden">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <ScrollProgress />
          <Hero />
          <Services />
          <Contact />
          <Footer />
        </motion.main>
      )}
    </div>
  );
}

