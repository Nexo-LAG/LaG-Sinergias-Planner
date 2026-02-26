
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// =============================================================================
// DATABASE DE SERVICIOS - EDITA AQUÍ PRECIOS Y DESCRIPCIONES
// =============================================================================

const MULTIPLIERS = {
  PRO: 1.8,     // Precio Essential * 1.8
  PREMIUM: 3.0  // Precio Essential * 3.0
};

const createTiers = (p: number, d: number, u: 'days'|'weeks'|'hours'|'months', desc: [string, string, string], rb: Partial<Resources> = {}): Tier[] => {
  const r = { photos: 0, videos: 0, posts: 0, hours: 0, ...rb };
  return [
    { id: 'essential', name: 'Essential', price: p, duration: d, unit: u, description: desc[0], resources: { ...r, hours: u === 'hours' ? d : 0 } },
    { id: 'pro', name: 'Pro', price: Math.round(p * MULTIPLIERS.PRO), duration: Math.ceil(d * 1.5), unit: u, description: desc[1], resources: { photos: Math.round(r.photos * 1.5), videos: Math.round(r.videos * 1.5), posts: Math.round(r.posts * 1.5), hours: u === 'hours' ? Math.ceil(d * 1.5) : 0 } },
    { id: 'premium', name: 'Premium', price: p * MULTIPLIERS.PREMIUM, duration: d * 2, unit: u, description: desc[2], resources: { photos: r.photos * 3, videos: r.videos * 3, posts: r.posts * 3, hours: u === 'hours' ? d * 2 : 0 } }
  ];
};

