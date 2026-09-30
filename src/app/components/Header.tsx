import { Language } from '../App';
import Logo from './Logo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({
  language,
  onLanguageChange
}: HeaderProps) {
  return (
    <div className="bg-black h-[56px] lg:h-[86px] relative shrink-0 w-full">
      {/* Logo - Mobile: Left, Desktop: Left */}
      <div className="absolute h-[40px] left-[16px] lg:left-[48px] overflow-clip top-1/2 translate-y-[-50%] w-[80px]">
        <Logo />
      </div>

      {/* Language Button - Mobile & Desktop: Right */}
      <div className="absolute content-stretch flex gap-[8px] lg:gap-[16px] items-center right-[16px] lg:right-[48px] top-1/2 translate-y-[-50%] z-[1001]">
        {/* Language Selector */}
        <button
          onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
          className="relative rounded-[8px] shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">
              {language === 'ru' ? 'RU' : 'EN'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
