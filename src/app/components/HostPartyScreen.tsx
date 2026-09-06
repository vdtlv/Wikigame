import { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-rdva3xwwqn';
import Logo from './Logo';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { POPULAR_ARTICLES } from '../translations';

interface HostPartyScreenProps {
  language: Language;
  user: User;
  partyUid: string;
  accessCode: string;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  onReady: (startArticle: string, endArticle: string) => void;
}

interface PartyMember {
  userId: string;
  nickname: string;
}

function getRandomArticle(language: Language): string {
  const articles = POPULAR_ARTICLES[language];
  return articles[Math.floor(Math.random() * articles.length)];
}

export default function HostPartyScreen({
  language,
  user,
  partyUid,
  accessCode,
  onLanguageChange,
  onBack,
  onReady,
}: HostPartyScreenProps) {
  const [startArticle, setStartArticle] = useState('');
  const [endArticle, setEndArticle] = useState('');
  const [startInputValue, setStartInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Validation state
  const [isStartValid, setIsStartValid] = useState(true);
  const [isEndValid, setIsEndValid] = useState(true);
  const [startErrorMessage, setStartErrorMessage] = useState('');
  const [endErrorMessage, setEndErrorMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Autocomplete state
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs for dropdowns
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const startDropdownRef = useRef<HTMLDivElement>(null);
  const endDropdownRef = useRef<HTMLDivElement>(null);

  // Check if article is a redirect
  const checkRedirect = async (articleName: string): Promise<{ isRedirect: boolean, target?: string }> => {
    if (!articleName) return { isRedirect: false };
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=query&titles=${encodeURIComponent(articleName)}&redirects&format=json&origin=*`
      );
      const data = await response.json();
      
      if (data.query && data.query.redirects) {
        return { isRedirect: true, target: data.query.redirects[0].to };
      }
      
      return { isRedirect: false };
    } catch (error) {
      console.error('Redirect check error:', error);
      return { isRedirect: false };
    }
  };

  // Search Wikipedia for articles
  const searchWikipedia = async (query: string): Promise<string[]> => {
    if (!query) return [];
    
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
  
  // Validate if article exists on Wikipedia
  const validateArticle = async (articleName: string): Promise<boolean> => {
    if (!articleName) return false;
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=parse&page=${encodeURIComponent(articleName)}&format=json&origin=*&prop=text`
      );
      const data = await response.json();
      
      // If there's an error, the article doesn't exist
      if (data.error) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

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
    const interval = setInterval(fetchPartyDetails, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [partyUid]);

  // Initialize with random articles
  useEffect(() => {
    const start = getRandomArticle(language);
    const end = getRandomArticle(language);
    setStartArticle(start);
    setEndArticle(end);
    setStartInputValue(start);
    setEndInputValue(end);
  }, [language]);

  const handleRandomizeStart = () => {
    const article = getRandomArticle(language);
    setStartArticle(article);
    setStartInputValue(article);
  };

  const handleRandomizeEnd = () => {
    const article = getRandomArticle(language);
    setEndArticle(article);
    setEndInputValue(article);
  };

  const handleSwapArticles = () => {
    const tempArticle = startArticle;
    const tempInput = startInputValue;
    setStartArticle(endArticle);
    setStartInputValue(endInputValue);
    setEndArticle(tempArticle);
    setEndInputValue(tempInput);
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
    // Could add a toast notification here
  };

  const handleReady = async () => {
    if (!startArticle || !endArticle) return;

    setIsUpdating(true);

    try {
      // Update party with selected articles
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/${partyUid}/articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
            startArticle,
            endArticle,
          }),
        }
      );

      if (response.ok) {
        onReady(startArticle, endArticle);
      }
    } catch (error) {
      console.error('Error updating party articles:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle input change for start article
  const handleStartInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInputValue(value);
    setStartArticle(value);

    if (value) {
      setIsSearching(true);
      const suggestions = await searchWikipedia(value);
      setStartSuggestions(suggestions);
      setShowStartDropdown(true);
      setIsSearching(false);
    } else {
      setStartSuggestions([]);
      setShowStartDropdown(false);
    }
  };

  // Handle input change for end article
  const handleEndInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInputValue(value);
    setEndArticle(value);

    if (value) {
      setIsSearching(true);
      const suggestions = await searchWikipedia(value);
      setEndSuggestions(suggestions);
      setShowEndDropdown(true);
      setIsSearching(false);
    } else {
      setEndSuggestions([]);
      setShowEndDropdown(false);
    }
  };

  // Handle suggestion click for start article
  const handleStartSuggestionClick = (suggestion: string) => {
    setStartInputValue(suggestion);
    setStartArticle(suggestion);
    setStartSuggestions([]);
    setShowStartDropdown(false);
  };

  // Handle suggestion click for end article
  const handleEndSuggestionClick = (suggestion: string) => {
    setEndInputValue(suggestion);
    setEndArticle(suggestion);
    setEndSuggestions([]);
    setShowEndDropdown(false);
  };

  // Validate articles
  const validateArticles = async () => {
    setIsValidating(true);
    setStartErrorMessage('');
    setEndErrorMessage('');

    const startRedirect = await checkRedirect(startArticle);
    const endRedirect = await checkRedirect(endArticle);

    if (startRedirect.isRedirect) {
      setStartArticle(startRedirect.target || '');
      setStartInputValue(startRedirect.target || '');
    }

    if (endRedirect.isRedirect) {
      setEndArticle(endRedirect.target || '');
      setEndInputValue(endRedirect.target || '');
    }

    const startExists = await validateArticle(startArticle);
    const endExists = await validateArticle(endArticle);

    if (!startExists) {
      setIsStartValid(false);
      setStartErrorMessage(language === 'ru' ? 'Статья не существует' : 'Article does not exist');
    } else {
      setIsStartValid(true);
    }

    if (!endExists) {
      setIsEndValid(false);
      setEndErrorMessage(language === 'ru' ? 'Статья не существует' : 'Article does not exist');
    } else {
      setIsEndValid(true);
    }

    setIsValidating(false);
  };

  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full">
      {/* Article Selection Container */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                  <p className="leading-[1.4]">
                    {language === 'ru' ? 'Выберите две статьи и запустите игру' : 'Select two articles and launch a game'}
                  </p>
                </div>
              </div>

              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
                {/* Start Article */}
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[328px]">
                  <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                    <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                      <div className="flex flex-row items-center min-w-inherit size-full">
                        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
                          <input
                            type="text"
                            value={startInputValue}
                            onChange={handleStartInputChange}
                            placeholder={language === 'ru' ? 'Начальная статья' : 'Start Article'}
                            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[#666]"
                          />
                          {startInputValue && (
                            <button onClick={() => {
                              setStartInputValue('');
                              setStartArticle('');
                            }}>
                              <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                                <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          )}
                          <button onClick={handleRandomizeStart}>
                            <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                              <path d={svgPaths.p18962d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* End Article */}
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[328px]">
                  <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                    <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                      <div className="flex flex-row items-center min-w-inherit size-full">
                        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
                          <input
                            type="text"
                            value={endInputValue}
                            onChange={handleEndInputChange}
                            placeholder={language === 'ru' ? 'Конечая статья' : 'End Article'}
                            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[#666]"
                          />
                          {endInputValue && (
                            <button onClick={() => {
                              setEndInputValue('');
                              setEndArticle('');
                            }}>
                              <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                                <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          )}
                          <button onClick={handleRandomizeEnd}>
                            <svg className="relative shrink-0 size-[16px]" fill="none" viewBox="0 0 16 16">
                              <path d={svgPaths.p18962d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapArticles}
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

              <button
                onClick={handleReady}
                disabled={isUpdating || !startArticle || !endArticle || !isStartValid || !isEndValid}
                className="bg-neutral-100 relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                    {isUpdating ? (language === 'ru' ? 'Загрузка...' : 'Loading...') : (language === 'ru' ? 'Я готов' : 'I am ready')}
                  </p>
                </div>
                <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
              </button>

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

      {/* Access Code Container */}
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
                      <g clipPath="url(#clip0_48_3379)">
                        <path d={svgPaths.p3a92e900} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </g>
                      <defs>
                        <clipPath id="clip0_48_3379">
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
              {members.map((member, index) => (
                <div
                  key={member.userId}
                  className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap w-full"
                >
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[187px]">
                    <div className="flex flex-col justify-center relative shrink-0 text-white">
                      <p className="leading-[1.4] text-nowrap whitespace-pre">{member.nickname}</p>
                    </div>
                    {member.userId === user.id && (
                      <div className="flex flex-col justify-center relative shrink-0 text-[#b2b2b2]">
                        <p className="leading-[1.4] text-nowrap whitespace-pre">{language === 'ru' ? 'Вы' : 'You'}</p>
                      </div>
                    )}
                  </div>
                  {index === 0 && (
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