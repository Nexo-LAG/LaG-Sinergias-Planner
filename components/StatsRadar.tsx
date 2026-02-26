import React from 'react';
import { ServiceStats } from '../types';

interface StatsRadarProps {
  stats: ServiceStats;
  potentialStats?: ServiceStats; // New: For "Ghost" projection
}

const StatsRadar: React.FC<StatsRadarProps> = ({ stats, potentialStats }) => {
  // Use a coordinate system 0-100
  const MAX_VAL = 40; 
  const norm = (val: number) => Math.min((val / MAX_VAL) * 100, 100);

  // Expanded layout to fit labels inside viewbox
  // Viewbox will be 120x120 to give margin
  const cx = 60;
  const cy = 65; // Shifted down slightly
  const r = 40; // Max radius

  const getPoints = (s: ServiceStats) => {
    const v1 = norm(s.brand); // Top
    const v2 = norm(s.conversion); // Right
    const v3 = norm(s.reach); // Left

    // Top point
    const x1 = cx;
    const y1 = cy - (r * (v1 / 100));

    // Bottom Right (30 deg)
    const ang2 = 30 * (Math.PI / 180); 
    const x2 = cx + (r * (v2 / 100)) * Math.cos(ang2);
    const y2 = cy + (r * (v2 / 100)) * Math.sin(ang2);

    // Bottom Left (150 deg)
    const ang3 = 150 * (Math.PI / 180);
    const x3 = cx + (r * (v3 / 100)) * Math.cos(ang3);
    const y3 = cy + (r * (v3 / 100)) * Math.sin(ang3);

    return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
  };

  const points = getPoints(stats);
  const ghostPoints = potentialStats ? getPoints(potentialStats) : '';

  // Background Triangle Points (Max value)
  const bgPoints = `60,${cy-r} ${cx + r * Math.cos(30 * Math.PI / 180)},${cy + r * Math.sin(30 * Math.PI / 180)} ${cx + r * Math.cos(150 * Math.PI / 180)},${cy + r * Math.sin(150 * Math.PI / 180)}`;

  return (
    <div className="w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" className="overflow-visible">
            {/* Axis Lines */}
            <line x1={cx} y1={cy} x2={cx} y2={cy-r} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(30*Math.PI/180)} y2={cy + r * Math.sin(30*Math.PI/180)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(150*Math.PI/180)} y2={cy + r * Math.sin(150*Math.PI/180)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2 2" />

            {/* Outer Triangle (Frame) */}
            <polygon points={bgPoints} fill="none" stroke="#d1d5db" strokeWidth="1" />

            {/* Ghost Shape */}
            {potentialStats && (
               <polygon 
                  points={ghostPoints} 
                  fill="none" 
                  stroke="#fbbf24" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 2"
                  className="animate-pulse"
               />
            )}

            {/* Actual Data Shape */}
            <polygon points={points} fill="rgba(205, 32, 39, 0.1)" stroke="#cd2027" strokeWidth="1.5" strokeLinejoin="round" />
            
            {/* Labels - Refined: thinner, smaller, aligned */}
            <text x="60" y="15" textAnchor="middle" fontSize="7" fontWeight="600" fill="#6b7280" className="uppercase font-mono tracking-widest">Brand</text>
            <text x="110" y="100" textAnchor="middle" fontSize="7" fontWeight="600" fill="#6b7280" className="uppercase font-mono tracking-widest">Sale</text>
            <text x="10" y="100" textAnchor="middle" fontSize="7" fontWeight="600" fill="#6b7280" className="uppercase font-mono tracking-widest">Reach</text>
        </svg>
    </div>
  );
};

export default StatsRadar;