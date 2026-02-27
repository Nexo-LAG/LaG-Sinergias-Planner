import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, FileText, Mic, Globe, Image as ImageIcon, 
  Receipt, Palette, Zap, CheckCircle, Terminal, 
  Shield, Database, Activity, Lock
} from 'lucide-react';

// --- Types ---
interface AgentNode {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ElementType;
  category: 'legal' | 'creative' | 'utility' | 'core';
  x: number; // Grid column (1-12)
  y: number; // Grid row (1-12)
}

// --- Data ---
const agents: AgentNode[] = [
  {
    id: 'core-brain',
    title: 'NUCLEUS CORE',
    shortDesc: 'Local LLM Orchestrator',
    fullDesc: 'Coordinador central de modelos locales. Gestiona la privacidad y el enrutamiento de datos.',
    icon: Cpu,
    category: 'core',
    x: 6, y: 6
  },
  {
    id: 'better-ai',
    title: 'BETTER AI THAN SORRY',
    shortDesc: 'Legal Analyst',
    fullDesc: 'Analista legal que permite subir contratos en PDF, explicando coloquialmente sus cláusulas y resaltando áreas peligrosas.',
    icon: Shield,
    category: 'legal',
    x: 3, y: 4
  },
  {
    id: 'plaud',
    title: 'PLAUD-NEXT SYNC',
    shortDesc: 'Office Assistant',
    fullDesc: 'Transcribe reuniones, genera resúmenes y resuelve dudas con proactividad. Almacenamiento local seguro.',
    icon: Database,
    category: 'utility',
    x: 9, y: 4
  },
  {
    id: 'vocalis',
    title: 'VOCALIS IA',
    description: 'Text-to-Speech Advanced',
    shortDesc: 'TTS Studio',
    fullDesc: 'Locutor avanzado con selector de voces (Masculino, Femenino, Robot) y asistente de tono para marketing.',
    icon: Mic,
    category: 'creative',
    x: 2, y: 8
  },
  {
    id: 'sinergia',
    title: 'SINERGIA TRANSLATE',
    shortDesc: 'Multi-Lingual SEO',
    fullDesc: 'Traducción optimizada para PDFs e inyección de SEO desde el código base. (ESP, ENG, CAT, FRA, ITA...)',
    icon: Globe,
    category: 'utility',
    x: 10, y: 8
  },
  {
    id: 'restaurador',
    title: 'RESTORATION UNIT',
    shortDesc: 'GFPGAN Image Fixer',
    fullDesc: 'Escanea documentos dañados o imágenes viejas y las regenera limpias con Deep Learning.',
    icon: ImageIcon,
    category: 'creative',
    x: 4, y: 10
  },
  {
    id: 'facturas',
    title: 'INVOICE GEN',
    shortDesc: 'Smart Billing',
    fullDesc: 'Crea facturas precisas con cálculos IA y formatos compatibles con Hacienda (SAS).',
    icon: Receipt,
    category: 'utility',
    x: 8, y: 10
  },
  {
    id: 'carteles',
    title: 'DIFFUSION STUDIO',
    shortDesc: 'Stable Diffusion',
    fullDesc: 'Creación de carteles de eventos y menús listos para imprenta con adaptación automática.',
    icon: Palette,
    category: 'creative',
    x: 1, y: 6
  },
  {
    id: 'plugin',
    title: 'MEDIA ENCODER',
    shortDesc: 'AV1 / 4K Lossless',
    fullDesc: 'Compresión IA que reduce drásticamente el peso de imágenes 4K y video AV1.',
    icon: Zap,
    category: 'utility',
    x: 11, y: 6
  },
  {
    id: 'grammar',
    title: 'GRAMMAR SENTINEL',
    shortDesc: 'Speller & Signatures',
    fullDesc: 'Corrector previo a publicación y generador de firmas HTML profesionales.',
    icon: CheckCircle,
    category: 'utility',
    x: 6, y: 2
  }
];

// --- Components ---

const GlitchText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#cd2027] opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none">{text}</span>
    </div>
  );
};

const ConnectionLine = ({ start, end, active }: { start: {x:number, y:number}, end: {x:number, y:number}, active: boolean }) => {
  // Convert grid coordinates to percentages roughly
  const x1 = (start.x / 12) * 100;
  const y1 = (start.y / 12) * 100;
  const x2 = (end.x / 12) * 100;
  const y2 = (end.y / 12) * 100;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <motion.path
        d={`M ${x1}% ${y1}% L ${x2}% ${y2}%`}
        stroke={active ? '#cd2027' : '#333'}
        strokeWidth={active ? 2 : 1}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: active ? 1 : 0.3 }}
        transition={{ duration: 1 }}
      />
      {active && (
        <motion.circle r="3" fill="#fff">
          <animateMotion 
            dur="1.5s" 
            repeatCount="indefinite"
            path={`M ${x1}% ${y1}% L ${x2}% ${y2}%`}
          />
        </motion.circle>
      )}
    </svg>
  );
};

