
import React from 'react';
import { ProjectObjective } from '../types';

interface ObjectiveSelectorProps {
  objectives: ProjectObjective[];
  selectedObjectiveId: string | null;
  onSelect: (id: string) => void;
}

const IconReach = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const IconSales = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconIdentity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l9 4.2v9.6L12 21l-9-4.2V7.2L12 3z"/><path d="M12 12l9-4.2M12 12v9M12 12L3 7.8"/>
  </svg>
);

const IconProduct = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>
  </svg>
);

const IconDigital = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20"/>
  </svg>
);

const ObjectiveSelector: React.FC<ObjectiveSelectorProps> = ({ objectives, selectedObjectiveId, onSelect }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'reach': return <IconReach />;
      case 'sales': return <IconSales />;
      case 'identity': return <IconIdentity />;
      case 'product': return <IconProduct />;
      case 'digital': return <IconDigital />;
      default: return null;
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Objetivo de Proyecto</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {objectives.map((obj) => {
          const isActive = selectedObjectiveId === obj.id;
          return (
            <button
              key={obj.id}
              onClick={() => onSelect(obj.id)}
              className={`
                flex flex-col items-center justify-center p-5 border transition-all duration-500 group relative overflow-hidden
                ${isActive 
                  ? 'border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]' 
                  : 'border-gray-200 bg-white hover:border-black text-gray-500 hover:text-black'
                }
              `}
            >
              {/* Decorative scanline for active objective */}
              {isActive && <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scan"></div>}
              
              <div className={`mb-3 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {getIcon(obj.icon)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight mb-1">
                {obj.title}
              </span>
              <span className={`text-[8px] font-mono tracking-tighter opacity-60 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                {obj.subtitle}
              </span>
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ObjectiveSelector;
