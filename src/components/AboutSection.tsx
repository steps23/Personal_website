import React from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, Briefcase, Award, Code2, Terminal } from 'lucide-react';

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={`bg-white dark:bg-[#252526] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    {children}
  </motion.div>
);

export const AboutSection = React.memo(() => {
  return (
    <section id="about" className="py-56 px-6 bg-gray-50 dark:bg-[#1e1e1e] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Chi sono</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-mono">Ingegnere Informatico & AI Specialist</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {/* Bio Card - Spans 2 columns */}
          <BentoCard className="md:col-span-2 row-span-2" delay={0.1}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Stefano Ruggiero</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sono un Ingegnere Informatico con una forte passione per l'Intelligenza Artificiale e lo sviluppo di soluzioni software innovative. Aiuto le aziende a comprendere e integrare le tecnologie AI nei loro processi, creando ponti tra opportunità di business e implementazioni tecniche concrete.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="px-4 py-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-full text-sm font-mono font-medium">Python</span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-full text-sm font-mono font-medium">TypeScript</span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-full text-sm font-mono font-medium">Machine Learning</span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-full text-sm font-mono font-medium">LLMs</span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-full text-sm font-mono font-medium">React</span>
            </div>
          </BentoCard>

          {/* Education Card */}
          <BentoCard delay={0.2}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl">
                <GraduationCap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold">Formazione</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Laurea Magistrale</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ingegneria Informatica</p>
              </div>
              <div>
                <p className="font-bold">Laurea Triennale</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ingegneria Informatica</p>
              </div>
            </div>
          </BentoCard>

          {/* Experience Card */}
          <BentoCard delay={0.3}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Esperienza</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold">Consulente AI/IT</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Freelance • Presente</p>
              </div>
              <div>
                <p className="font-bold">Sviluppatore Software</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Esperienze pregresse</p>
              </div>
            </div>
          </BentoCard>

          {/* Download CV Card */}
          <BentoCard className="md:col-span-3 bg-gradient-to-r from-[#000080] to-[#0078d7] text-white border-none" delay={0.4}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Vuoi saperne di più?</h3>
                <p className="text-blue-100">Scarica il mio curriculum vitae per un quadro completo delle mie competenze ed esperienze.</p>
              </div>
              <button className="px-8 py-4 bg-white text-[#000080] font-bold rounded-full hover:bg-[#ffcc00] hover:text-[#000080] transition-colors flex items-center whitespace-nowrap">
                <Award className="w-5 h-5 mr-2" />
                Scarica CV
              </button>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
});
