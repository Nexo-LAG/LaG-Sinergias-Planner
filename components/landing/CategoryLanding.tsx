import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { landingData, Language } from './data';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '../Header';
import AILanding from './AILanding';

const CategoryLanding: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lang, setLang] = useState<Language>('ESP');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, [slug]);

  // Normalization for the AI category or others
  // If slug is 'ai-services' or starts with 'new-cat' (dynamic ID from admin), map to 'ai-services'
  const normalizedSlug = (slug === 'ai-services' || (slug && slug.startsWith('new-cat'))) ? 'ai-services' : slug;
  
  // Special case for AI Services Landing
  if (normalizedSlug === 'ai-services') {
      return (
          <>
            <Header />
            <AILanding />
          </>
      );
  }

  const content = normalizedSlug && landingData[normalizedSlug] ? landingData[normalizedSlug][lang] : null;

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-mono mb-4">404</h1>
          <p className="font-mono text-gray-400 mb-8">Category not found</p>
          <Link to="/" className="text-white border-b border-white pb-1 hover:opacity-70 transition-opacity">
            Return to Planner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white font-sans transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      {/* Language Selector (Floating) */}
      <div className="fixed top-8 right-8 z-40 flex items-center gap-4 mix-blend-difference">
          {(['ESP', 'CAT', 'ENG'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-[10px] font-bold font-mono uppercase tracking-widest transition-colors ${
                lang === l ? 'text-white border-b border-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {l}
            </button>
          ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] ${
                normalizedSlug === 'branding' ? 'bg-blue-600' :
                normalizedSlug === 'visual' ? 'bg-purple-600' :
                normalizedSlug === 'digital' ? 'bg-green-600' : 'bg-red-600'
            }`} />
            <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] ${
                normalizedSlug === 'branding' ? 'bg-cyan-400' :
                normalizedSlug === 'visual' ? 'bg-pink-400' :
                normalizedSlug === 'digital' ? 'bg-emerald-400' : 'bg-orange-400'
            }`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-sm md:text-base font-mono text-gray-400 mb-6 uppercase tracking-[0.3em] animate-pulse">
            {content.subtitle}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
            {content.title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            {content.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {content.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                <Check className="w-4 h-4 text-white" />
                <span className="text-xs font-mono uppercase tracking-wider">{feature}</span>
              </div>
            ))}
          </div>

          <Link 
            to="/" 
            className="inline-block px-10 py-4 bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors hover:scale-105 transform duration-300"
          >
            {content.cta}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CategoryLanding;
