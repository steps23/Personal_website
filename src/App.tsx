import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { Terminal, Code2, BookOpen, ArrowRight, Mail, Phone, ChevronDown, X, Sun, Moon } from 'lucide-react';
import smoothscroll from 'smoothscroll-polyfill';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { BackgroundStage } from './components/BackgroundStage';

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
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -64]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.38]);

  const visualY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 120]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 0.9]);

  const leftBlobY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 48]);
  const rightBlobY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -64]);
  const haloScale = useTransform(scrollYProgress, [0, 1], [1, shouldReduceMotion ? 1 : 1.18]);
  const beamHeight = useTransform(scrollYProgress, [0, 1], ['20%', '68%']);
  const bridgeOpacity = useTransform(scrollYProgress, [0, 0.16, 1], [0.24, 0.82, 1]);
  const bridgeY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 34]);

  const lineTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 5.4, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-transparent px-6 pt-56 pb-48"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-[8vh] h-[30rem] w-[30rem] rounded-full bg-[#7dbdff]/20 blur-[120px] dark:bg-[#0b3e74]/35"
        style={{ y: leftBlobY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10rem] top-[4vh] h-[36rem] w-[36rem] rounded-full bg-[#dceeff]/70 blur-[140px] dark:bg-[#132a63]/45"
        style={{ y: rightBlobY }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-3xl pt-6 lg:pt-0"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-green-600 dark:text-[#8df7b8]"
          >
            Stefano Ruggiero
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.2rem,9vw,7.5rem)] font-black leading-[0.92] tracking-[-0.06em] text-gray-900 dark:text-white"
          >
            <span className="block">Costruire un</span>
            <span className="block">
              ponte tra <span className="text-[#0078d7]">opportunità</span> e
            </span>
            <span className="block text-[#ffcc00]">tecnologia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-[1.35rem]"
          >
            Consulenza AI/IT, sviluppo mirato e formazione applicata per PMI,
            professionisti ed enti di formazione.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="mt-7 flex flex-wrap gap-3"
          >
            {['Audit / Roadmap', 'Sviluppo AI', 'Formazione applicata'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-gray-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
              >
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 rounded-full bg-gray-900 px-8 py-4 font-bold text-white transition-colors hover:bg-[#0078d7] dark:bg-white dark:text-[#111827] dark:hover:bg-[#ffcc00]"
            >
              Prenota una call
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 rounded-full border border-gray-300/90 bg-white/55 px-8 py-4 font-bold text-gray-900 backdrop-blur-md transition-colors hover:border-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white"
            >
              Scopri i servizi
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="mt-5 text-sm text-gray-500 dark:text-gray-400"
          >
            Prima call conoscitiva, senza impegno.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: visualY, scale: visualScale, opacity: contentOpacity }}
          className="relative mx-auto hidden w-full max-w-[620px] lg:block"
        >
          <div className="relative aspect-[1.02] w-full overflow-hidden rounded-[2.75rem] border border-white/70 bg-white/50 shadow-[0_30px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <div className="absolute inset-[2px] rounded-[2.65rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.06))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
            <div
              className="absolute inset-0 rounded-[2.75rem] opacity-45"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,120,215,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,120,215,0.08) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />

            <motion.svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 640 640"
              fill="none"
            >
              <defs>
                <linearGradient id="hero-signal" x1="88" y1="82" x2="520" y2="540" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7DBDFF" />
                  <stop offset="0.45" stopColor="#0078D7" />
                  <stop offset="0.78" stopColor="#63A8FF" />
                  <stop offset="1" stopColor="#FFCC00" />
                </linearGradient>
                <radialGradient
                  id="hero-node-core"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(322 396) rotate(90) scale(84)"
                >
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.35" stopColor="#DCEEFF" />
                  <stop offset="1" stopColor="#0078D7" stopOpacity="0" />
                </radialGradient>
              </defs>

              {[
                'M92 168 C170 178 238 252 322 396',
                'M214 96 C258 166 290 252 322 396',
                'M520 146 C440 202 382 272 322 396',
                'M546 300 C450 318 392 348 322 396',
                'M196 534 C250 510 294 470 322 396',
              ].map((d, index) => (
                <motion.path
                  key={d}
                  d={d}
                  stroke="url(#hero-signal)"
                  strokeWidth={index === 0 || index === 2 ? 2.5 : 2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0.32, opacity: 0.22 }}
                  animate={
                    shouldReduceMotion
                      ? { pathLength: 1, opacity: 0.45 }
                      : { pathLength: [0.3, 1, 0.3], opacity: [0.18, 0.78, 0.18] }
                  }
                  transition={{ ...lineTransition, delay: index * 0.32 }}
                />
              ))}

              <motion.path
                d="M322 396 C322 450 322 492 322 556"
                stroke="url(#hero-signal)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0.2, opacity: 0.18 }}
                animate={
                  shouldReduceMotion
                    ? { pathLength: 1, opacity: 0.38 }
                    : { pathLength: [0.2, 1, 0.2], opacity: [0.16, 0.58, 0.16] }
                }
                transition={{ ...lineTransition, delay: 0.6 }}
              />

              <circle cx="322" cy="396" r="94" fill="url(#hero-node-core)" />
            </motion.svg>

            <motion.div
              style={{ scale: haloScale }}
              className="absolute left-1/2 top-[62%] h-56 w-56 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-[#7dbdff]/20"
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-5 rounded-full border-[2px] border-[#ffcc00]/90 border-l-transparent"
                animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-10 rounded-full border-[3px] border-[#0078d7] border-b-transparent"
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 7.2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-[34%] rounded-full bg-white shadow-[0_0_36px_rgba(125,189,255,0.42),inset_0_0_20px_rgba(0,120,215,0.18)] dark:bg-[#0f1117]"
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <div className="pointer-events-none absolute inset-x-[12%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ opacity: bridgeOpacity, y: bridgeY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[40vh]"
      >
        <motion.svg className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 420" fill="none">
          <defs>
            <linearGradient id="hero-bridge-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7DBDFF" stopOpacity="0" />
              <stop offset="0.35" stopColor="#7DBDFF" stopOpacity="0.85" />
              <stop offset="0.74" stopColor="#0078D7" stopOpacity="0.95" />
              <stop offset="1" stopColor="#FFCC00" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[
            'M0 76 C280 76 332 266 720 266 C1106 266 1154 76 1440 76',
            'M120 18 C322 18 470 210 720 210 C968 210 1118 18 1320 18',
            'M228 0 C434 0 540 154 720 154 C900 154 1008 0 1214 0',
          ].map((d, index) => (
            <motion.path
              key={d}
              d={d}
              stroke="url(#hero-bridge-line)"
              strokeWidth={index === 0 ? 1.7 : 1.1}
              strokeLinecap="round"
              initial={{ pathLength: 0.34, opacity: 0.16 }}
              animate={
                shouldReduceMotion
                  ? { pathLength: 1, opacity: index === 0 ? 0.4 : 0.24 }
                  : { pathLength: [0.34, 1, 0.34], opacity: [0.12, index === 0 ? 0.62 : 0.34, 0.12] }
              }
              transition={{ duration: 5.6 + index * 0.7, delay: index * 0.28, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.svg>

        <motion.div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#7dbdff]/0 via-[#7dbdff]/70 to-transparent"
          style={{ height: beamHeight }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      </motion.div>

      <motion.button
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-24 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-300"
        animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </section>
  );
});


const Contact = React.memo(() => {
  return (
    <section id="contact" className="relative overflow-hidden bg-transparent px-6 py-56">
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
    <footer
      id="site-footer"
      className="relative bg-transparent border-t border-gray-900/10 py-12 px-6 text-center text-gray-600 transition-colors duration-300 dark:border-white/10 dark:text-gray-300"
    >
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
    <div className="relative isolate min-h-screen overflow-x-clip font-sans text-gray-900 transition-colors duration-300 selection:bg-[#0078d7] selection:text-white dark:text-white">
      <ThemeToggle />
      <CustomCursor />
      <BackgroundStage />
      
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
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

