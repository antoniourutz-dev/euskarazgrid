import React from 'react';
import { cn } from '@/lib/utils';
import { EuskarazLogo } from './EuskarazLogo';

interface BackCardProps {
  text1: string;
  text2: string;
  text3: string;
  fontSize: number;
  className?: string;
}

export const BackCard: React.FC<BackCardProps> = ({
  text1,
  text2,
  text3,
  fontSize,
  className,
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-white text-center overflow-hidden min-w-0 relative p-4",
        className
      )}
      style={{ height: '160px' }}
    >
      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <div 
          className="font-bold uppercase leading-tight break-words w-full"
          style={{ fontSize: `${fontSize}px` }}
        >
          {text1}
        </div>
        <div 
          className="font-bold uppercase leading-tight break-words w-full"
          style={{ fontSize: `${fontSize}px` }}
        >
          {text2}
        </div>
        <div 
          className="font-bold uppercase leading-tight break-words w-full"
          style={{ fontSize: `${fontSize}px` }}
        >
          {text3}
        </div>
        <div className="mt-2">
          <EuskarazLogo size={fontSize * 2.5} className="flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
