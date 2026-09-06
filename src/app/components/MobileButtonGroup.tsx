import { Language } from '../App';

interface MobileButtonGroupProps {
  currentView: 'quickplay' | 'multiplayer';
  onViewChange: (view: 'quickplay' | 'multiplayer') => void;
  language: Language;
  showTabs?: boolean;
}

export default function MobileButtonGroup({ currentView, onViewChange, language, showTabs = true }: MobileButtonGroupProps) {
  if (!showTabs) return null;
  
  const getTranslation = (lang: Language, key: string) => {
    const translations = {
      quickPlay: lang === 'ru' ? 'Быстрая игра' : 'Quick Play',
      multiplayer: lang === 'ru' ? 'Мультиплеер' : 'Multiplayer',
    };
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <div className="bg-black relative shrink-0 w-full lg:hidden">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative w-full">
          <button
            onClick={() => onViewChange('quickplay')}
            className={`basis-0 ${currentView === 'quickplay' ? 'bg-[#303030]' : ''} grow min-h-px min-w-px relative rounded-[8px] shrink-0 hover:bg-[#303030] transition-colors`}
          >
            <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap ${currentView === 'quickplay' ? 'text-white' : 'text-[#b3b3b3]'} whitespace-pre`}>{getTranslation(language, 'quickPlay')}</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => onViewChange('multiplayer')}
            className={`basis-0 ${currentView === 'multiplayer' ? 'bg-[#303030]' : ''} grow min-h-px min-w-px relative rounded-[8px] shrink-0 hover:bg-[#303030] transition-colors`}
          >
            <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="box-border content-stretch flex gap-[2px] items-center justify-center p-[12px] relative w-full">
                <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap ${currentView === 'multiplayer' ? 'text-white' : 'text-[#b3b3b3]'} whitespace-pre`}>{getTranslation(language, 'multiplayer')}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}