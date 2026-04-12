import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Code2, BookOpen } from 'lucide-react';

const servicesData = [
  {
    title: "Audit AI/IT e Roadmap Operativa",
    description: "Analisi del contesto aziendale, mappatura dei processi e individuazione dei casi d'uso prioritari per l'adozione dell'AI.",
    icon: <Terminal className="w-6 h-6 text-blue-600 dark:text-[#0078d7]" />,
    label: "Fase 1",
    accent: "from-[#0078d7]/30 via-[#0078d7]/10 to-transparent"
  },
  {
    title: "Sviluppo e Integrazione AI su Misura",
    description: "Realizzazione di strumenti interni, workflow automatizzati e soluzioni operative specifiche su misura.",
    icon: <Code2 className="w-6 h-6 text-yellow-600 dark:text-[#ffcc00]" />,
    label: "Fase 2",
    accent: "from-[#ffcc00]/30 via-[#ffcc00]/10 to-transparent"
  },
  {
    title: "Formazione AI/IT Applicata",
    description: "Percorsi formativi pratici per sviluppare competenze operative su AI e strumenti digitali.",
    icon: <BookOpen className="w-6 h-6 text-green-600 dark:text-[#00ff00]" />,
    label: "Fase 3",
    accent: "from-[#00ff00]/30 via-[#00ff00]/10 to-transparent"
  }
];

export const ServicesSection = React.memo(() => {
  return (
    <section id="services" className="relative overflow-hidden bg-[#000080] py-28 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%)] pointer-events-none" />
      <motion.div
        className="absolute -top-24 left-1/2 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full border border-white/10 pointer-events-none"
        animate={{ rotate: [0, 14, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-32 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border border-dashed border-white/12 pointer-events-none"
        animate={{ rotate: [0, -12, 0], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-3xl text-center lg:mb-20"
        >
          <p className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.28em] text-blue-200">
            Area of Expertise
          </p>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white md:text-7xl">
            Strategia, sviluppo e formazione senza schermate vuote.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100/80 md:text-xl">
            Ho trasformato la sezione in una composizione stabile: le card restano sempre visibili e l&apos;animazione accompagna la lettura invece di nasconderla.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {servicesData.map((service, index) => {
            const isCenter = index === 1;
            const initialRotate = index === 0 ? -6 : index === 2 ? 6 : 0;
            const finalRotate = index === 0 ? -3 : index === 2 ? 3 : 0;

            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 80, rotate: initialRotate, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: isCenter ? -14 : 0, rotate: finalRotate, filter: "blur(0px)" }}
                whileHover={{ y: isCenter ? -22 : -10, rotate: 0, scale: 1.02 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.85, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm dark:bg-[#1e1e1e]/95 dark:border-white/8 md:min-h-[480px] md:p-8 ${isCenter ? 'lg:-translate-y-6' : 'lg:translate-y-8'}`}
              >
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${service.accent} pointer-events-none`} />

                <div className="relative flex items-start justify-between mb-8 md:mb-12">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#252526] md:h-14 md:w-14">
                    {service.icon}
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:bg-[#252526] dark:text-gray-400 md:text-xs">
                    {service.label}
                  </span>
                </div>

                <h3 className="relative mb-3 text-xl font-extrabold leading-tight text-gray-900 dark:text-white md:mb-4 md:text-3xl">
                  {service.title}
                </h3>

                <p className="relative flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
                  {service.description}
                </p>

                <div className="relative mt-6 flex items-center justify-between border-t border-gray-100 pt-5 text-gray-900 transition-colors group-hover:text-[#0078d7] dark:border-gray-800 dark:text-white md:mt-8 md:pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider md:text-sm">
                    Scopri il servizio
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2 md:h-5 md:w-5" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
});
