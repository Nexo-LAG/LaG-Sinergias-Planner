
import React, { useState } from 'react';
import { Totals, SelectedServiceUI, Recommendation } from '../types';
import StatsRadar from './StatsRadar';

interface SummaryPanelProps {
  totals: Totals;
  selectedCount: number;
  recommendation: Recommendation | null;
  selectedServicesList: SelectedServiceUI[]; 
  onGeneratePdf: () => void;
  onRecommendationAction: (id: string, type: 'add' | 'remove' | 'dismiss') => void;
  onTogglePortfolio: () => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  totals, 
  selectedCount, 
  recommendation,
  selectedServicesList,
  onGeneratePdf,
  onRecommendationAction,
  onTogglePortfolio
}) => {
  const [showProtocol, setShowProtocol] = useState(false);

  if (selectedCount === 0) {
    return (
      <div className="sticky top-10 border-2 border-dashed border-gray-200 p-10 text-center bg-white">
        <p className="font-mono text-[10px] text-gray-300 uppercase tracking-widest">Esperando Selección...</p>
      </div>
    );
  }

  return (
    <div className="sticky top-10 border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      
      {/* Modal Protocolo */}
      {showProtocol && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6" onClick={() => setShowProtocol(false)}>
           <div className="bg-white border-4 border-black p-8 max-w-md shadow-[15px_15px_0px_0px_rgba(205,32,39,1)]" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Protocolo P0RT4F0L10</h3>
              <div className="font-mono text-xs space-y-4 text-gray-600 leading-relaxed">
                <p>Otorga un <span className="text-black font-bold">20% de descuento directo</span> a cambio de:</p>
                <ul className="list-disc pl-5 space-y-2">
                   <li>Autorización para publicar el caso de éxito en la web de La Grieta.</li>
                   <li>Mención de autoría en redes sociales al publicar piezas.</li>
                   <li>Libertad creativa supervisada por nuestro equipo técnico.</li>
                </ul>
              </div>
              <button onClick={() => setShowProtocol(false)} className="mt-8 w-full py-3 bg-black text-white font-bold uppercase text-[10px]">Entendido</button>
           </div>
        </div>
      )}

      {/* Cabecera Precio */}
      <div className="p-8 border-b-2 border-black">
        <div className="flex justify-between items-end mb-6">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inversión Final</p>
              <h2 className="text-5xl font-black font-mono tracking-tighter">{totals.finalPrice}€</h2>
           </div>
           <div className="text-right">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-bold font-mono">
                ~ {Math.ceil(totals.maxDays / 5)} SEMANAS
              </span>
           </div>
        </div>

        {/* LISTADO DE SERVICIOS Y COSTES */}
        <div className="bg-gray-50 border border-gray-100 p-4 mb-6">
           <p className="text-[9px] font-bold text-gray-400 uppercase mb-3 border-b border-gray-200 pb-1">Desglose de Servicios</p>
           <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {selectedServicesList.map(s => (
                <li key={s.serviceId} className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-black font-bold truncate pr-4">{s.name} <span className="text-[8px] text-gray-400 uppercase">[{s.tierId}]</span></span>
                  <span className="flex-shrink-0 text-gray-900">{s.price}€</span>
                </li>
              ))}
           </ul>
        </div>

        <div className="space-y-2 font-mono text-[11px] mb-6">
           <div className="flex justify-between text-gray-400">
              <span>Valor Base</span>
              <span>{totals.originalPrice}€</span>
           </div>
           {totals.synergyDiscountAmount > 0 && (
             <div className="flex justify-between text-[#cd2027] font-bold">
                <span>Sinergia Táctica (-{totals.synergyLevel === 2 ? '15' : '10'}%)</span>
                <span>-{totals.synergyDiscountAmount}€</span>
             </div>
           )}
           {totals.isPortfolioActive && (
             <div className="flex justify-between text-[#cd2027] font-bold">
                <span>Protocolo Portfolio (-20%)</span>
                <span>-{totals.portfolioDiscountAmount}€</span>
             </div>
           )}
        </div>

        <div className="flex items-center justify-between border-t-2 border-dashed border-gray-100 pt-4">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={onTogglePortfolio}>
              <div className={`w-5 h-5 border-2 border-black flex items-center justify-center transition-colors ${totals.isPortfolioActive ? 'bg-black' : 'bg-white'}`}>
                 {totals.isPortfolioActive && <div className="w-2 h-2 bg-white" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-[#cd2027]">Protocolo P0RT4F0L10</span>
           </div>
           <button onClick={() => setShowProtocol(true)} className="w-5 h-5 bg-gray-100 text-gray-400 text-[10px] hover:bg-black hover:text-white border border-gray-200">?</button>
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-b border-gray-200">
         <StatsRadar stats={totals.totalStats} />
         <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center p-2 border border-white">
               <p className="text-xs font-bold font-mono">{totals.totalResources.photos}</p>
               <p className="text-[8px] font-bold text-gray-400">FOTOS</p>
            </div>
            <div className="text-center p-2 border border-white">
               <p className="text-xs font-bold font-mono">{totals.totalResources.videos}</p>
               <p className="text-[8px] font-bold text-gray-400">VIDEOS</p>
            </div>
            <div className="text-center p-2 border border-white">
               <p className="text-xs font-bold font-mono">{totals.totalResources.posts}</p>
               <p className="text-[8px] font-bold text-gray-400">POSTS</p>
            </div>
         </div>
      </div>

      <div className="p-8 bg-white">
         <button onClick={onGeneratePdf} className="w-full py-5 bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(205,32,39,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Generar Dossier PDF</button>
      </div>
    </div>
  );
};

export default SummaryPanel;
