import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'motion/react';
import { Terminal, Code2, BookOpen, ArrowRight, Mail, Phone, ChevronDown, X, Sun, Moon } from 'lucide-react';
import smoothscroll from 'smoothscroll-polyfill';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';

// Kick off the polyfill!
smoothscroll.polyfill();

const ThemeToggle = React.memo(() => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[100] p-3 rounded-full bg-white dark:bg-[#252526] text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );
});

const colors = [
  '#1e1e1e', // Dark Gray
  '#000080', // Navy
  '#0078d7', // Blue
  '#301024', // Dark Purple
  '#ffcc00', // Yellow
  '#00ff00', // Green
];

const Typewriter = React.memo(({ text, delay = 0, speed = 30, className = "" }: { text: string, delay?: number, speed?: number, className?: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const startTimer = setTimeout(() => setStarted(true), delay * 1000);
      return () => clearTimeout(startTimer);
    }
  }, [isInView, delay]);

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
    <span ref={ref} className={className}>
      {displayed}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[0.4em] h-[1em] bg-current align-middle ml-1"
      />
    </span>
  );
});

const CodeTypewriter = React.memo(({ code, delay = 0, speed = 30, className = "" }: { code: { text: string, className?: string }[], delay?: number, speed?: number, className?: string }) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const totalChars = code.reduce((acc, token) => acc + token.text.length, 0);

  useEffect(() => {
    if (isInView) {
      const startTimer = setTimeout(() => setStarted(true), delay * 1000);
      return () => clearTimeout(startTimer);
    }
  }, [isInView, delay]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setDisplayedChars(prev => {
        if (prev >= totalChars) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [started, speed, totalChars]);

  let charsLeft = displayedChars;

  return (
    <span ref={ref} className={className}>
      {code.map((token, index) => {
        if (charsLeft <= 0) return null;
        const textToShow = token.text.slice(0, charsLeft);
        charsLeft -= token.text.length;
        return (
          <span key={index} className={token.className}>
            {textToShow}
          </span>
        );
      })}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[0.4em] h-[1em] bg-current align-middle ml-1"
      />
    </span>
  );
});

const StaggeredWord = React.memo(({ word, color, delay = 0 }: { word: string, color?: string, delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={color ? { color } : undefined}
      className="inline-block"
    >
      {word}
    </motion.span>
  );
});

const CodeLine = React.memo(({ children, delay }: { children: React.ReactNode, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
));

const LoadingScreen = React.memo(({ onComplete }: { onComplete: () => void; key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] overflow-hidden"
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
        <div className="w-[30rem] h-[30rem] md:w-[50rem] md:h-[50rem] border-[2px] border-gray-900 dark:border-white rounded-full border-dashed" />
        <div className="absolute w-[20rem] h-[20rem] md:w-[35rem] md:h-[35rem] border-[1px] border-gray-900 dark:border-white rounded-full border-dotted" />
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
});

const CustomCursor = React.memo(() => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 1000, damping: 40, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full bg-white pointer-events-none z-[100] mix-blend-difference hidden md:block"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    />
  );
});

const Hero = React.memo(() => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const bgParallax1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const bgParallax2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-32 pb-40">
      {/* Background animated elements */}
      <motion.div style={{ y: bgParallax1, willChange: 'transform' }} className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] pointer-events-none">
        <motion.div 
          className="w-full h-full bg-[#000080] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 dark:opacity-40"
          style={{ willChange: 'transform, filter' }}
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <motion.div style={{ y: bgParallax2, willChange: 'transform' }} className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] pointer-events-none">
        <motion.div 
          className="w-full h-full bg-[#301024] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 dark:opacity-40"
          style={{ willChange: 'transform, filter' }}
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
              className="text-green-600 dark:text-[#00ff00] font-mono mb-4 tracking-wider uppercase text-sm font-bold"
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
            
            <div className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mb-8 leading-relaxed min-h-[4rem]">
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
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-[#1e1e1e] font-bold rounded-full hover:bg-[#ffcc00] dark:hover:bg-[#ffcc00] transition-colors flex items-center"
              >
                Prenota una call
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-transparent border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white font-bold rounded-full hover:border-gray-900 dark:hover:border-white transition-colors flex items-center"
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
          className="flex-1 w-full perspective-1000 hidden lg:block"
        >
          {/* Decorative element replacing the code card in hero */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0078d7] to-[#00ff00] rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute inset-10 bg-white dark:bg-[#1e1e1e] rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-[#ffcc00] rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute w-24 h-24 border-4 border-[#0078d7] rounded-full border-b-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            </div>
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
});

