
import { Category, Tier, Resources, ProjectObjective } from './types';

const createTiers = (
  basePrice: number, 
  baseDays: number, 
  // Added 'months' to unit type to support monthly recurring services
  unit: 'days'|'weeks'|'hours'|'months', 
  details: [string, string, string],
  resourceBase: Partial<Resources> = {}
): Tier[] => {
  const defaults: Resources = { photos: 0, videos: 0, posts: 0, hours: 0 };
  const r = { ...defaults, ...resourceBase };

  return [
    { 
      id: 'essential', name: 'Essential', price: basePrice, duration: baseDays, unit, description: details[0],
      resources: { ...r, hours: unit === 'hours' ? baseDays : 0 }
    },
    { 
      id: 'pro', name: 'Pro', price: Math.round(basePrice * 1.8), duration: Math.ceil(baseDays * 1.5), unit, description: details[1],
      resources: { 
        photos: Math.round(r.photos * 1.5), 
        videos: Math.round(r.videos * 1.5), 
        posts: Math.round(r.posts * 1.5),
        hours: unit === 'hours' ? Math.ceil(baseDays * 1.5) : 0
      }
    },
    { 
      id: 'premium', name: 'Premium', price: basePrice * 3, duration: baseDays * 2, unit, description: details[2],
      resources: { 
        photos: r.photos * 3, 
        videos: r.videos * 3, 
        posts: r.posts * 3,
        hours: unit === 'hours' ? baseDays * 2 : 0
      }
    }
  ];
};

export const OBJECTIVES: ProjectObjective[] = [
  { id: 'reach', title: 'Alcance e Impacto', subtitle: 'REACH_EXPANSION', icon: 'reach', recommendedServiceIds: ['v-v-social', 'v-s-social', 'd-p-meta', 'v-c-ugc'] },
  { id: 'sales', title: 'Ventas y Conversión', subtitle: 'SALE_OPTIMIZATION', icon: 'sales', recommendedServiceIds: ['d-w-landing', 'd-p-meta', 'd-p-google', 'd-c-copy', 'd-p-funnel'] },
  { id: 'identity', title: 'Nueva Identidad', subtitle: 'BRAND_DNA', icon: 'identity', recommendedServiceIds: ['b-id-creation', 'b-id-manual', 'b-id-naming', 'b-g-social'] },
  { id: 'product', title: 'Lanzamiento Prod.', subtitle: 'ASSET_PROD', icon: 'product', recommendedServiceIds: ['v-p-product', 'v-v-product', 'b-g-pack'] },
  { id: 'digital', title: 'Presencia Digital', subtitle: 'CORE_STRUCTURE', icon: 'digital', recommendedServiceIds: ['d-w-corp', 'd-w-seo', 'd-w-mant', 'v-p-corp'] }
];