const DATA: Category[] = [
  {
    id: 'branding', title: 'Branding & Design', description: 'Identidad y Estrategia Visual',
    subcategories: [
      {
        id: 'b-identity', title: 'Identidad',
        services: [
          { 
            id: 'b-id-creation', name: 'Identidad Visual', description: 'ADN gráfico completo.', stats: { brand: 10, conversion: 2, reach: 1 }, relatedServiceIds: ['b-id-manual'], 
            tiers: createTiers(600, 2, 'weeks', [
              'Logotipo Principal\nPaleta de colores\nTipografías base', 
              'Sistema de logotipos (3 variaciones)\nManual básico\nPapelería (2 piezas)', 
              'Estrategia de Marca\nBrand Book Extenso\nUniverso Gráfico\nGuía Social Media'
            ]) 
          },
          { 
            id: 'b-id-naming', name: 'Naming & Tagline', description: 'Nombre con impacto.', stats: { brand: 9, conversion: 3, reach: 2 }, relatedServiceIds: ['b-id-creation'], 
            tiers: createTiers(300, 1, 'weeks', [
              '3 propuestas de nombre\nComprobación de dominio', 
              '5 propuestas creativas\nTagline / Eslogan comercial', 
              '10 propuestas\nInforme legal (OEPM)\nStorytelling de marca'
            ]) 
          },
          { 
            id: 'b-id-audit', name: 'Auditoría de Marca', description: 'Diagnóstico estratégico.', stats: { brand: 8, conversion: 4, reach: 2 }, relatedServiceIds: ['b-id-creation'], 
            tiers: createTiers(200, 4, 'days', [
              'Análisis de imagen actual', 
              'Auditoría competitiva\nInforme de puntos críticos', 
              'Workshop estratégico\nPlan de rebranding'
            ]) 
          }
        ]
      },
      {
        id: 'b-design', title: 'Diseño Táctico',
        services: [
          { 
            id: 'b-g-pack', name: 'Packaging', description: 'Diseño de envases.', stats: { brand: 7, conversion: 7, reach: 3 }, relatedServiceIds: ['v-p-product'], 
            tiers: createTiers(350, 1, 'weeks', [
              'Diseño etiqueta única', 
              'Envase completo\nArtes finales\nMockup 3D', 
              'Línea de productos (3 SKUs)\nUnboxing experience'
            ]) 
          },
          { 
            id: 'b-g-dossier', name: 'Dossier de Venta', description: 'Presentaciones de alto nivel.', stats: { brand: 5, conversion: 9, reach: 1 }, relatedServiceIds: ['v-p-corp'], 
            tiers: createTiers(280, 5, 'days', [
              'Diseño 5 diapositivas clave', 
              'Dossier 15 páginas\nInfografías a medida', 
              'Diseño interactivo\nRedacción comercial'
            ]) 
          }
        ]
      }
    ]
  },
  {
    id: 'visual', title: 'Visual Content', description: 'Producción de activos foto/video',
    subcategories: [
      {
        id: 'v-photo', title: 'Fotografía',
        services: [
          { 
            id: 'v-p-product', name: 'Producto & E-com', description: 'Bodegones comerciales.', stats: { brand: 5, conversion: 9, reach: 2 }, relatedServiceIds: ['d-w-shop'], 
            tiers: createTiers(300, 2, 'days', [
              '10 fotos catálogo', 
              '20 fotos retoque pro\n2 Bodegones creativos', 
              'Catálogo 50 fotos\nLifestyle context\nDirección de arte'
            ], { photos: 10 }) 
          },
          { 
            id: 'v-p-corp', name: 'Corporativa', description: 'Humaniza la empresa.', stats: { brand: 7, conversion: 3, reach: 3 }, relatedServiceIds: ['d-w-corp'], 
            tiers: createTiers(250, 1, 'days', [
              'Retratos socios', 
              'Equipo completo\nOficinas/Acción', 
              'Documental cultura\nBanco de imagen propio'
            ], { photos: 15 }) 
          }
        ]
      },
      {
        id: 'v-video', title: 'Video & Social',
        services: [
          { 
            id: 'v-v-social', name: 'Reels & TikToks', description: 'Contenido vertical.', stats: { brand: 4, conversion: 6, reach: 10 }, relatedServiceIds: ['d-p-meta'], 
            tiers: createTiers(220, 3, 'days', [
              'Edición de 3 videos', 
              'Grabación + Edición 3 clips\nSubtítulos dinámicos', 
              'Estrategia mensual 10 clips\nGuionización & Hooks'
            ], { videos: 3 }) 
          }
        ]
      }
    ]
  },
  {
    id: 'digital', title: 'Digital Presence', description: 'Web, Growth y Ads',
    subcategories: [
      {
        id: 'd-web', title: 'Desarrollo',
        services: [
          { id: 'd-w-landing', name: 'Landing Page', description: 'Foco en conversión.', stats: { brand: 3, conversion: 10, reach: 4 }, relatedServiceIds: ['d-p-meta'], tiers: createTiers(550, 1, 'weeks', ['Template optimizado', 'Diseño a medida\nCopy persuasivo', 'Funnel completo\nIntegración CRM']) },
          { id: 'd-w-shop', name: 'E-commerce', description: 'Tu tienda Shopify.', stats: { brand: 7, conversion: 10, reach: 5 }, relatedServiceIds: ['v-p-product'], tiers: createTiers(1200, 4, 'weeks', ['Tienda base', 'Diseño UX/UI a medida\nSEO básico', 'Shop avanzada\nAutomatizaciones']) }
        ]
      },
      {
        id: 'd-growth', title: 'Growth & Ads',
        services: [
          { id: 'd-p-meta', name: 'Meta Ads', description: 'Publicidad FB/IG.', stats: { brand: 3, conversion: 9, reach: 10 }, relatedServiceIds: ['v-v-social'], tiers: createTiers(350, 1, 'months', ['Setup pixel/cuenta', 'Gestión 1 campaña\nReporting mensual', 'Retargeting avanzado\nScaling semanal']) },
          { id: 'd-w-seo', name: 'SEO Orgánico', description: 'Posicionamiento Google.', stats: { brand: 5, conversion: 7, reach: 9 }, relatedServiceIds: ['d-w-corp'], tiers: createTiers(400, 1, 'months', ['Auditoría técnica', 'Optimización On-page\nKeyword research', 'Link building\nContenidos SEO']) }
        ]
      }
    ]
  }
];

// =============================================================================
// LÓGICA DE LA APLICACIÓN
// =============================================================================

