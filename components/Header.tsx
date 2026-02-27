import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-32" />

      {/* Floating Notch / Dynamic Island */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
        <div 
          className={`
            pointer-events-auto
            bg-black text-white
            transition-all duration-300 ease-out
            relative
            ${expanded ? 'w-[95vw] max-w-3xl p-8' : 'w-[340px] h-[50px] flex items-center justify-between px-6'}
            ${scrolled && !expanded ? 'translate-y-0' : 'translate-y-2'}
          `}
          style={{
            clipPath: expanded 
              ? 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
              : 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
          }}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          {/* Collapsed State Content */}
          <div className={`flex items-center justify-between w-full ${expanded ? 'hidden' : 'flex'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#cd2027] animate-pulse" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }} />
              <span className="font-mono text-xs font-bold tracking-widest uppercase">La Grieta</span>
            </div>
            <div className="flex gap-1 opacity-50">
               <div className="w-1 h-1 bg-white" />
               <div className="w-1 h-1 bg-white" />
               <div className="w-1 h-1 bg-white" />
            </div>
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Menu</span>
          </div>

          {/* Expanded State Content */}
          <div className={`w-full flex flex-col gap-8 ${expanded ? 'opacity-100 delay-75' : 'opacity-0 hidden'}`}>
            
            {/* Top Row: Brand & Status */}
            <div className="flex justify-between items-start border-b border-white/20 pb-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-[#cd2027] flex items-center justify-center" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                        <span className="font-black text-[10px] italic">LG</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase leading-none italic">La Grieta</h1>
                </div>
                <p className="text-[9px] font-mono text-gray-400 tracking-[0.2em] uppercase">Synergy Planner v2.0</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-[#cd2027] rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 px-1">System Online</span>
                </div>
                <p className="text-xs font-black uppercase tracking-tight">Planner & Consultant</p>
              </div>
            </div>

            {/* Navigation Grid */}
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/category/ai-services" className="group relative p-4 border border-white/10 hover:border-[#cd2027] hover:bg-white/5 transition-all duration-300" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[9px] font-mono text-gray-500 mb-2 group-hover:text-[#cd2027]">01</div>
                <div className="font-black text-sm uppercase tracking-tight leading-tight">AI Agents<br/>& Services</div>
              </Link>
              
              <Link to="/category/branding" className="group relative p-4 border border-white/10 hover:border-[#cd2027] hover:bg-white/5 transition-all duration-300" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[9px] font-mono text-gray-500 mb-2 group-hover:text-[#cd2027]">02</div>
                <div className="font-black text-sm uppercase tracking-tight leading-tight">Branding<br/>& Design</div>
              </Link>
              
              <Link to="/category/visual" className="group relative p-4 border border-white/10 hover:border-[#cd2027] hover:bg-white/5 transition-all duration-300" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[9px] font-mono text-gray-500 mb-2 group-hover:text-[#cd2027]">03</div>
                <div className="font-black text-sm uppercase tracking-tight leading-tight">Visual<br/>Content</div>
              </Link>
              
              <Link to="/category/digital" className="group relative p-4 border border-white/10 hover:border-[#cd2027] hover:bg-white/5 transition-all duration-300" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                <div className="text-[9px] font-mono text-gray-500 mb-2 group-hover:text-[#cd2027]">04</div>
                <div className="font-black text-sm uppercase tracking-tight leading-tight">Digital<br/>& Growth</div>
              </Link>
            </nav>

            {/* Bottom Row: Ticker */}
            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
               <div className="overflow-hidden w-full relative h-4 mask-linear-fade">
                 <div className="absolute whitespace-nowrap animate-marquee text-[9px] font-mono text-gray-400 tracking-widest uppercase will-change-transform">
                    ESTIMACIÓN EN TIEMPO REAL /// SINERGIAS ACTIVAS /// DESCUENTOS POR VOLUMEN /// PROTOCOLO PORTFOLIO DISPONIBLE /// 1€ = 100 B1T$! /// AI POWERED CONSULTANCY ///
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-block;
          min-width: 200%;
        }
        .mask-linear-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </>
  );
};

export default Header;