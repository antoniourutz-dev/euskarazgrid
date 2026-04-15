import React from 'react';
import { EuskarazLogo } from './EuskarazLogo';
import { cn } from '@/lib/utils';

interface GridCardProps {
  topText?: string;
  bottomText?: string;
  showLogo?: boolean;
  isBold?: boolean;
  isUnderlined?: boolean;
  underlineLastA?: boolean;
  topFontSize?: number;
  bottomFontSize?: number;
  logoSize?: number;
  className?: string;
}

const TextWithUnderlinedA: React.FC<{ text: string; underlineLastA: boolean }> = ({ text, underlineLastA }) => {
  if (!underlineLastA || !text.endsWith('A')) return <>{text}</>;
  
  const mainPart = text.slice(0, -1);
  const lastChar = text.slice(-1);
  
  return (
    <>
      {mainPart}
      <span className="underline decoration-2 underline-offset-4">{lastChar}</span>
    </>
  );
};

export const GridCard: React.FC<GridCardProps> = ({
  topText = '',
  bottomText = '',
  showLogo = false,
  isBold = true,
  isUnderlined = false,
  underlineLastA = false,
  topFontSize = 24,
  bottomFontSize = 24,
  logoSize,
  className,
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-white text-center overflow-hidden min-w-0 relative",
        className
      )}
      style={{ height: '160px' }}
    >
      {/* Domino central line - thinner as requested */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black -translate-y-1/2 z-10" />

      {showLogo ? (
        <div className="flex h-full w-full flex-col items-center justify-between py-4 gap-1 relative z-20">
          <div 
            className={cn(
              "uppercase leading-none break-words w-full px-1",
              isBold && "font-bold",
              isUnderlined && "underline"
            )}
            style={{ fontSize: `${topFontSize}px` }}
          >
            <TextWithUnderlinedA text={topText} underlineLastA={underlineLastA} />
          </div>
          <div className="flex-shrink-0 flex items-center justify-center bg-white p-1 rounded-full">
            <EuskarazLogo size={logoSize || Math.max(topFontSize, bottomFontSize) * 2.5} />
          </div>
          <div 
            className={cn(
              "uppercase leading-none break-words w-full px-1",
              isBold && "font-bold",
              isUnderlined && "underline"
            )}
            style={{ fontSize: `${bottomFontSize}px` }}
          >
            <TextWithUnderlinedA text={bottomText} underlineLastA={underlineLastA} />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center relative z-20">
          <div 
            className={cn(
              "flex-1 flex items-center justify-center w-full uppercase leading-tight break-words px-1",
              isBold && "font-bold",
              isUnderlined && "underline"
            )}
            style={{ fontSize: `${topFontSize}px` }}
          >
            <TextWithUnderlinedA text={topText} underlineLastA={underlineLastA} />
          </div>
          <div className="flex-1 flex items-center justify-center w-full uppercase leading-tight break-words px-1">
            {/* Empty space for bottom part of domino if no logo */}
          </div>
        </div>
      )}
    </div>
  );
};
