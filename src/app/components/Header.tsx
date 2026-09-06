import { Language, User } from '../App';
import Logo from './Logo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
  currentView: 'quickplay' | 'multiplayer';
  onViewChange: (view: 'quickplay' | 'multiplayer') => void;
  showTabs?: boolean;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  setShowMobileProfileMenu: (show: boolean) => void;
  onShowAuth: () => void;
}

export default function Header({ 
  language, 
  onLanguageChange, 
  user, 
  onLogout,
  currentView,
  onViewChange,
  showTabs = true,
  showProfileMenu,
  setShowProfileMenu,
  setShowMobileProfileMenu,
  onShowAuth
}: HeaderProps) {
  const getTranslation = (lang: Language, key: string) => {
    const translations = {
      quickPlay: lang === 'ru' ? 'Быстрая игра' : 'Quick Play',
      multiplayer: lang === 'ru' ? 'Мультиплеер' : 'Multiplayer',
      logout: lang === 'ru' ? 'Выйти' : 'Log out',
      login: lang === 'ru' ? 'Войти' : 'Login',
    };
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <div className="bg-black h-[56px] lg:h-[86px] relative shrink-0 w-full">
      {/* Logo - Mobile: Left, Desktop: Left */}
      <div className="absolute h-[40px] left-[16px] lg:left-[48px] overflow-clip top-1/2 translate-y-[-50%] w-[80px]">
        <Logo />
      </div>

      {/* Tab Buttons - Desktop Only Center */}
      {showTabs && (
        <div className="hidden lg:flex absolute box-border content-stretch gap-[16px] items-center left-[calc(50%-0.5px)] px-[12px] py-0 top-[23px] translate-x-[-50%]">
          <button
            onClick={() => onViewChange('quickplay')}
            className={`${currentView === 'quickplay' ? 'bg-[#303030]' : ''} box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0 hover:bg-[#303030] transition-colors cursor-pointer`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap ${currentView === 'quickplay' ? 'text-white' : 'text-[#e3e3e3]'} whitespace-pre`}>{getTranslation(language, 'quickPlay')}</p>
          </button>
          <button
            onClick={() => onViewChange('multiplayer')}
            className={`${currentView === 'multiplayer' ? 'bg-[#303030]' : ''} box-border content-stretch flex gap-[2px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 hover:bg-[#303030] transition-colors cursor-pointer`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap ${currentView === 'multiplayer' ? 'text-white' : 'text-[#b3b3b3]'} whitespace-pre`}>{getTranslation(language, 'multiplayer')}</p>
          </button>
        </div>
      )}

      {/* Language & Profile Buttons - Mobile & Desktop: Right */}
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
        
        {/* Profile/Login Buttons */}
        {user && (
          <>
            {/* Profile Button - Mobile */}
            <button
              onClick={() => setShowMobileProfileMenu(true)}
              className="lg:hidden bg-[#2c2c2c] relative rounded-[32px] shrink-0 hover:bg-[#3c3c3c] transition-colors"
            >
              <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20">
                  <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 10 9.16667C8.15905 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15905 2.5 10 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                </svg>
              </div>
              <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[32px]"/>
            </button>
            
            {/* Profile Button - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-[#2c2c2c] relative rounded-[32px] shrink-0 hover:bg-[#3c3c3c] transition-colors"
              >
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                  <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20">
                    <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 10 9.16667C8.15905 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15905 2.5 10 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[32px]"/>
              </button>
              
              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute bg-[#1e1e1e] right-0 top-[calc(100%+8px)] rounded-[8px] w-[221px] z-[1003]">
                  <div className="box-border content-stretch flex flex-col items-start overflow-clip p-[8px] relative rounded-[inherit] w-[221px]">
                    {/* Menu Header */}
                    <div className="relative shrink-0 w-full">
                      <div className="overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex flex-col items-start leading-[1.4] not-italic pb-[4px] pt-[2px] px-[8px] relative w-full">
                          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white w-full">@{user.nickname}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Separator */}
                    <div className="box-border content-stretch flex flex-col items-center justify-center px-0 py-[8px] relative shrink-0 w-full">
                      <div className="bg-[#444444] h-px shrink-0 w-full" />
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="relative rounded-[8px] shrink-0 w-full hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex flex-col items-start p-[8px] relative w-full">
                          <div className="box-border content-stretch flex gap-[12px] items-start overflow-clip px-0 py-[4px] relative rounded-[8px] shrink-0 w-full">
                            <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
                              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">{getTranslation(language, 'logout')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" />
                </div>
              )}
            </div>
          </>
        )}
        {!user && (
          <button
            onClick={onShowAuth}
            className="relative rounded-[8px] shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">
                {getTranslation(language, 'login')}
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}