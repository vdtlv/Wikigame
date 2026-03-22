import { useState, useEffect, useRef } from 'react';
import { Language } from '../App';
import { getTranslation } from '../translations';

interface LaunchScreenProps {
  onComplete: () => void;
  onLeave: () => void;
  language: Language;
  goalArticle: string;
  articleReady?: boolean;
}

export default function LaunchScreen({ onComplete, onLeave, language, goalArticle, articleReady = true }: LaunchScreenProps) {
  const [countdown, setCountdown] = useState(3);
  const countdownDone = useRef(false);

  // Fast countdown: 500ms per tick (3 → 2 → 1 → done in 1.5s)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      countdownDone.current = true;
    }
  }, [countdown]);

  // Complete when both countdown is done AND article is ready
  useEffect(() => {
    if (countdownDone.current && articleReady) {
      onComplete();
    }
  }, [countdown, articleReady, onComplete]);

  // Determine what to display
  const displayText = countdown > 0
    ? undefined // show number
    : !articleReady
      ? getTranslation(language, 'loading')
      : undefined;

  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full">
      {/* Container */}
      <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col items-center justify-between px-[16px] py-[136px] relative size-full">
            {/* Frame with countdown and goal */}
            <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
              {/* Countdown Circle */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 rounded-[101.5px] size-[200px]" />
                {countdown > 0 ? (
                  <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold leading-[1.2] ml-[76px] mt-[57px] not-italic relative text-[72px] text-black text-nowrap tracking-[-2.16px] whitespace-pre">
                    {countdown}
                  </p>
                ) : (
                  <div className="[grid-area:1_/_1] flex items-center justify-center size-[200px]">
                    <div className="size-[40px] border-4 border-black/20 border-t-black rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Status text */}
              <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-center justify-center relative shrink-0 w-[268px]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                  {displayText || getTranslation(language, 'loading')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center justify-center pb-[16px] pt-0 px-[48px] relative w-full">
            {/* Leave Button */}
            <button 
              onClick={onLeave}
              className="bg-[#303030] relative rounded-[8px] shrink-0 hover:bg-[#404040] transition-colors"
            >
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                  {getTranslation(language, 'leave')}
                </p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
