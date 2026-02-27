
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import ServiceCard from './ServiceCard';

interface CategorySectionProps {
  category: Category;
  selectedServices: Map<string, string>; // ID -> TierID
  relatedServices: Set<string>; // IDs of related services to highlight
  onToggleService: (id: string, tierId?: 'essential' | 'pro' | 'premium') => void;
  isActive: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  selectedServices, 
  relatedServices,
  onToggleService,
  isActive
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(category.subcategories[0]?.id || '');

  React.useEffect(() => {
    if (category.subcategories.length > 0) {
        // If current activeSubTab is not in the new category's subcategories, reset it
        const exists = category.subcategories.some(sub => sub.id === activeSubTab);
        if (!exists) {
            setActiveSubTab(category.subcategories[0].id);
        }
    }
  }, [category, activeSubTab]);

  const activeSubcategory = category.subcategories.find(sub => sub.id === activeSubTab);

  const getSlug = (id: string) => {
      if (id === 'branding') return 'branding';
      if (id === 'visual') return 'visual';
      if (id === 'digital') return 'digital';
      if (id.startsWith('new-cat') || id.includes('ai')) return 'ai-services';
      return id; 
  };
  
  const slug = getSlug(category.id);

  return (
    <div className={`mb-16 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
      <div className="flex items-baseline gap-3 mb-6 border-b border-black pb-2 justify-between">
        <div className="flex items-baseline gap-3">
            <h2 className={`text-2xl font-light uppercase tracking-tight ${isActive ? 'text-black' : 'text-gray-400'}`}>
            {category.title}
            </h2>
            {isActive && <span className="text-[9px] uppercase tracking-widest bg-black text-white px-2 py-0.5 font-bold">ONLINE</span>}
        </div>
        <Link to={`/category/${slug}`} className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-black hover:underline transition-colors">
            + Info & Philosophy
        </Link>
      </div>
      
      {/* Horizontal Tabs Navigation */}
      <div className="flex overflow-x-auto gap-[-1px] mb-8 no-scrollbar">
        {category.subcategories.map(sub => {
            const isTabActive = activeSubTab === sub.id;
            
            // Calculate how many services are selected in this subcategory
            const selectedCount = sub.services.filter(s => selectedServices.has(s.id)).length;
            
            // CHECK FOR HIDDEN RECOMMENDATIONS:
            // Does this subcategory have a service that is RECOMMENDED but NOT SELECTED?
            const hasHiddenRecommendation = sub.services.some(s => 
              relatedServices.has(s.id) && !selectedServices.has(s.id)
            );
            
            return (
                <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id)}
                    className={`
                        whitespace-nowrap px-6 py-4 text-[10px] font-bold uppercase tracking-wider transition-all relative border border-gray-300 border-r-0 last:border-r flex items-center gap-2
                        ${isTabActive 
                            ? 'bg-black text-white border-black z-10' 
                            : 'text-gray-500 bg-white hover:bg-gray-50 hover:text-black'
                        }
                    `}
                >
                    {sub.title}

                    {/* Discovery Alert (Sparkle Icon) */}
                    {hasHiddenRecommendation && !isTabActive && (
                        <span className="flex items-center animate-pulse" title="Sugerencia táctica disponible">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
                                <path d="M12 3l1.912 5.885L20 10.8l-5.088 1.915L13.912 18.6 12 12.715l-1.912 5.885L8.088 12.715 3 10.8l5.088-1.915L10.088 3z" fill="#fbbf24" />
                            </svg>
                        </span>
                    )}

                    {selectedCount > 0 && (
                        <span className={`
                            flex items-center justify-center w-5 h-5 text-[9px] font-mono border
                            ${isTabActive 
                                ? 'bg-[#cd2027] text-white border-[#cd2027]' 
                                : 'bg-gray-200 text-black border-gray-300'
                            }
                        `}>
                            {selectedCount}
                        </span>
                    )}
                </button>
            )
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[200px]">
        {activeSubcategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {activeSubcategory.services.map(service => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    selectedTierId={selectedServices.get(service.id)}
                    isRelated={relatedServices.has(service.id)}
                    onToggle={onToggleService}
                />
                ))}
            </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategorySection;
