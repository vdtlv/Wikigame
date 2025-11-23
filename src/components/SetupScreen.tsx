import { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-pvsnj56irt';
import { Language } from '../App';
import { getTranslation, POPULAR_ARTICLES, RECOMMENDED_PROMPTS } from '../translations';

interface SetupScreenProps {
  onStartGame: (start: string, end: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

interface Prompt {
  start: string;
  end: string;
}

function getRandomArticle(language: Language): string {
  const articles = POPULAR_ARTICLES[language];
  return articles[Math.floor(Math.random() * articles.length)];
}

export default function SetupScreen({ onStartGame, language, onLanguageChange }: SetupScreenProps) {
  const [startArticle, setStartArticle] = useState('');
  const [endArticle, setEndArticle] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>(RECOMMENDED_PROMPTS[language]);
  
  // Search functionality
  const [startInputValue, setStartInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const startDropdownRef = useRef<HTMLDivElement>(null);
  const endDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set random articles on mount and language change
    const start = getRandomArticle(language);
    const end = getRandomArticle(language);
    setStartArticle(start);
    setEndArticle(end);
    setStartInputValue(start);
    setEndInputValue(end);
    setPrompts(RECOMMENDED_PROMPTS[language]);
  }, [language]);
  
  // Search Wikipedia API
  const searchWikipedia = async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=8&format=json&origin=*`
      );
      const data = await response.json();
      return data[1] || []; // Returns array of article titles
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  };
  
  // Debounced search for start article
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (startInputValue && startInputValue !== startArticle) {
        setIsSearching(true);
        const results = await searchWikipedia(startInputValue);
        setStartSuggestions(results);
        setShowStartDropdown(results.length > 0);
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [startInputValue, startArticle]);
  
  // Debounced search for end article
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (endInputValue && endInputValue !== endArticle) {
        setIsSearching(true);
        const results = await searchWikipedia(endInputValue);
        setEndSuggestions(results);
        setShowEndDropdown(results.length > 0);
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [endInputValue, endArticle]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startDropdownRef.current &&
        !startDropdownRef.current.contains(event.target as Node) &&
        !startInputRef.current?.contains(event.target as Node)
      ) {
        setShowStartDropdown(false);
      }
      if (
        endDropdownRef.current &&
        !endDropdownRef.current.contains(event.target as Node) &&
        !endInputRef.current?.contains(event.target as Node)
      ) {
        setShowEndDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRandomizeStart = () => {
    const article = getRandomArticle(language);
    setStartArticle(article);
    setStartInputValue(article);
    setShowStartDropdown(false);
  };

  const handleRandomizeEnd = () => {
    const article = getRandomArticle(language);
    setEndArticle(article);
    setEndInputValue(article);
    setShowEndDropdown(false);
  };
  
  const handleSelectStartSuggestion = (suggestion: string) => {
    setStartArticle(suggestion);
    setStartInputValue(suggestion);
    setShowStartDropdown(false);
  };
  
  const handleSelectEndSuggestion = (suggestion: string) => {
    setEndArticle(suggestion);
    setEndInputValue(suggestion);
    setShowEndDropdown(false);
  };

  const handleLaunchGame = () => {
    if (startArticle && endArticle) {
      onStartGame(startArticle, endArticle);
    }
  };

  const handleLaunchPrompt = (prompt: Prompt) => {
    onStartGame(prompt.start, prompt.end);
  };

  return (
    <div className="bg-[rgb(0,0,0)] content-stretch flex flex-col items-center relative size-full">
      {/* Footer (Header in this design) */}
      <div className="bg-black h-[56px] lg:h-[86px] relative shrink-0 w-full">
        {/* Logo */}
        <div className="absolute h-[40px] left-1/2 overflow-clip top-1/2 translate-x-[-50%] translate-y-[-50%] w-[80px]">
          <div className="absolute h-[42.563px] left-[2.68px] top-[-4.9px] w-[66.945px]">
            <div className="absolute bottom-[-2.49%] left-0 right-[-3.31%] top-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 44">
                <g>
                  <path d={svgPaths.p3685ad90} fill="#F5F5F5" />
                  <path d={svgPaths.p80a0e90} fill="#F5F5F5" />
                  <path d={svgPaths.p1cc32dc0} fill="#F5F5F5" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="absolute content-stretch flex gap-[16px] items-center right-[16px] lg:right-[48px] top-1/2 translate-y-[-50%] z-[1001]">
          <div className="bg-neutral-100 relative rounded-[8px] shrink-0 opacity-50 cursor-not-allowed group">
            <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'login')}</p>
            </div>
            <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-[#303030] text-white text-[14px] rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[1002]">
              Wait for updates
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="absolute content-stretch flex gap-[16px] items-center left-[16px] lg:left-[48px] top-1/2 translate-y-[-50%]">
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-nowrap whitespace-pre hidden lg:block">{getTranslation(language, 'language')}</p>
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
              className="bg-[#303030] relative rounded-[8px] shrink-0 hover:bg-[#404040] transition-colors cursor-pointer"
            >
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] lg:p-[12px] relative rounded-[inherit]">
                {/* Mobile: Flag icon only */}
                <div className="relative shrink-0 size-[24px] lg:hidden flex items-center justify-center">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-white text-[12px]">
                    {language === 'ru' ? 'RU' : 'EN'}
                  </span>
                </div>
                {/* Desktop: Text */}
                <p className="hidden lg:block font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                  {language === 'en' ? getTranslation(language, 'languageEnglish') : getTranslation(language, 'languageRussian')}
                </p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black relative w-full">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex flex-col lg:flex-row gap-[10px] lg:gap-[48px] items-center lg:items-start justify-center px-[16px] lg:px-[48px] py-[48px] lg:py-[16px] relative w-full max-w-[1400px]">
            {/* Quick Play Container */}
            <div className="content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full max-w-[328px] lg:max-w-none lg:w-1/2 mx-[0px] my-[32px]">
              <div className="content-stretch flex flex-col gap-[8px] items-center lg:items-start not-italic relative shrink-0 w-full text-center lg:text-left">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">{getTranslation(language, 'quickPlay')}</p>
                <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                  <p className="leading-[1.4]">{getTranslation(language, 'quickPlayDescription')}</p>
                </div>
              </div>

              {/* Article Selector - Vertical on Mobile, Horizontal on Desktop */}
              <div className="content-stretch flex flex-col lg:flex-row gap-[8px] items-start lg:items-center relative shrink-0 w-full">
                {/* Start Article */}
                <div className="relative w-full lg:w-[220px]">
                  <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                    <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] z-0" />
                    <div className="flex flex-row items-center min-w-inherit size-full">
                      <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
                        <input
                          ref={startInputRef}
                          type="text"
                          value={startInputValue}
                          onChange={(e) => {
                            setStartInputValue(e.target.value);
                          }}
                          onFocus={() => {
                            if (startSuggestions.length > 0) {
                              setShowStartDropdown(true);
                            }
                          }}
                          placeholder={getTranslation(language, 'startArticlePlaceholder')}
                          className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white overflow-hidden text-ellipsis bg-transparent border-none outline-none placeholder:text-[#666]"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRandomizeStart();
                          }}
                          className="shrink-0 hover:opacity-70 transition-opacity"
                        >
                          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
                            <path d="M12.6667 2.66667L14.6667 4.66667L12.6667 6.66667M12.6667 9.33333L14.6667 11.3333L12.6667 13.3333M13.3333 4.66667H9.33333C7.86057 4.66667 6.66667 5.86057 6.66667 7.33333V8.66667C6.66667 10.1394 5.47276 11.3333 4 11.3333H1.33333M13.3333 11.3333H9.33333C7.86057 11.3333 6.66667 10.1394 6.66667 8.66667V7.33333C6.66667 5.86057 5.47276 4.66667 4 4.66667H1.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Start Dropdown */}
                  {showStartDropdown && startSuggestions.length > 0 && (
                    <div
                      ref={startDropdownRef}
                      className="absolute top-[48px] left-0 w-full bg-[#1e1e1e] border border-[#444444] rounded-[8px] overflow-hidden z-[100] shadow-lg max-h-[240px] overflow-y-auto"
                    >
                      {startSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectStartSuggestion(suggestion)}
                          className="w-full text-left px-[16px] py-[10px] text-white hover:bg-[#2a2a2a] transition-colors font-['Inter:Regular',sans-serif] text-[14px] border-b border-[#333] last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swap Button - Desktop Only */}
                <button
                  onClick={() => {
                    const tempArticle = startArticle;
                    const tempInput = startInputValue;
                    setStartArticle(endArticle);
                    setStartInputValue(endInputValue);
                    setEndArticle(tempArticle);
                    setEndInputValue(tempInput);
                    setShowStartDropdown(false);
                    setShowEndDropdown(false);
                  }}
                  className="hidden lg:block relative rounded-[8px] shrink-0 hover:opacity-70 transition-opacity"
                >
                  <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[inherit] size-[40px]">
                      <svg className="size-5" fill="none" viewBox="0 0 20 20">
                        <path d="M12.5 4.16667L4.16667 4.16667M4.16667 4.16667L6.66667 1.66667M4.16667 4.16667L6.66667 6.66667M7.5 15.8333H15.8333M15.8333 15.8333L13.3333 13.3333M15.8333 15.8333L13.3333 18.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* End Article */}
                <div className="relative w-full lg:w-[220px]">
                  <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                    <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] z-0" />
                    <div className="flex flex-row items-center min-w-inherit size-full">
                      <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
                        <input
                          ref={endInputRef}
                          type="text"
                          value={endInputValue}
                          onChange={(e) => {
                            setEndInputValue(e.target.value);
                          }}
                          onFocus={() => {
                            if (endSuggestions.length > 0) {
                              setShowEndDropdown(true);
                            }
                          }}
                          placeholder={getTranslation(language, 'endArticlePlaceholder')}
                          className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white overflow-hidden text-ellipsis bg-transparent border-none outline-none placeholder:text-[#666]"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRandomizeEnd();
                          }}
                          className="shrink-0 hover:opacity-70 transition-opacity"
                        >
                          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
                            <path d="M12.6667 2.66667L14.6667 4.66667L12.6667 6.66667M12.6667 9.33333L14.6667 11.3333L12.6667 13.3333M13.3333 4.66667H9.33333C7.86057 4.66667 6.66667 5.86057 6.66667 7.33333V8.66667C6.66667 10.1394 5.47276 11.3333 4 11.3333H1.33333M13.3333 11.3333H9.33333C7.86057 11.3333 6.66667 10.1394 6.66667 8.66667V7.33333C6.66667 5.86057 5.47276 4.66667 4 4.66667H1.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* End Dropdown */}
                  {showEndDropdown && endSuggestions.length > 0 && (
                    <div
                      ref={endDropdownRef}
                      className="absolute top-[48px] left-0 w-full bg-[#1e1e1e] border border-[#444444] rounded-[8px] overflow-hidden z-[100] shadow-lg max-h-[240px] overflow-y-auto"
                    >
                      {endSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectEndSuggestion(suggestion)}
                          className="w-full text-left px-[16px] py-[10px] text-white hover:bg-[#2a2a2a] transition-colors font-['Inter:Regular',sans-serif] text-[14px] border-b border-[#333] last:border-b-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Articles Button - Mobile Only */}
              <button
                onClick={() => {
                  const tempArticle = startArticle;
                  const tempInput = startInputValue;
                  setStartArticle(endArticle);
                  setStartInputValue(endInputValue);
                  setEndArticle(tempArticle);
                  setEndInputValue(tempInput);
                  setShowStartDropdown(false);
                  setShowEndDropdown(false);
                }}
                className="lg:hidden relative rounded-[8px] shrink-0 w-full hover:opacity-70 transition-opacity"
              >
                <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'swapArticles')}</p>
                  </div>
                </div>
              </button>

              {/* Launch Button */}
              <button 
                onClick={handleLaunchGame}
                disabled={!startArticle || !endArticle}
                className="bg-neutral-100 relative rounded-[8px] shrink-0 w-full hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] lg:px-[32px] lg:py-[16px] relative rounded-[inherit]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'launchGame')}</p>
                </div>
                <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
              </button>
            </div>

            {/* Recommended Prompts Container */}
            <div className="content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full max-w-[328px] lg:max-w-none lg:w-auto">
              <div className="content-stretch flex flex-col gap-[8px] items-center lg:items-start not-italic relative shrink-0 w-full text-center lg:text-left">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">{getTranslation(language, 'recommendedPrompts')}</p>
                <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                  <p className="leading-[1.4]">{getTranslation(language, 'recommendedPromptsDescription')}</p>
                </div>
              </div>

              {/* Prompts List */}
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                {prompts.map((prompt, index) => (
                  <div key={index} className="w-full">
                    <div className="content-stretch flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-[16px] lg:gap-0 relative shrink-0 w-full">
                      <div className="content-stretch flex items-center relative shrink-0 w-full lg:w-auto">
                        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white">
                          <p className="leading-[1.4]">{prompt.start} → {prompt.end}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleLaunchPrompt(prompt)}
                        className="bg-[#303030] relative rounded-[8px] shrink-0 w-full lg:w-auto hover:bg-[#404040] transition-colors"
                      >
                        <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] lg:p-[8px] relative rounded-[inherit]">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">{getTranslation(language, 'launch')}</p>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      </button>
                    </div>
                    {index < prompts.length - 1 && (
                      <div className="h-0 relative shrink-0 w-full mt-[16px]">
                        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 587 1">
                            <line stroke="#444444" x2="587" y1="0.5" y2="0.5" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}