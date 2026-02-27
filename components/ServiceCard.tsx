
import React from 'react';
import { Service, Tier } from '../types';

interface ServiceCardProps {
  service: Service;
  selectedTierId: string | undefined;
  isRelated: boolean;
  onToggle: (id: string, tierId?: 'essential' | 'pro' | 'premium') => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, selectedTierId, isRelated, onToggle }) => {
  const isSelected = !!selectedTierId;

  const handleTierSelect = (e: React.MouseEvent, tid: 'essential' | 'pro' | 'premium') => {
    e.stopPropagation();
    onToggle(service.id, tid);
  };

  const renderDetails = (text: string) => (
    <ul className="mt-3 space-y-1.5">
      {text.split('\n').map((line, i) => (
        <li key={i} className="text-[11px] text-gray-600 flex items-start gap-2">
          <span className="text-[#cd2027] mt-1">▪</span>
          <span className="leading-tight">{line}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div 
      className={`relative border-2 p-6 transition-all bg-white cursor-pointer flex flex-col h-full ${isSelected ? 'border-black shadow-[8px_8px_0px_0px_rgba(205,32,39,1)]' : 'border-gray-100 hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]'}`}
      onClick={() => isSelected ? onToggle(service.id) : onToggle(service.id, 'pro')}
    >
      {isRelated && !isSelected && <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 border-2 border-black flex items-center justify-center animate-bounce z-20">★</div>}
      
      <div className="flex-grow">
        <h3 className="font-bold text-sm uppercase tracking-tighter mb-1">{service.name}</h3>
        <p className="text-[10px] font-mono text-gray-400 leading-tight mb-4">{service.description}</p>
        
        {/* Stats bars */}
        <div className="flex gap-2 mb-6">
          {Object.entries(service.stats).map(([key, val]) => (
            <div key={key} className="flex-1">
              <div className="h-0.5 bg-gray-100 overflow-hidden">
                <div className="h-full bg-black transition-all" style={{width: `${((val as number)/10)*100}%`}} />
              </div>
              <span className="text-[7px] uppercase font-bold text-gray-300 tracking-tighter">{key}</span>
            </div>
          ))}
        </div>

        {isSelected && (
          <div className="animate-fadeIn">
            <div className="flex border-2 border-black mb-4">
              {(['essential', 'pro', 'premium'] as const).map(tid => (
                <button 
                  key={tid} 
                  onClick={(e) => handleTierSelect(e, tid)}
                  className={`flex-1 py-1.5 text-[9px] font-black uppercase transition-colors ${selectedTierId === tid ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                >
                  {tid.substring(0,3)}
                </button>
              ))}
            </div>
            
            {service.tiers.find(t => t.id === selectedTierId) && (
              <div className="bg-gray-50 p-4 border border-gray-200">
                {renderDetails(service.tiers.find(t => t.id === selectedTierId)!.description)}
                <div className="mt-4 flex justify-between items-baseline border-t border-gray-200 pt-3">
                   <span className="font-mono font-bold text-[#cd2027] text-xs">{service.tiers.find(t => t.id === selectedTierId)!.price}€</span>
                   <span className="text-[9px] font-bold text-gray-400">{service.tiers.find(t => t.id === selectedTierId)!.duration} {service.tiers.find(t => t.id === selectedTierId)!.unit}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isSelected && (
        <div className="mt-auto pt-4 flex justify-between items-center text-[10px] font-bold border-t border-gray-50">
          <span className="font-mono">{service.tiers[0].price}€+</span>
          <span className="uppercase text-gray-300 group-hover:text-black">+ Añadir</span>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