const Contact = React.memo(() => {
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
            <StaggeredWord word="We" color="white" delay={0.2} />
            <StaggeredWord word="should" color="white" delay={0.4} />
            <StaggeredWord word="get_in_touch()" color="#ffcc00" delay={0.6} />
          </h2>
          <div className="text-xl text-blue-200 max-w-2xl mx-auto min-h-[4rem]">
            <Typewriter 
              text="Pronto a trasformare le opportunità in soluzioni concrete? Prenota una call conoscitiva senza impegno."
              delay={0.2}
              speed={25}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
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

        {/* Code Card moved to Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto text-left"
        >
          <div className="bg-white dark:bg-[#1e1e1e] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden group text-gray-900 dark:text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0078d7] via-[#ffcc00] to-[#00ff00]" />
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="font-mono text-sm md:text-base overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <CodeTypewriter 
                code={[
                  { text: "def ", className: "text-[#0000ff] dark:text-[#569cd6]" },
                  { text: "get_in_touch", className: "text-[#795e26] dark:text-[#dcdcaa]" },
                  { text: "()", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: ":\n", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: "    name", className: "text-[#001080] dark:text-[#9cdcfe]" },
                  { text: " = ", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: "\"Stefano Ruggiero\"", className: "text-[#a31515] dark:text-[#ce9178]" },
                  { text: "\n    title", className: "text-[#001080] dark:text-[#9cdcfe]" },
                  { text: " = ", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: "\"Master's degree in Computer Engineering\"", className: "text-[#a31515] dark:text-[#ce9178]" },
                  { text: "\n    phone", className: "text-[#001080] dark:text-[#9cdcfe]" },
                  { text: " = ", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: "\"+39 380 133 0809\"", className: "text-[#a31515] dark:text-[#ce9178]" },
                  { text: "\n    email", className: "text-[#001080] dark:text-[#9cdcfe]" },
                  { text: " = ", className: "text-gray-900 dark:text-[#d4d4d4]" },
                  { text: "\"ruggierostefano2311@gmail.com\"", className: "text-[#a31515] dark:text-[#ce9178]" },
                  { text: "\n\nget_in_touch", className: "text-[#795e26] dark:text-[#dcdcaa]" },
                  { text: "()", className: "text-gray-900 dark:text-[#d4d4d4]" }
                ]}
                delay={0.5}
                speed={20}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const Footer = React.memo(() => {
  return (
    <footer className="bg-gray-50 dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 py-12 px-6 text-center text-gray-500 transition-colors duration-300">
      <p className="font-mono">© {new Date().getFullYear()} Stefano Ruggiero. All rights reserved.</p>
    </footer>
  );
});

const ScrollProgress = React.memo(() => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-gradient-to-r from-[#0078d7] via-[#ffcc00] to-[#00ff00] origin-left"
      style={{ scaleX: scrollYProgress, willChange: 'transform' }}
    />
  );
});

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#0078d7] selection:text-white transition-colors duration-300 dark:bg-[#1e1e1e] dark:text-white">
      <ThemeToggle />
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
          <ServicesSection />
          <AboutSection />
          <Contact />
          <Footer />
        </motion.main>
      )}
    </div>
  );
}