type TierID = 'essential' | 'pro' | 'premium';
interface ServiceStats { brand: number; conversion: number; reach: number; }
interface Resources { photos: number; videos: number; posts: number; hours: number; }
interface Tier { id: TierID; name: string; price: number; duration: number; unit: 'days' | 'weeks' | 'hours' | 'months'; description: string; resources: Resources; }
interface Service { id: string; name: string; description: string; tiers: Tier[]; stats: ServiceStats; relatedServiceIds: string[]; }
interface Subcategory { id: string; title: string; services: Service[]; }
interface Category { id: string; title: string; description: string; subcategories: Subcategory[]; }
interface ProjectObjective { id: string; title: string; subtitle: string; icon: string; recommendedServiceIds: string[]; }
interface SelectedServiceUI { serviceId: string; name: string; tierId: TierID; price: number; duration: number; stats: ServiceStats; resources: Resources; }
interface Totals { originalPrice: number; synergyDiscountAmount: number; portfolioDiscountAmount: number; finalPrice: number; totalStats: ServiceStats; totalResources: Resources; isPortfolioActive: boolean; }

const OBJECTIVES: ProjectObjective[] = [
  { id: 'reach', title: 'Alcance', subtitle: 'REACH_EXP', icon: 'reach', recommendedServiceIds: ['v-v-social', 'd-p-meta'] },
  { id: 'sales', title: 'Ventas', subtitle: 'CONV_OPT', icon: 'sales', recommendedServiceIds: ['d-w-landing', 'd-p-meta'] },
  { id: 'identity', title: 'Identidad', subtitle: 'BRAND_DNA', icon: 'identity', recommendedServiceIds: ['b-id-creation', 'b-id-naming'] },
  { id: 'product', title: 'Producto', subtitle: 'ASSET_PROD', icon: 'product', recommendedServiceIds: ['v-p-product', 'b-g-pack'] },
  { id: 'digital', title: 'Digital', subtitle: 'CORE_DIGITAL', icon: 'digital', recommendedServiceIds: ['d-w-corp', 'd-w-seo'] }
];

const StatsRadar = ({ stats }: { stats: ServiceStats }) => {
  const cx = 60, cy = 60, r = 40;
  const norm = (v: number) => Math.min((v / 40) * 100, 100);
  const getP = (s: ServiceStats) => {
    const x1 = cx, y1 = cy - (r * (norm(s.brand)/100));
    const x2 = cx + (r * (norm(s.conversion)/100)) * Math.cos(30*Math.PI/180), y2 = cy + (r * (norm(s.conversion)/100)) * Math.sin(30*Math.PI/180);
    const x3 = cx + (r * (norm(s.reach)/100)) * Math.cos(150*Math.PI/180), y3 = cy + (r * (norm(s.reach)/100)) * Math.sin(150*Math.PI/180);
    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
  };
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" className="overflow-visible">
      <polygon points={`60,${cy-r} ${cx+r*0.86},${cy+r*0.5} ${cx-r*0.86},${cy+r*0.5}`} fill="none" stroke="#eee" strokeWidth="1" />
      <polygon points={getP(stats)} fill="rgba(205,32,39,0.05)" stroke="#cd2027" strokeWidth="1.2" />
      <text x="60" y="8" textAnchor="middle" fontSize="6" className="uppercase font-mono font-bold" fill="#aaa">Brand</text>
      <text x="115" y="100" textAnchor="middle" fontSize="6" className="uppercase font-mono font-bold" fill="#aaa">Sale</text>
      <text x="5" y="100" textAnchor="middle" fontSize="6" className="uppercase font-mono font-bold" fill="#aaa">Reach</text>
    </svg>
  );
};

