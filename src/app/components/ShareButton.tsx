import { useState } from 'react';
import { Language } from '../App';
import { getTranslation } from '../translations';
import type { PreviousGame } from '../utils/previousGames';
import { shareResult } from '../utils/shareResult';

// Share CTA (win screen) or icon-only button (previous games)
export default function ShareButton({ game, language, iconOnly = false }: {
  game: PreviousGame;
  language: Language;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const label = getTranslation(language, copied ? 'linkCopied' : 'share');

  const handleClick = async () => {
    if (await shareResult(game, language) === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        aria-label={label}
        title={label}
        className="bg-[#303030] relative rounded-[8px] shrink-0 size-[40px] lg:size-[32px] flex items-center justify-center hover:bg-[#404040] transition-colors"
      >
        <svg className="size-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          {copied ? (
            <path d="M4.5 10.5L8 14L15.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          ) : (
            <path d="M10 12.5V2.5M10 2.5L6.5 6M10 2.5L13.5 6M4.5 10V16.5H15.5V10" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          )}
        </svg>
        <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
      </button>
    );
  }

  return (
    <button onClick={handleClick} className="bg-neutral-100 relative rounded-[8px] shrink-0 hover:bg-neutral-200 transition-colors">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-[#1e1e1e] text-nowrap whitespace-pre">{label}</p>
      </div>
    </button>
  );
}
