

import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import SummaryPanel from './components/SummaryPanel';
import ObjectiveSelector from './components/ObjectiveSelector';
import { DATA, OBJECTIVES } from './constants';
import { Service, Totals, ServiceStats, Resources, Recommendation, SelectedServiceUI } from './types';
import { generatePDF } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [selectedServicesMap, setSelectedServicesMap] = useState<Map<string, string>>(new Map());
  const [lastSelectedServiceId, setLastSelectedServiceId] = useState<string | null>(null);
  const [isPortfolioActive, setIsPortfolioActive] = useState(false);
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(new Set());
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  const toggleService = (id: string, tierId?: 'essential' | 'pro' | 'premium') => {
    const newMap = new Map(selectedServicesMap);
    if (!tierId) {
      if (newMap.has(id)) {
        newMap.delete(id);
      }
    } else {
      newMap.set(id, tierId);
      setLastSelectedServiceId(id);
    }
    setSelectedServicesMap(newMap);
  };

  const selectedServicesList = useMemo((): SelectedServiceUI[] => {
    const list: SelectedServiceUI[] = [];
    selectedServicesMap.forEach((tierId, serviceId) => {
        for (const cat of DATA) {
            for (const sub of cat.subcategories) {
                const s = sub.services.find(serv => serv.id === serviceId);
                if (s) {
                    const tier = s.tiers.find(t => t.id === tierId);
                    if (tier) {
                        let multiplier = 1;
                        if (tier.unit === 'weeks') multiplier = 5;
                        else if (tier.unit === 'hours') multiplier = 1/8; 

                        list.push({
                            serviceId: s.id,
                            name: s.name,
                            tierId: tierId as 'essential' | 'pro' | 'premium',
                            price: tier.price,
                            duration: tier.duration * multiplier,
                            stats: s.stats,
                            resources: tier.resources
                        });
                    }
                    return;
                }
            }
        }
    });
    return list;
  }, [selectedServicesMap]);

  // --- Calculations ---
  const totals = useMemo((): Totals => {
    let totalPrice = 0;
    let totalDays = 0;
    let totalStats: ServiceStats = { brand: 0, conversion: 0, reach: 0 };
    let totalResources: Resources = { photos: 0, videos: 0, posts: 0, hours: 0 };
    
    const servicesCount = selectedServicesList.length;

    selectedServicesList.forEach(item => {
        totalPrice += item.price;
        totalDays += item.duration;

        let statMultiplier = 1;
        if (item.tierId === 'pro') statMultiplier = 1.2;
        if (item.tierId === 'premium') statMultiplier = 1.5;

        totalStats.brand += item.stats.brand * statMultiplier;
        totalStats.conversion += item.stats.conversion * statMultiplier;
        totalStats.reach += item.stats.reach * statMultiplier;

        totalResources.photos += item.resources.photos;
        totalResources.videos += item.resources.videos;
        totalResources.posts += item.resources.posts;
        totalResources.hours += item.resources.hours;
    });

    let synergyDiscountPercent = 0;
    if (servicesCount === 2) synergyDiscountPercent = 0.10;
    if (servicesCount >= 3) synergyDiscountPercent = 0.15;

    const synergyDiscountAmount = Math.round(totalPrice * synergyDiscountPercent);
    const priceAfterSynergy = totalPrice - synergyDiscountAmount;

    let portfolioDiscountAmount = 0;
    if (isPortfolioActive) {
        portfolioDiscountAmount = Math.round(priceAfterSynergy * 0.20);
    }

    const finalPrice = priceAfterSynergy - portfolioDiscountAmount;

    return {
      originalPrice: totalPrice,
      synergyDiscountAmount,
      portfolioDiscountAmount,
      finalPrice: finalPrice,
      minDays: totalDays,
      maxDays: totalDays,
      synergyLevel: servicesCount >= 3 ? 2 : (servicesCount === 2 ? 1 : 0),
      isPortfolioActive,
      totalStats,
      totalResources
    };
  }, [selectedServicesMap, selectedServicesList, isPortfolioActive]);

  // --- Related Services Logic ---
  const relatedServicesSet = useMemo(() => {
     const set = new Set<string>();
     
     // 1. Objective-based recommendations (Global)
     if (selectedObjectiveId) {
        const obj = OBJECTIVES.find(o => o.id === selectedObjectiveId);
        if (obj) {
            obj.recommendedServiceIds.forEach(id => set.add(id));
        }
     }

     // 2. Selection-based recommendations (Contextual)
     if (lastSelectedServiceId) {
        let lastService: Service | undefined;
        for (const cat of DATA) {
            for (const sub of cat.subcategories) {
                const s = sub.services.find(serv => serv.id === lastSelectedServiceId);
                if (s) { lastService = s; break; }
            }
        }
        if (lastService) {
            lastService.relatedServiceIds.forEach(id => set.add(id));
        }
     }
     return set;
  }, [selectedObjectiveId, lastSelectedServiceId]);

  // --- Smart Recommendation Engine ---
  const recommendation = useMemo((): Recommendation | null => {
    if (selectedServicesMap.size === 0) return null;

    // 0. Oversale Detection
    const idCreationTier = selectedServicesMap.get('b-id-creation');
    const recIdCards = 'oversale-cards';
    if (!dismissedRecs.has(recIdCards) && (idCreationTier === 'pro' || idCreationTier === 'premium') && selectedServicesMap.has('b-g-cards')) {
       return {
          type: 'oversale',
          text: "AVISO DE REDUNDANCIA: El pack de 'Identidad' seleccionado ya incluye papelería corporativa.",
          serviceId: 'b-g-cards',
          serviceName: 'Tarjetas y Papelería'
       };
    }

    const recIdLanding = 'oversale-landing';
    if (!dismissedRecs.has(recIdLanding) && selectedServicesMap.has('d-w-shop') && selectedServicesMap.has('d-w-landing')) {
        return {
           type: 'oversale',
           text: "OPTIMIZACIÓN: Un E-commerce suele cubrir las funciones de conversión de una Landing Page.",
           serviceId: 'd-w-landing',
           serviceName: 'Landing Page'
        };
    }

    // 1. Context Aware
    if (lastSelectedServiceId) {
        let lastService: Service | undefined;
        for (const cat of DATA) {
            for (const sub of cat.subcategories) {
                const s = sub.services.find(serv => serv.id === lastSelectedServiceId);
                if (s) { lastService = s; break; }
            }
        }

        if (lastService && lastService.relatedServiceIds) {
            const recommendationId = lastService.relatedServiceIds.find(rid => !selectedServicesMap.has(rid));
            
            if (recommendationId && !dismissedRecs.has(recommendationId)) {
                let recService: Service | undefined;
                for (const cat of DATA) {
                     for (const sub of cat.subcategories) {
                        const s = sub.services.find(serv => serv.id === recommendationId);
                        if (s) { recService = s; break; }
                     }
                }

                if (recService) {
                    const projectedStats = { ...totals.totalStats };
                    projectedStats.brand += recService.stats.brand * 1.2;
                    projectedStats.conversion += recService.stats.conversion * 1.2;
                    projectedStats.reach += recService.stats.reach * 1.2;

                    return {
                        type: 'opportunity',
                        text: `Basado en "${lastService.name}", añade "${recService.name}" para potenciar resultados.`,
                        serviceId: recService.id,
                        serviceName: recService.name,
                        potentialStats: projectedStats
                    };
                }
            }
        }
    }
    
    return null;
  }, [selectedServicesMap, lastSelectedServiceId, totals.totalStats, dismissedRecs]);

  const handleGeneratePdf = () => {
    const activeCategories = DATA.filter(cat => 
      cat.subcategories.some(sub => 
        sub.services.some(s => selectedServicesMap.has(s.id))
      )
    );
    generatePDF(selectedServicesList, activeCategories, totals);
  };

  const handleRecommendationAction = (id: string, actionType: 'add' | 'remove' | 'dismiss') => {
      if (actionType === 'dismiss') {
          setDismissedRecs(prev => new Set(prev).add(id));
          return;
      }
      
      if (actionType === 'add') {
          if (id.startsWith('gap-')) {
              setDismissedRecs(prev => new Set(prev).add(id));
          } else {
              toggleService(id, 'pro');
          }
      } else {
          toggleService(id);
      }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 lg:p-20 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <Header />
          
          <ObjectiveSelector 
            objectives={OBJECTIVES} 
            selectedObjectiveId={selectedObjectiveId}
            onSelect={(id) => setSelectedObjectiveId(id === selectedObjectiveId ? null : id)}
          />

          <div className="space-y-4">
            {DATA.map(category => (
              <CategorySection
                key={category.id}
                category={category}
                selectedServices={selectedServicesMap}
                relatedServices={relatedServicesSet}
                onToggleService={toggleService}
                isActive={category.subcategories.some(sub => 
                  sub.services.some(s => selectedServicesMap.has(s.id))
                )}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 relative">
          <SummaryPanel 
            totals={totals}
            selectedCount={selectedServicesMap.size}
            recommendation={recommendation}
            selectedServicesList={selectedServicesList}
            onGeneratePdf={handleGeneratePdf}
            onRecommendationAction={handleRecommendationAction}
            onTogglePortfolio={() => setIsPortfolioActive(!isPortfolioActive)}
          />
        </div>

      </div>
    </div>
  );
};

export default App;