const ServiceCard = ({ service, selectedTierId, onToggle }: { service: Service, selectedTierId?: string, onToggle: any }) => {
  const isSelected = !!selectedTierId;
  const activeTier = service.tiers.find(t => t.id === selectedTierId);
  return (
    <div onClick={() => isSelected ? onToggle(service.id) : onToggle(service.id, 'pro')} className={`p-6 border-2 transition-all cursor-pointer bg-white relative group h-full flex flex-col ${isSelected ? 'border-black shadow-[8px_8px_0px_0px_rgba(205,32,39,1)]' : 'border-gray-100 hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]'}`}>
      <div className="flex-grow">
        <h4 className="font-bold text-sm uppercase mb-1 tracking-tighter">{service.name}</h4>
        <p className="text-[10px] text-gray-400 mb-4 font-mono leading-relaxed">{service.description}</p>
        <div className="flex gap-2 mb-6">
          {['brand','conversion','reach'].map(k => (
            <div key={k} className="flex-1">
              <div className="h-0.5 bg-gray-100 relative mb-1">
                <div className="absolute inset-0 bg-black" style={{width:`${((service.stats as any)[k]/10)*100}%`}}></div>
              </div>
              <span className="text-[7px] uppercase font-bold text-gray-300">{k}</span>
            </div>
          ))}
        </div>
        {isSelected && activeTier && (
          <div className="animate-fade">
            <div className="grid grid-cols-3 border-2 border-black mb-4">
              {(['essential', 'pro', 'premium'] as const).map(tid => (
                <button key={tid} onClick={(e) => {e.stopPropagation(); onToggle(service.id, tid)}} className={`text-[8px] p-2 uppercase font-black transition-colors ${selectedTierId === tid ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}>{tid.substring(0,3)}</button>
              ))}
            </div>
            <div className="bg-gray-50 p-4 border border-gray-200">
              <ul className="space-y-1.5">
                {activeTier.description.split('\n').map((line, i) => (
                  <li key={i} className="text-[10px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#cd2027] mt-1">▪</span> {line}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-baseline border-t border-gray-200 pt-3">
                 <span className="font-mono font-bold text-[#cd2027] text-xs">{activeTier.price}€</span>
                 <span className="text-[9px] font-bold text-gray-400 uppercase">{activeTier.duration} {activeTier.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold">
          <span className="font-mono">{service.tiers[0].price}€+</span>
          <span className="uppercase text-gray-300 group-hover:text-black">+ Añadir</span>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [selectedMap, setSelectedMap] = useState<Map<string, TierID>>(new Map());
  const [objectiveId, setObjectiveId] = useState<string | null>(null);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(DATA[0].id);
  const [activeSubTab, setActiveSubTab] = useState<Map<string, string>>(new Map(DATA.map(c => [c.id, c.subcategories[0].id])));
  const [showProtocolInfo, setShowProtocolInfo] = useState(false);

  const toggle = (sid: string, tid?: TierID) => {
    const next = new Map(selectedMap);
    if (!tid) next.delete(sid); else next.set(sid, tid);
    setSelectedMap(next);
  };

  const selectedList = useMemo(() => {
    const list: SelectedServiceUI[] = [];
    selectedMap.forEach((tid, sid) => {
      DATA.forEach(c => c.subcategories.forEach(sub => {
        const s = sub.services.find(ser => ser.id === sid);
        if (s) {
          const t = s.tiers.find(tr => tr.id === tid)!;
          list.push({ serviceId: sid, name: s.name, tierId: tid, price: t.price, duration: t.duration, stats: s.stats, resources: t.resources });
        }
      }));
    });
    return list;
  }, [selectedMap]);

  const totals = useMemo(() => {
    let p = 0, br = 0, co = 0, re = 0, ph = 0, vi = 0, po = 0;
    selectedList.forEach(i => {
      p += i.price;
      const m = i.tierId === 'pro' ? 1.2 : (i.tierId === 'premium' ? 1.5 : 1);
      br += i.stats.brand*m; co += i.stats.conversion*m; re += i.stats.reach*m;
      ph += i.resources.photos; vi += i.resources.videos; po += i.resources.posts;
    });
    const sAmt = Math.round(p * (selectedList.length >= 3 ? 0.15 : (selectedList.length === 2 ? 0.10 : 0)));
    const portAmt = isPortfolio ? Math.round((p - sAmt) * 0.20) : 0;
    return { originalPrice: p, synergyDiscountAmount: sAmt, portfolioDiscountAmount: portAmt, finalPrice: p - sAmt - portAmt, totalStats: { brand: br, conversion: co, reach: re }, totalResources: { photos: ph, videos: vi, posts: po, hours: 0 }, isPortfolioActive: isPortfolio } as Totals;
  }, [selectedList, isPortfolio]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white">
      {showProtocolInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowProtocolInfo(false)}>
          <div className="bg-white border-4 border-black p-8 max-w-md shadow-[15px_15px_0px_0px_rgba(205,32,39,1)]" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black pb-2">Protocolo P0RT4F0L10</h3>
            <p className="font-mono text-xs text-gray-600 leading-relaxed mb-6">Otorga un 20% de descuento adicional a cambio de autorización de portfolio y libertad creativa técnica.</p>
            <button onClick={() => setShowProtocolInfo(false)} className="w-full py-4 bg-black text-white font-bold uppercase text-xs">Aceptar</button>
          </div>
        </div>
      )}

      <div className="lg:col-span-8">
        <header className="mb-12 border-l-8 border-[#cd2027] pl-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter">LA GRIETA <span className="font-light">PLANNER</span></h1>
          <p className="text-gray-400 text-[10px] font-mono mt-2 uppercase tracking-[0.4em]">Sinergia Táctica · v2.5</p>
        </header>

        <section className="mb-16">
          <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Objetivo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {OBJECTIVES.map(o => (
              <button key={o.id} onClick={() => setObjectiveId(o.id === objectiveId ? null : o.id)} className={`flex flex-col items-center p-5 border-2 transition-all ${o.id === objectiveId ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'}`}>
                <span className="text-[9px] font-bold uppercase tracking-wider">{o.title}</span>
              </button>
            ))}
          </div>
        </section>

        <nav className="flex gap-8 mb-8 border-b border-gray-100 pb-2">
           {DATA.map(cat => (
             <button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`text-xs uppercase font-bold tracking-widest pb-2 transition-all relative ${activeTab === cat.id ? 'text-black' : 'text-gray-300'}`}>
                {cat.title}
                {activeTab === cat.id && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#cd2027]"></div>}
             </button>
           ))}
        </nav>

        {DATA.filter(c => c.id === activeTab).map(cat => (
          <div key={cat.id} className="animate-fade">
             <div className="flex gap-1 mb-8">
                {cat.subcategories.map(sub => (
                    <button key={sub.id} onClick={() => setActiveSubTab(new Map(activeSubTab).set(cat.id, sub.id))} className={`px-4 py-3 text-[9px] font-bold uppercase border-2 transition-all ${activeSubTab.get(cat.id) === sub.id ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-500'}`}>
                      {sub.title}
                    </button>
                ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.subcategories.find(s => s.id === activeSubTab.get(cat.id))?.services.map(s => (
                  <ServiceCard key={s.id} service={s} selectedTierId={selectedMap.get(s.id)} onToggle={toggle} />
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-10 border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
           <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Total Estimado</h3>
           </div>
           <div className="text-5xl font-black font-mono tracking-tighter mb-8">{totals.finalPrice}€</div>

           {selectedList.length > 0 && (
             <div className="mb-8 bg-gray-50 p-4 border border-gray-100">
               <p className="text-[9px] font-bold text-gray-400 uppercase mb-3 border-b border-gray-200 pb-1">Desglose Técnico</p>
               <ul className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                 {selectedList.map(s => (
                   <li key={s.serviceId} className="flex justify-between items-start text-[10px] font-mono">
                     <div className="flex flex-col truncate pr-2">
                        <span className="text-black font-bold truncate uppercase">{s.name}</span>
                        <span className="text-[8px] text-gray-400 uppercase">Plan {s.tierId}</span>
                     </div>
                     <span className="flex-shrink-0 text-black font-bold">{s.price}€</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}

           <div className="space-y-3 mb-10 pb-10 border-b-2 border-dashed border-gray-100">
              <div className="flex justify-between text-[11px] font-mono">
                 <span className="text-gray-400">SUBTOTAL</span>
                 <span className="font-bold">{totals.originalPrice}€</span>
              </div>
              {totals.synergyDiscountAmount > 0 && (
                <div className="flex justify-between text-[11px] font-mono text-[#cd2027]">
                   <span className="font-bold uppercase tracking-wider">SINERGIA (-{selectedList.length >= 3 ? '15%' : '10%'})</span>
                   <span className="font-bold">-{totals.synergyDiscountAmount}€</span>
                </div>
              )}
              <div onClick={() => setIsPortfolio(!isPortfolio)} className={`p-4 border-2 cursor-pointer transition-all flex flex-col gap-1 mt-4 ${isPortfolio ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-black hover:text-black'}`}>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest">Protocolo P0RT4F0L10</span>
                    <span className="text-[9px] font-bold">-20%</span>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); setShowProtocolInfo(true); }} className="text-[7px] text-left underline opacity-50 uppercase mt-1">Ver condiciones</button>
              </div>
           </div>

           <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Análisis de Impacto</p>
              <div className="h-44 relative mb-4"><StatsRadar stats={totals.totalStats} /></div>
           </div>

           <button className="w-full py-5 bg-black text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#cd2027] transition-all">GENERAR DOSSIER PDF</button>
        </div>
      </div>

      <style>{`
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('lagrieta-planner-app')!);
root.render(<App />);