const AgentCard = ({ agent, onClick, isActive }: { agent: AgentNode, onClick: () => void, isActive: boolean }) => {
  return (
    <motion.div
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
        w-32 h-32 md:w-40 md:h-40
        flex flex-col items-center justify-center text-center p-4
        border bg-black transition-all duration-300
        group
        ${isActive 
          ? 'border-[#cd2027] z-50 shadow-[0_0_50px_rgba(205,32,39,0.4)] scale-110' 
          : 'border-white/10 hover:border-white/40 hover:bg-white/5'
        }
      `}
      style={{ 
        left: `${(agent.x / 12) * 100}%`, 
        top: `${(agent.y / 12) * 100}%`,
        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      <div className={`
        mb-3 p-3 rounded-full 
        ${isActive ? 'bg-[#cd2027] text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}
        transition-colors
      `}>
        <agent.icon size={24} />
      </div>
      <h3 className="text-[10px] font-bold font-mono uppercase tracking-wider leading-tight">
        {agent.title}
      </h3>
      <div className={`
        absolute -bottom-6 left-1/2 transform -translate-x-1/2
        text-[9px] text-[#cd2027] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
      `}>
        {isActive ? 'ACTIVE NODE' : 'CLICK TO INSPECT'}
      </div>
      
      {/* Tech decoration */}
      <div className="absolute top-1 right-1 w-1 h-1 bg-white/20" />
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20" />
    </motion.div>
  );
};

const AILanding: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const activeAgent = agents.find(a => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-[#cd2027] selection:text-white">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 z-0" />
      
      {/* Grid Floor */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none perspective-grid"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
          transformOrigin: 'top center'
        }}
      />
      
      {/* Scanlines */}
      <div className="fixed inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />

      {/* --- CONTENT --- */}
      <div className="relative z-20 container mx-auto px-4 pt-32 pb-12 min-h-screen flex flex-col">
        
        {/* Title Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-[#cd2027] bg-[#cd2027]/10 text-[#cd2027] text-[10px] font-mono uppercase tracking-[0.2em] mb-4"
          >
            <Lock size={10} />
            <span>Local Privacy Protocol Active</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-2 leading-none">
            <GlitchText text="AI AGENTS" />
          </h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-900 leading-none">
            ECOSYSTEM
          </h2>
        </div>

        {/* Main Interface */}
        <div className="flex-grow relative w-full max-w-7xl mx-auto h-[600px] md:h-[700px] border-y border-white/10 bg-black/50 backdrop-blur-sm">
          
          {/* Decorative UI Elements */}
          <div className="absolute top-0 left-0 p-4 font-mono text-[10px] text-gray-500">
            <div>SYS.STATUS: <span className="text-green-500">ONLINE</span></div>
            <div>NODES: {agents.length}</div>
            <div>GPU: DETECTING...</div>
          </div>
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gray-500 text-right">
            <div>LATENCY: 12ms</div>
            <div>REGION: LOCALHOST</div>
          </div>

          {/* Connections */}
          <div className="absolute inset-0 z-0">
            {agents.map(agent => {
               // Connect everything to core
               if (agent.id === 'core-brain') return null;
               const core = agents.find(a => a.id === 'core-brain')!;
               return (
                 <ConnectionLine 
                    key={agent.id} 
                    start={core} 
                    end={agent} 
                    active={selectedAgent === agent.id || selectedAgent === 'core-brain'} 
                 />
               );
            })}
          </div>

          {/* Agents Grid */}
          <div className="absolute inset-0 z-10">
            {agents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                isActive={selectedAgent === agent.id}
                onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
              />
            ))}
          </div>

          {/* Info Panel (Overlay) */}
          <AnimatePresence>
            {activeAgent && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-80 bg-black border border-white/20 p-6 z-50 shadow-2xl"
                style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
              >
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="p-2 bg-[#cd2027] text-white">
                    <activeAgent.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">{activeAgent.title}</h3>
                    <p className="text-[10px] font-mono text-[#cd2027]">{activeAgent.shortDesc}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed mb-6 font-mono">
                  {activeAgent.fullDesc}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>STATUS</span>
                    <span className="text-green-500">READY</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>PRIVACY</span>
                    <span className="text-white">LOCAL ENCRYPTED</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>MODEL</span>
                    <span className="text-white">LLAMA-3-QUANTIZED</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-[#cd2027] hover:text-white transition-colors">
                  Deploy Agent
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer Ticker */}
        <div className="mt-8 border-t border-white/10 pt-4 overflow-hidden">
             <div className="whitespace-nowrap animate-marquee text-[10px] font-mono text-gray-600">
                /// BETTER AI THAN SORRY /// PLAUD-NEXT SYNC /// VOCALIS IA /// SINERGIA TRANSLATE /// RESTAURADOR DE ARCHIVOS /// GENERADOR INTELIGENTE DE FACTURAS ///
             </div>
        </div>

      </div>
      
      <style>{`
        .perspective-grid {
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default AILanding;
