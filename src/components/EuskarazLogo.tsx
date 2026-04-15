import React, { useId } from 'react';

interface EuskarazLogoProps {
  className?: string;
  size?: number;
}

export const EuskarazLogo: React.FC<EuskarazLogoProps> = ({ className, size = 100 }) => {
  const center = size / 2;
  const innerRadius = size * 0.38;
  const pathId = useId();
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Blue Circle - slightly more vibrant blue */}
        <circle cx={center} cy={center} r={size / 2} fill="#003399" />
        
        {/* The 'e' - using a very rounded, bold font stack */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          style={{ 
            fontSize: `${size * 0.8}px`, 
            fontWeight: '900', 
            fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' 
          }}
        >
          e
        </text>
        
        {/* Curved 'euskaraz' text - moved even higher to be right under the 'e' */}
        <defs>
          <path
            id={pathId}
            d={`M ${center - innerRadius},${center + innerRadius * 0.05} A ${innerRadius},${innerRadius} 0 0 0 ${center + innerRadius},${center + innerRadius * 0.05}`}
          />
        </defs>
        <text 
          fill="white" 
          style={{ 
            fontSize: `${size * 0.17}px`, 
            fontWeight: '900', 
            fontFamily: '"Arial Rounded MT Bold", sans-serif',
            textTransform: 'lowercase',
            letterSpacing: '-0.02em'
          }}
        >
          <textPath href={`#${pathId}`} xlinkHref={`#${pathId}`} startOffset="50%" textAnchor="middle">
            euskaraz
          </textPath>
        </text>
      </svg>
    </div>
  );
};
