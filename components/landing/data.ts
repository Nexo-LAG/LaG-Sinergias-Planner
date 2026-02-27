export type Language = 'ESP' | 'CAT' | 'ENG';

export interface LandingContent {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  cta: string;
}

export const landingData: Record<string, Record<Language, LandingContent>> = {
  'branding': {
    'ESP': {
      title: 'Branding & Design',
      subtitle: 'Identidad que deja huella',
      description: 'Forjamos la identidad de tu marca con estrategia y diseño atemporal. Desde el naming hasta el manual de marca, creamos universos visuales que perduran y comunican tus valores con claridad y elegancia.',
      features: ['Estrategia de Marca', 'Identidad Visual', 'Naming', 'Diseño Editorial'],
      cta: 'Empezar Proyecto'
    },
    'CAT': {
      title: 'Branding & Disseny',
      subtitle: 'Identitat que deixa empremta',
      description: 'Forgem la identitat de la teva marca amb estratègia i disseny atemporal. Des del naming fins al manual de marca, creem universos visuals que perduren i comuniquen els teus valors amb claredat i elegància.',
      features: ['Estratègia de Marca', 'Identitat Visual', 'Naming', 'Disseny Editorial'],
      cta: 'Començar Projecte'
    },
    'ENG': {
      title: 'Branding & Design',
      subtitle: 'Identity that leaves a mark',
      description: 'We forge your brand\'s identity with strategy and timeless design. From naming to brand guidelines, we create visual universes that endure and communicate your values with clarity and elegance.',
      features: ['Brand Strategy', 'Visual Identity', 'Naming', 'Editorial Design'],
      cta: 'Start Project'
    }
  },
  'visual': {
    'ESP': {
      title: 'Visual Content',
      subtitle: 'Narrativa visual de alto impacto',
      description: 'Producción audiovisual que eleva tu marca. Fotografía y video diseñados para narrar historias, conectar emocionalmente con tu audiencia y destacar en un entorno digital saturado.',
      features: ['Fotografía de Producto', 'Video Publicitario', 'Contenido Social', 'Dirección de Arte'],
      cta: 'Ver Portfolio'
    },
    'CAT': {
      title: 'Contingut Visual',
      subtitle: 'Narrativa visual d\'alt impacte',
      description: 'Producció audiovisual que eleva la teva marca. Fotografia i vídeo dissenyats per narrar històries, connectar emocionalment amb la teva audiència i destacar en un entorn digital saturat.',
      features: ['Fotografia de Producte', 'Vídeo Publicitari', 'Contingut Social', 'Direcció d\'Art'],
      cta: 'Veure Portfoli'
    },
    'ENG': {
      title: 'Visual Content',
      subtitle: 'High-impact visual storytelling',
      description: 'Audiovisual production that elevates your brand. Photography and video designed to tell stories, connect emotionally with your audience, and stand out in a saturated digital environment.',
      features: ['Product Photography', 'Advertising Video', 'Social Content', 'Art Direction'],
      cta: 'View Portfolio'
    }
  },
  'digital': {
    'ESP': {
      title: 'Digital & Growth',
      subtitle: 'Crecimiento escalable y medible',
      description: 'Impulsamos tu presencia digital con tecnología y estrategia. Desarrollo web, e-commerce y campañas de marketing orientadas a resultados, conversión y retorno de inversión.',
      features: ['Desarrollo Web', 'E-commerce', 'SEO/SEM', 'Growth Hacking'],
      cta: 'Impulsar Negocio'
    },
    'CAT': {
      title: 'Digital & Growth',
      subtitle: 'Creixement escalable i mesurable',
      description: 'Impulsem la teva presència digital amb tecnologia i estratègia. Desenvolupament web, e-commerce i campanyes de màrqueting orientades a resultats, conversió i retorn d\'inversió.',
      features: ['Desenvolupament Web', 'E-commerce', 'SEO/SEM', 'Growth Hacking'],
      cta: 'Impulsar Negoci'
    },
    'ENG': {
      title: 'Digital & Growth',
      subtitle: 'Scalable and measurable growth',
      description: 'We boost your digital presence with technology and strategy. Web development, e-commerce, and marketing campaigns oriented towards results, conversion, and return on investment.',
      features: ['Web Development', 'E-commerce', 'SEO/SEM', 'Growth Hacking'],
      cta: 'Boost Business'
    }
  },
  'ai-services': {
    'ESP': {
      title: 'AI Services',
      subtitle: 'El futuro de tu negocio, hoy',
      description: 'Inteligencia Artificial aplicada para optimizar y automatizar. Soluciones innovadoras que transforman datos en decisiones y procesos en eficiencia pura.',
      features: ['Automatización', 'Análisis Predictivo', 'Chatbots Inteligentes', 'Integración de IA'],
      cta: 'Innovar Ahora'
    },
    'CAT': {
      title: 'Serveis IA',
      subtitle: 'El futur del teu negoci, avui',
      description: 'Intel·ligència Artificial aplicada per optimitzar i automatitzar. Solucions innovadores que transformen dades en decisions i processos en eficiència pura.',
      features: ['Automatització', 'Anàlisi Predictiva', 'Chatbots Intel·ligents', 'Integració d\'IA'],
      cta: 'Innovar Ara'
    },
    'ENG': {
      title: 'AI Services',
      subtitle: 'The future of your business, today',
      description: 'Artificial Intelligence applied to optimize and automate. Innovative solutions that transform data into decisions and processes into pure efficiency.',
      features: ['Automation', 'Predictive Analysis', 'Smart Chatbots', 'AI Integration'],
      cta: 'Innovate Now'
    }
  }
};