export const DATA: Category[] = [
  {
    id: 'branding',
    title: 'Branding & Design',
    description: 'Marca, identidad y diseño estratégico',
    subcategories: [
      {
        id: 'b-identity',
        title: 'Identidad Core',
        services: [
          {
            id: 'b-id-creation',
            name: 'Identidad Visual',
            description: 'El ADN visual completo de tu marca.',
            stats: { brand: 10, conversion: 2, reach: 1 },
            relatedServiceIds: ['d-w-landing', 'v-p-corp'],
            tiers: createTiers(600, 2, 'weeks', [
              'Logo Principal\nPaleta Cromática\nTipografías base',
              'Sistemas de Logos (3 props)\nManual de Uso Básico\nDiseño Papelería (2 piezas)',
              'Estrategia de Marca\nBrand Book Extenso\nUniverso Gráfico\nManual de Estilo Social Media'
            ])
          },
          {
            id: 'b-id-naming',
            name: 'Naming & Tagline',
            description: 'Nombre y eslogan estratégico.',
            stats: { brand: 9, conversion: 3, reach: 2 },
            relatedServiceIds: ['b-id-creation'],
            tiers: createTiers(250, 1, 'weeks', [
              '3 propuestas de nombre\nComprobación de dominio',
              '5 propuestas creativas\nTagline / Eslogan\nConcepto de marca',
              '10 propuestas\nInforme de viabilidad legal\nStorytelling de marca'
            ])
          },
          {
            id: 'b-id-manual',
            name: 'Manual de Marca',
            description: 'La biblia de tu identidad.',
            stats: { brand: 8, conversion: 1, reach: 0 },
            relatedServiceIds: ['b-g-dossier'],
            tiers: createTiers(200, 4, 'days', [
              'Guía de logo y color',
              'Manual técnico completo\nGrid constructivo\nAplicaciones básicas',
              'Brand Book 360º\nTono de voz\nGuía fotográfica'
            ])
          }
        ]
      },
      {
        id: 'b-graphic',
        title: 'Diseño Gráfico',
        services: [
          {
            id: 'b-g-pack',
            name: 'Packaging',
            description: 'Diseño de envases y etiquetas.',
            stats: { brand: 7, conversion: 6, reach: 2 },
            relatedServiceIds: ['v-p-product'],
            tiers: createTiers(300, 1, 'weeks', [
              'Etiqueta frontal única',
              'Caja o envase completo\nArtes finales\nMockup 3D',
              'Línea completa (3 SKUs)\nMateriales especiales\nUnboxing experience'
            ])
          },
          {
            id: 'b-g-dossier',
            name: 'Dossier de Venta',
            description: 'Presentaciones que cierran tratos.',
            stats: { brand: 5, conversion: 9, reach: 1 },
            relatedServiceIds: ['v-p-corp'],
            tiers: createTiers(250, 1, 'weeks', [
              'Diseño 5 diapositivas',
              'Dossier 15 páginas\nInfografías a medida',
              'Presentación interactiva\nContenido redactado\nEstrategia comercial'
            ])
          }
        ]
      }
    ]
  },
  {
    id: 'visual',
    title: 'Visual Content',
    description: 'Producción de activos foto y video',
    subcategories: [
      {
        id: 'v-photo',
        title: 'Fotografía',
        services: [
          {
            id: 'v-p-product',
            name: 'Foto E-commerce',
            description: 'Producto para catálogo.',
            stats: { brand: 4, conversion: 10, reach: 3 },
            relatedServiceIds: ['d-w-shop'],
            tiers: createTiers(250, 2, 'days', [
              '10 fotos fondo blanco',
              '20 fotos + Retoque avanzado\nBodegón creativo (2)',
              'Catálogo completo 50 fotos\nLifestyle context\nDirección de arte'
            ], { photos: 10 })
          },
          {
            id: 'v-p-lifestyle',
            name: 'Foto Lifestyle',
            description: 'Tu marca en situaciones reales.',
            stats: { brand: 8, conversion: 5, reach: 6 },
            relatedServiceIds: ['b-g-social'],
            tiers: createTiers(300, 1, 'days', [
              'Sesión 2h exterior',
              'Media jornada + Modelo\nLocalización incluida',
              'Jornada completa cine\nLookbook de temporada\nDerechos de uso total'
            ], { photos: 20 })
          }
        ]
      },
      {
        id: 'v-video',
        title: 'Video Ads & Social',
        services: [
          {
            id: 'v-v-social',
            name: 'Reels & TikToks',
            description: 'Contenido vertical viral.',
            stats: { brand: 4, conversion: 6, reach: 10 },
            relatedServiceIds: ['d-p-meta'],
            tiers: createTiers(200, 3, 'days', [
              'Edición de 3 videos',
              'Grabación + Edición 5 videos\nSubtítulos dinámicos',
              'Estrategia mensual 12 videos\nGuionización profesional\nUGC & Hooks'
            ], { videos: 3 })
          }
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital & Growth',
    description: 'Desarrollo web y publicidad',
    subcategories: [
      {
        id: 'd-web',
        title: 'Web Design',
        services: [
          {
            id: 'd-w-landing',
            name: 'Landing Page',
            description: 'Diseñada para convertir.',
            stats: { brand: 3, conversion: 10, reach: 4 },
            relatedServiceIds: ['d-p-meta', 'd-p-google'],
            tiers: createTiers(500, 1, 'weeks', [
              'Diseño One-page básico',
              'Landing persuasiva (Copywriting)\nOptimización de carga',
              'Landing A/B Testing\nEmbudos de venta\nIntegración CRM'
            ])
          },
          {
            id: 'd-w-shop',
            name: 'E-commerce',
            description: 'Tu tienda abierta 24/7.',
            stats: { brand: 7, conversion: 9, reach: 5 },
            relatedServiceIds: ['v-p-product'],
            tiers: createTiers(1200, 4, 'weeks', [
              'Tienda Shopify/Woo base',
              'Diseño a medida (UX/UI)\nPasarela de pagos\nSEO básico',
              'E-commerce avanzado\nAutomatización emails\nGestión de stock'
            ])
          }
        ]
      },
      {
        id: 'd-marketing',
        title: 'Marketing Ads',
        services: [
          {
            id: 'd-p-meta',
            name: 'Meta Ads',
            description: 'Publicidad en FB e Instagram.',
            stats: { brand: 2, conversion: 9, reach: 10 },
            relatedServiceIds: ['v-v-social'],
            tiers: createTiers(300, 2, 'days', [
              'Setup de cuenta y pixel',
              'Gestión mensual (1 campaña)\nCreatividades base',
              'Estrategia de Funnel\nScaling semanal\nReporting avanzado'
            ])
          }
        ]
      }
    ]
  }
];
