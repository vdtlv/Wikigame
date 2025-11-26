import { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-incp3x46ra';
import Logo from './Logo';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { POPULAR_ARTICLES } from '../translations';

interface PartyLobbyScreenProps {
  language: Language;
  user: User;
  partyUid: string;
  accessCode: string;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  onLaunchGame: (start: string, end: string) => void;
  onLeave: () => void;
}

interface PartyMember {
  userId: string;
  nickname: string;
}

interface GameHistory {
  startArticle: string;
  endArticle: string;
  completedAt: string;
  results: any[];
}

function getRandomArticle(language: Language): string {
  const articles = POPULAR_ARTICLES[language];
  return articles[Math.floor(Math.random() * articles.length)];
}

export default function PartyLobbyScreen({
  language,
  user,
  partyUid,
  accessCode,
  onLanguageChange,
  onBack,
  onLaunchGame,
  onLeave,
}: PartyLobbyScreenProps) {
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [creatorId, setCreatorId] = useState('');
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [startArticle, setStartArticle] = useState('');
  const [endArticle, setEndArticle] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  // Dropdown and validation state
  const [startInputValue, setStartInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isStartValid, setIsStartValid] = useState(true);
  const [isEndValid, setIsEndValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [startErrorMessage, setStartErrorMessage] = useState('');
  const [endErrorMessage, setEndErrorMessage] = useState('');
  const [sameArticleError, setSameArticleError] = useState(false);
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const startDropdownRef = useRef<HTMLDivElement>(null);
  const endDropdownRef = useRef<HTMLDivElement>(null);

  const isHost = user.id === creatorId;

  // Initialize with random articles
  useEffect(() => {
    if (isHost) {
      const start = getRandomArticle(language);
      let end = getRandomArticle(language);
      
      while (end === start && POPULAR_ARTICLES[language].length > 1) {
        end = getRandomArticle(language);
      }
      
      setStartArticle(start);
      setEndArticle(end);
      setStartInputValue(start);
      setEndInputValue(end);
    }
  }, [language, isHost]);

  // Search Wikipedia API
  const searchWikipedia = async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=8&format=json&origin=*`
      );
      const data = await response.json();
      return data[1] || [];
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  };
  
  // Validate if article exists on Wikipedia
  const validateArticle = async (articleName: string): Promise<boolean> => {
    if (!articleName) return false;
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=parse&page=${encodeURIComponent(articleName)}&format=json&origin=*&prop=text`
      );
      const data = await response.json();
      
      if (data.error) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Article validation error:', error);
      return false;
    }
  };
  
  // Validate start article when it changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!startInputValue) {
        setIsStartValid(true);
        setStartErrorMessage('');
        setStartArticle('');
        return;
      }
      
      if (startArticle && startArticle === startInputValue) {
        setIsValidating(true);
        const isValid = await validateArticle(startArticle);
        setIsStartValid(isValid);
        setStartErrorMessage(isValid ? '' : language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsValidating(false);
      } else if (startInputValue && startInputValue !== startArticle) {
        if (!showStartDropdown) {
          setIsValidating(true);
          const isValid = await validateArticle(startInputValue);
          if (isValid) {
            setStartArticle(startInputValue);
            setIsStartValid(true);
            setStartErrorMessage('');
          } else {
            setIsStartValid(false);
            setStartErrorMessage(language === 'ru' ? 'Статья не найдена. Выберите из выпадающего списка' : 'Article not found. Please select from dropdown');
          }
          setIsValidating(false);
        }
      }
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, [startArticle, startInputValue, showStartDropdown, language]);
  
  // Validate end article when it changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!endInputValue) {
        setIsEndValid(true);
        setEndErrorMessage('');
        setEndArticle('');
        return;
      }
      
      if (endArticle && endArticle === endInputValue) {
        setIsValidating(true);
        const isValid = await validateArticle(endArticle);
        setIsEndValid(isValid);
        setEndErrorMessage(isValid ? '' : language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsValidating(false);
      } else if (endInputValue && endInputValue !== endArticle) {
        if (!showEndDropdown) {
          setIsValidating(true);
          const isValid = await validateArticle(endInputValue);
          if (isValid) {
            setEndArticle(endInputValue);
            setIsEndValid(true);
            setEndErrorMessage('');
          } else {
            setIsEndValid(false);
            setEndErrorMessage(language === 'ru' ? 'Статья не найдена. Выберите из выпадающего списка' : 'Article not found. Please select from dropdown');
          }
          setIsValidating(false);
        }
      }
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, [endArticle, endInputValue, showEndDropdown, language]);
  
  // Check if articles are the same
  useEffect(() => {
    if (startArticle && endArticle && startArticle.toLowerCase() === endArticle.toLowerCase()) {
      setSameArticleError(true);
    } else {
      setSameArticleError(false);
    }
  }, [startArticle, endArticle]);
  
  // Search for start article suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (startInputValue && startInputValue.length >= 2) {
        setIsSearching(true);
        const results = await searchWikipedia(startInputValue);
        setStartSuggestions(results);
        setShowStartDropdown(results.length > 0);
        setIsSearching(false);
      } else {
        setStartSuggestions([]);
        setShowStartDropdown(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [startInputValue, language]);
  
  // Search for end article suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (endInputValue && endInputValue.length >= 2) {
        setIsSearching(true);
        const results = await searchWikipedia(endInputValue);
        setEndSuggestions(results);
        setShowEndDropdown(results.length > 0);
        setIsSearching(false);
      } else {
        setEndSuggestions([]);
        setShowEndDropdown(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [endInputValue, language]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startDropdownRef.current && !startDropdownRef.current.contains(event.target as Node) &&
          startInputRef.current && !startInputRef.current.contains(event.target as Node)) {
        setShowStartDropdown(false);
      }
      if (endDropdownRef.current && !endDropdownRef.current.contains(event.target as Node) &&
          endInputRef.current && !endInputRef.current.contains(event.target as Node)) {
        setShowEndDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll for party updates
  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/${partyUid}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const party = await response.json();
          setCreatorId(party.creatorId);
          setGameHistory(party.gameHistory || []);
          
          // Fetch member nicknames
          const memberProfiles = await Promise.all(
            party.members.map(async (userId: string) => {
              const profileResponse = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/user-profile/${userId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${publicAnonKey}`,
                  },
                }
              );
              
              if (profileResponse.ok) {
                const profile = await profileResponse.json();
                return { userId, nickname: profile.nickname };
              }
              return { userId, nickname: 'Unknown' };
            })
          );
          
          setMembers(memberProfiles);
        }
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    fetchPartyDetails();
    const interval = setInterval(fetchPartyDetails, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [partyUid]);

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
  };

  const shuffleStartArticle = () => {
    const newArticle = getRandomArticle(language);
    setStartArticle(newArticle);
    setStartInputValue(newArticle);
  };

  const shuffleEndArticle = () => {
    const newArticle = getRandomArticle(language);
    setEndArticle(newArticle);
    setEndInputValue(newArticle);
  };

  const swapArticles = () => {
    const tempArticle = startArticle;
    const tempInput = startInputValue;
    setStartArticle(endArticle);
    setStartInputValue(endInputValue);
    setEndArticle(tempArticle);
    setEndInputValue(tempInput);
  };
  
  const handleStartInputChange = (value: string) => {
    setStartInputValue(value);
  };
  
  const handleEndInputChange = (value: string) => {
    setEndInputValue(value);
  };
  
  const selectStartArticle = (article: string) => {
    setStartArticle(article);
    setStartInputValue(article);
    setShowStartDropdown(false);
  };
  
  const selectEndArticle = (article: string) => {
    setEndArticle(article);
    setEndInputValue(article);
    setShowEndDropdown(false);
  };

  const handleReady = async () => {
    if (isHost) {
      // Host is ready to launch the game
      if (!startArticle || !endArticle || !isStartValid || !isEndValid || sameArticleError) {
        return;
      }
      
      // TODO: Update party with selected articles and launch game
      setIsReady(true);
      
      // Call onLaunchGame with the articles
      // This should trigger the game to start
      
      onLaunchGame(startArticle, endArticle);
    } else {
      // Player is ready
      setIsReady(true);
      // TODO: Notify server that player is ready
    }
  };

  return (
    <div className="bg-black content-stretch flex flex-col items-center relative size-full">
      {/* Header */}
      <div className="bg-black h-[56px] relative shrink-0 w-full">
        <div className="absolute h-[40px] left-[16px] top-1/2 translate-y-[-50%] w-[80px]">
          <Logo />
        </div>
        <div className="absolute content-stretch flex gap-[8px] items-center right-[16px] top-1/2 translate-y-[-50%]">
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
            className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">
              {language === 'ru' ? 'RU' : 'EN'}
            </p>
          </button>
          <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0">
            <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
              <svg className="relative shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p205c98f0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[32px]" />
          </div>
        </div>
      </div>

      {/* Host Article Selection OR Player Waiting */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
              {isHost ? (
                <>
                  {/* Text Content Heading */}
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                      <p className="leading-[1.4]">
                        {language === 'ru' ? 'Выберите две статьи и запустите игру' : 'Select two articles and launch a game'}
                      </p>
                    </div>
                  </div>

                  {/* Input Container */}
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                    {/* Start Article Selector */}
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="relative w-full">
                          <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                            <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                              <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                                <input
                                  type="text"
                                  value={startInputValue}
                                  onChange={(e) => handleStartInputChange(e.target.value)}
                                  placeholder={language === 'ru' ? 'Начальная статья' : 'Start Article'}
                                  className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                                  ref={startInputRef}
                                />
                                <button onClick={shuffleStartArticle} className="ml-2">
                                  <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p18962d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                          </div>
                          
                          {/* Start Article Dropdown */}
                          {showStartDropdown && startSuggestions.length > 0 && (
                            <div
                              ref={startDropdownRef}
                              className="absolute bg-[#1e1e1e] border border-[#444444] rounded-[8px] mt-1 w-full z-50 max-h-[200px] overflow-y-auto"
                            >
                              {startSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectStartArticle(suggestion)}
                                  className="w-full text-left px-[16px] py-[12px] hover:bg-[#2a2a2a] font-['Inter:Regular',sans-serif] text-[16px] text-white"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* Start Article Error */}
                          {!isStartValid && startErrorMessage && (
                            <p className="text-[#dc2626] text-[14px] mt-1 font-['Inter:Regular',sans-serif]">
                              {startErrorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* End Article Selector */}
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="relative w-full">
                          <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                            <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                              <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                                <input
                                  type="text"
                                  value={endInputValue}
                                  onChange={(e) => handleEndInputChange(e.target.value)}
                                  placeholder={language === 'ru' ? 'Конечная статья' : 'End Article'}
                                  className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                                  ref={endInputRef}
                                />
                                <button onClick={shuffleEndArticle} className="ml-2">
                                  <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p18962d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                          </div>
                          
                          {/* End Article Dropdown */}
                          {showEndDropdown && endSuggestions.length > 0 && (
                            <div
                              ref={endDropdownRef}
                              className="absolute bg-[#1e1e1e] border border-[#444444] rounded-[8px] mt-1 w-full z-50 max-h-[200px] overflow-y-auto"
                            >
                              {endSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => selectEndArticle(suggestion)}
                                  className="w-full text-left px-[16px] py-[12px] hover:bg-[#2a2a2a] font-['Inter:Regular',sans-serif] text-[16px] text-white"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* End Article Error */}
                          {!isEndValid && endErrorMessage && (
                            <p className="text-[#dc2626] text-[14px] mt-1 font-['Inter:Regular',sans-serif]">
                              {endErrorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Same Article Error */}
                    {sameArticleError && (
                      <p className="text-[#dc2626] text-[14px] font-['Inter:Regular',sans-serif] w-full text-center">
                        {language === 'ru' ? 'Начальная и конечная статьи должны быть разными' : 'Start and end articles must be different'}
                      </p>
                    )}

                    {/* Swap Articles Button */}
                    <button
                      onClick={swapArticles}
                      className="relative rounded-[8px] shrink-0 w-full"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">
                            {language === 'ru' ? 'Поменять местами' : 'Swap articles'}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* I am ready Button */}
                  <button
                    onClick={handleReady}
                    disabled={!startArticle || !endArticle || !isStartValid || !isEndValid || sameArticleError || isReady}
                    className="bg-neutral-100 relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                        {language === 'ru' ? 'Я готов' : 'I am ready'}
                      </p>
                    </div>
                    <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </button>
                </>
              ) : (
                <>
                  {/* Player waiting view */}
                  <div className="box-border content-stretch flex flex-col gap-[16px] items-center px-0 py-[48px] relative shrink-0">
                    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[328px]">
                      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
                        <p className="leading-[1.4]">
                          {language === 'ru' ? 'Хост запускает игру' : 'Host is launching a game'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleReady}
                      disabled={isReady}
                      className="bg-neutral-100 relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                          {language === 'ru' ? 'Я готов' : 'I am ready'}
                        </p>
                      </div>
                      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </button>
                  </div>
                </>
              )}

              {/* Divider Line */}
              <div className="h-0 relative shrink-0 w-full">
                <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
                    <line stroke="#444444" x2="328" y1="0.5" y2="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Code Container */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                  <p className="leading-[1.4]">
                    {language === 'ru' ? 'Поделитесь этим кодом с друзьями' : 'Share this code with your friends'}
                  </p>
                </div>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[24px] text-center text-nowrap text-white tracking-[-0.48px] whitespace-pre">
                    {accessCode}
                  </p>
                  <button
                    onClick={copyAccessCode}
                    className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[32px] shrink-0"
                  >
                    <svg className="relative shrink-0 size-[20px]" fill="none" viewBox="0 0 20 20">
                      <g clipPath="url(#clip0_48_4215)">
                        <path d={svgPaths.p1fdd4880} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </g>
                      <defs>
                        <clipPath id="clip0_48_4215">
                          <rect fill="white" height="20" width="20" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Players */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
              <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                    {language === 'ru' ? 'Подключённые игроки' : 'Connected players'}
                  </p>
                </div>
              </div>
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap w-full"
                >
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                    <div className="flex flex-col justify-center relative shrink-0 text-white">
                      <p className="leading-[1.4] text-nowrap whitespace-pre">{member.nickname}</p>
                    </div>
                    {member.userId === user.id && (
                      <div className="flex flex-col justify-center relative shrink-0 text-[#b2b2b2]">
                        <p className="leading-[1.4] text-nowrap whitespace-pre">{language === 'ru' ? 'Вы' : 'You'}</p>
                      </div>
                    )}
                  </div>
                  {member.userId === creatorId && (
                    <div className="flex flex-col justify-center relative shrink-0 text-white">
                      <p className="leading-[1.4] text-nowrap whitespace-pre">{language === 'ru' ? 'Хост' : 'Host'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Played Games */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
              <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full">
                <div className="content-stretch flex items-start relative shrink-0 w-full">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                    {language === 'ru' ? 'Сыгранные игры' : 'Played games'}
                  </p>
                </div>
              </div>
              {gameHistory.length > 0 ? (
                gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="content-stretch flex items-center relative shrink-0 w-full"
                  >
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                      {game.startArticle} → {game.endArticle}
                    </p>
                  </div>
                ))
              ) : (
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre opacity-50">
                    {language === 'ru' ? 'Пока нет сыгранных игр' : 'No games played yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black relative shrink-0 w-full mt-auto">
        <div className="flex flex-col justify-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-center pb-[16px] pt-[8px] px-[16px] relative w-full">
            <button
              onClick={onBack}
              className="bg-[#303030] relative rounded-[8px] shrink-0 w-full"
            >
              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                    {language === 'ru' ? 'Назад' : 'Go back'}
                  </p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}