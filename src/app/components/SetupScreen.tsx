import { useState, useEffect, useRef } from 'react';
import svgPaths from '../imports/svg-pvsnj56irt';
import svgPathsNew from '../imports/svg-lrf4eee7ov';
import Logo from './Logo';
import { Language, User } from '../App';
import { getTranslation, POPULAR_ARTICLES, RECOMMENDED_PROMPTS } from '../translations';
import MultiplayerScreen from './MultiplayerScreen';
import HostPartyScreen from './HostPartyScreen';
import HostLaunchScreen from './HostLaunchScreen';
import PlayerPartyScreen from './PlayerPartyScreen';
import PlayerLaunchScreen from './PlayerLaunchScreen';
import Header from './Header';
import MobileButtonGroup from './MobileButtonGroup';

interface SetupScreenProps {
  onStartGame: (start: string, end: string, partyUid?: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: User | null;
  onShowAuth: () => void;
  onShowNickname?: () => void;
  onLogout: () => void;
  onJoinPartyLobby?: (partyUid: string, accessCode: string) => void;
  initialView?: 'quickplay' | 'multiplayer';
  onNavigateToMultiplayer?: () => void;
  onNavigateToHome?: () => void;
}

interface Prompt {
  start: string;
  end: string;
}

interface Party {
  partyUid: string;
  accessCode: string;
  createDate: string;
  creatorId: string;
  startArticle: string | null;
  endArticle: string | null;
  language: string;
  status: string;
  members: string[];
}

type MultiplayerStep = 'selection' | 'host-setup' | 'host-launch' | 'player-party' | 'player-waiting';

function getRandomArticle(language: Language): string {
  const articles = POPULAR_ARTICLES[language];
  return articles[Math.floor(Math.random() * articles.length)];
}

export default function SetupScreen({ onStartGame, language, onLanguageChange, user, onShowAuth, onShowNickname, onLogout, onJoinPartyLobby, initialView, onNavigateToMultiplayer, onNavigateToHome }: SetupScreenProps) {
  const [startArticle, setStartArticle] = useState('');
  const [endArticle, setEndArticle] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>(RECOMMENDED_PROMPTS[language]);
  
  // View state
  const [currentView, setCurrentView] = useState<'quickplay' | 'multiplayer'>(initialView || 'quickplay');

  // Sync currentView with initialView prop when it changes (e.g. hash navigation)
  useEffect(() => {
    setCurrentView(initialView || 'quickplay');
  }, [initialView]);
  
  // Multiplayer state
  const [multiplayerStep, setMultiplayerStep] = useState<MultiplayerStep>('selection');
  const [currentParty, setCurrentParty] = useState<Party | null>(null);
  const [partyStartArticle, setPartyStartArticle] = useState('');
  const [partyEndArticle, setPartyEndArticle] = useState('');
  
  // Search functionality
  const [startInputValue, setStartInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Validation state
  const [isStartValid, setIsStartValid] = useState(true);
  const [isEndValid, setIsEndValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [startErrorMessage, setStartErrorMessage] = useState('');
  const [endErrorMessage, setEndErrorMessage] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [sameArticleError, setSameArticleError] = useState(false);
  
  // Tooltip state
  const [showMultiplayerTooltipDesktop, setShowMultiplayerTooltipDesktop] = useState(false);
  const [showMultiplayerTooltipMobile, setShowMultiplayerTooltipMobile] = useState(false);
  
  // Profile menu state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const startDropdownRef = useRef<HTMLDivElement>(null);
  const endDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set random articles on mount and language change
    const start = getRandomArticle(language);
    let end = getRandomArticle(language);
    
    // Ensure start and end are different
    while (end === start && POPULAR_ARTICLES[language].length > 1) {
      end = getRandomArticle(language);
    }
    
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
      console.error('Article validation error:', error);
      return false;
    }
  };
  
  // Check if article is a redirect and get the actual article
  const checkRedirect = async (articleName: string): Promise<{ isRedirect: boolean; target?: string }> => {
    if (!articleName) return { isRedirect: false };
    
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    
    try {
      const response = await fetch(
        `https://${wikiDomain}/w/api.php?action=query&titles=${encodeURIComponent(articleName)}&format=json&origin=*&redirects=1`
      );
      const data = await response.json();
      
      // Check if there were redirects
      if (data.query && data.query.redirects && data.query.redirects.length > 0) {
        return { 
          isRedirect: true, 
          target: data.query.redirects[0].to 
        };
      }
      
      return { isRedirect: false };
    } catch (error) {
      console.error('Redirect check error:', error);
      return { isRedirect: false };
    }
  };
  
  // Validate start article when it changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!startInputValue) {
        // Empty input
        setIsStartValid(true);
        setStartErrorMessage('');
        setStartArticle('');
        return;
      }
      
      if (startArticle && startArticle === startInputValue) {
        // Input matches selected article - validate it
        setIsValidating(true);
        const isValid = await validateArticle(startArticle);
        setIsStartValid(isValid);
        setStartErrorMessage(isValid ? '' : language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsValidating(false);
      } else if (startInputValue && startInputValue !== startArticle) {
        // User typed something but hasn't selected from dropdown
        // Wait a bit to see if they're still typing or if dropdown is showing
        if (!showStartDropdown) {
          // No dropdown showing, validate what they typed
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
        // Empty input
        setIsEndValid(true);
        setEndErrorMessage('');
        setEndArticle('');
        return;
      }
      
      if (endArticle && endArticle === endInputValue) {
        // Input matches selected article - validate it
        setIsValidating(true);
        const isValid = await validateArticle(endArticle);
        setIsEndValid(isValid);
        setEndErrorMessage(isValid ? '' : language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsValidating(false);
      } else if (endInputValue && endInputValue !== endArticle) {
        // User typed something but hasn't selected from dropdown
        // Wait a bit to see if they're still typing or if dropdown is showing
        if (!showEndDropdown) {
          // No dropdown showing, validate what they typed
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
  
  // Debounced search for start article
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (startInputValue && startInputValue !== startArticle) {
        setIsSearching(true);
        const results = await searchWikipedia(startInputValue);
        
        // Filter out redirects and invalid articles
        const validatedResults = await Promise.all(
          results.map(async (result) => {
            const redirectInfo = await checkRedirect(result);
            // Only include non-redirect articles
            if (redirectInfo.isRedirect) {
              return null;
            }
            const isValid = await validateArticle(result);
            return isValid ? result : null;
          })
        );
        
        // Filter out null values (invalid articles and redirects)
        const validResults = validatedResults.filter((result): result is string => result !== null);
        
        setStartSuggestions(validResults);
        setShowStartDropdown(validResults.length > 0);
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
        
        // Filter out redirects and invalid articles
        const validatedResults = await Promise.all(
          results.map(async (result) => {
            const redirectInfo = await checkRedirect(result);
            // Only include non-redirect articles
            if (redirectInfo.isRedirect) {
              return null;
            }
            const isValid = await validateArticle(result);
            return isValid ? result : null;
          })
        );
        
        // Filter out null values (invalid articles and redirects)
        const validResults = validatedResults.filter((result): result is string => result !== null);
        
        setEndSuggestions(validResults);
        setShowEndDropdown(validResults.length > 0);
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

  // Check if start and end articles are the same
  useEffect(() => {
    if (startArticle && endArticle && startArticle === endArticle) {
      setSameArticleError(true);
    } else {
      setSameArticleError(false);
    }
  }, [startArticle, endArticle]);

  const handleRandomizeStart = () => {
    let article = getRandomArticle(language);
    // Ensure we don't pick the same article as end
    while (article === endArticle && POPULAR_ARTICLES[language].length > 1) {
      article = getRandomArticle(language);
    }
    setStartArticle(article);
    setStartInputValue(article);
    setShowStartDropdown(false);
  };

  const handleRandomizeEnd = () => {
    let article = getRandomArticle(language);
    // Ensure we don't pick the same article as start
    while (article === startArticle && POPULAR_ARTICLES[language].length > 1) {
      article = getRandomArticle(language);
    }
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

  const handleLaunchGame = async () => {
    if (!startArticle || !endArticle) return;
    
    // Show loading state
    setIsLaunching(true);
    
    try {
      // Final validation before launching
      const startValid = await validateArticle(startArticle);
      const endValid = await validateArticle(endArticle);
      
      if (!startValid) {
        setIsStartValid(false);
        setStartErrorMessage(language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsLaunching(false);
        return;
      }
      
      if (!endValid) {
        setIsEndValid(false);
        setEndErrorMessage(language === 'ru' ? 'Статья не найдена в выбранной Википедии' : 'Article not found in selected Wikipedia');
        setIsLaunching(false);
        return;
      }
      
      // Both articles are valid, launch the game
      onStartGame(startArticle, endArticle);
    } catch (error) {
      console.error('Validation error:', error);
      setIsLaunching(false);
    }
  };

  const handleLaunchPrompt = (prompt: Prompt) => {
    onStartGame(prompt.start, prompt.end);
  };

  // Multiplayer handlers
  const handleCreateParty = (party: Party) => {
    // Navigate directly to lobby route
    if (onJoinPartyLobby) {
      onJoinPartyLobby(party.partyUid, party.accessCode);
    } else {
      // Fallback to old behavior
      setCurrentParty(party);
      setMultiplayerStep('host-setup');
    }
  };

  const handleJoinParty = (party: Party) => {
    // Navigate directly to lobby route
    if (onJoinPartyLobby) {
      onJoinPartyLobby(party.partyUid, party.accessCode);
    } else {
      // Fallback to old behavior
      setCurrentParty(party);
      setMultiplayerStep('player-party');
    }
  };

  const handleHostReady = (start: string, end: string) => {
    setPartyStartArticle(start);
    setPartyEndArticle(end);
    setMultiplayerStep('host-launch');
  };

  const handleHostLaunch = () => {
    if (currentParty) {
      onStartGame(partyStartArticle, partyEndArticle, currentParty.partyUid);
    }
  };

  const handleBackToMultiplayerSelection = () => {
    setMultiplayerStep('selection');
    setCurrentParty(null);
  };

  // Render multiplayer content based on step
  const renderMultiplayerContent = () => {
    if (!user) {
      return (
        <MultiplayerScreen
          language={language}
          user={user}
          onLanguageChange={onLanguageChange}
          onShowAuth={onShowAuth}
          onShowNickname={onShowNickname || (() => {})}
          onBack={() => setCurrentView('quickplay')}
          onCreateParty={handleCreateParty}
          onJoinParty={handleJoinParty}
        />
      );
    }

    switch (multiplayerStep) {
      case 'host-setup':
        return currentParty ? (
          <HostPartyScreen
            language={language}
            user={user}
            partyUid={currentParty.partyUid}
            accessCode={currentParty.accessCode}
            onLanguageChange={onLanguageChange}
            onBack={handleBackToMultiplayerSelection}
            onReady={handleHostReady}
          />
        ) : null;

      case 'host-launch':
        return currentParty ? (
          <HostLaunchScreen
            language={language}
            user={user}
            partyUid={currentParty.partyUid}
            startArticle={partyStartArticle}
            endArticle={partyEndArticle}
            onBack={() => setMultiplayerStep('host-setup')}
            onLaunch={handleHostLaunch}
          />
        ) : null;

      case 'player-party':
        return currentParty ? (
          <PlayerPartyScreen
            language={language}
            user={user}
            partyUid={currentParty.partyUid}
            accessCode={currentParty.accessCode}
            onLanguageChange={onLanguageChange}
            onBack={handleBackToMultiplayerSelection}
            onReady={() => setMultiplayerStep('player-waiting')}
            onLeave={handleBackToMultiplayerSelection}
          />
        ) : null;

      case 'player-waiting':
        return currentParty ? (
          <PlayerLaunchScreen
            language={language}
            user={user}
            partyUid={currentParty.partyUid}
            onLeave={handleBackToMultiplayerSelection}
            onGameStarted={(start, end) => onStartGame(start, end, currentParty.partyUid)}
          />
        ) : null;

      case 'selection':
      default:
        return (
          <MultiplayerScreen
            language={language}
            user={user}
            onLanguageChange={onLanguageChange}
            onShowAuth={onShowAuth}
            onShowNickname={onShowNickname || (() => {})}
            onBack={() => setCurrentView('quickplay')}
            onCreateParty={handleCreateParty}
            onJoinParty={handleJoinParty}
          />
        );
    }
  };

  // Hide header/tabs when in host party setup or launch screens
  const showHeaderTabs = currentView === 'quickplay' || multiplayerStep === 'selection';

  return (
    <div className="bg-[rgb(0,0,0)] content-stretch flex flex-col items-center relative size-full">
      {/* Mobile Profile Menu Overlay */}
      {showMobileProfileMenu && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-[1004]"
          onClick={() => setShowMobileProfileMenu(false)}
        >
          {/* Profile Menu - Bottom Left */}
          <div 
            className="absolute bg-[#1e1e1e] bottom-[24px] left-[24px] rounded-[8px] w-[312px] z-[1005]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="box-border content-stretch flex flex-col items-start overflow-clip px-[16px] py-[8px] relative rounded-[inherit] w-[312px]">
              {/* Menu Header */}
              <div className="relative shrink-0 w-full">
                <div className="overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex flex-col items-start leading-[1.4] not-italic p-[8px] relative w-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white w-[264px]">{user?.nickname || 'User'}</p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] w-[min-content]">{user?.email || ''}</p>
                  </div>
                </div>
              </div>
              
              {/* Separator */}
              <div className="box-border content-stretch flex flex-col items-center justify-center px-0 py-[8px] relative shrink-0 w-full">
                <div className="bg-[#444444] h-px shrink-0 w-full" />
              </div>
              
              {/* Logout Button */}
              <div className="relative rounded-[8px] shrink-0 w-full">
                <div className="overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex flex-col items-start p-[8px] relative w-full">
                    <button
                      onClick={() => {
                        setShowMobileProfileMenu(false);
                        onLogout();
                      }}
                      className="box-border content-stretch flex gap-[12px] items-start overflow-clip px-0 py-[4px] relative rounded-[8px] shrink-0 w-full hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">{language === 'ru' ? 'Выйти' : 'Log out'}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" />
          </div>
        </div>
      )}
      
      {/* Header */}
      <Header
        language={language}
        user={user}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'quickplay' && onNavigateToHome) {
            onNavigateToHome();
          } else if (view === 'multiplayer' && onNavigateToMultiplayer) {
            onNavigateToMultiplayer();
          } else {
            setCurrentView(view);
          }
        }}
        showTabs={showHeaderTabs}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        setShowMobileProfileMenu={setShowMobileProfileMenu}
        onShowAuth={onShowAuth}
      />
      
      {/* Mobile Button Group */}
      <MobileButtonGroup
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'quickplay' && onNavigateToHome) {
            onNavigateToHome();
          } else if (view === 'multiplayer' && onNavigateToMultiplayer) {
            onNavigateToMultiplayer();
          } else {
            setCurrentView(view);
          }
        }}
        language={language}
        showTabs={showHeaderTabs}
      />

      {/* Main Content - Conditional Rendering */}
      {showHeaderTabs && currentView === 'quickplay' ? (
        <div className="bg-black relative w-full">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="box-border content-stretch flex flex-col lg:flex-row gap-[10px] lg:gap-[32px] items-start justify-center lg:px-[48px] lg:py-[16px] relative w-full px-[48px] py-[0px]">
              {/* Quick Play Container */}
              <div className="basis-0 lg:grow content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full lg:min-w-0 px-[0px] py-[32px]">
                <div className="content-stretch flex flex-col gap-[8px] items-center lg:items-start not-italic relative shrink-0 w-full text-center lg:text-left">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">{getTranslation(language, 'quickPlay')}</p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">{getTranslation(language, 'quickPlayDescription')}</p>
                  </div>
                </div>

                {/* Article Selector - Vertical on Mobile, Horizontal on Desktop */}
                <div className="content-stretch flex flex-col lg:flex-row gap-[8px] items-start relative shrink-0 w-full">
                  {/* Start Article */}
                  <div className="relative w-full lg:w-[220px]">
                    <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                      <div aria-hidden="true" className={`absolute border ${!isStartValid && startArticle ? 'border-[#dc2626]' : 'border-[#444444]'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] z-0`} />
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
                              <path d="M12.6667 2.66667L14.6667 4.66667L12.6667 6.66667M12.6667 9.33333L14.6667 11.3333L12.6667 13.3333M13.3333 4.66667H9.33333C7.86057 4.66667 6.66667 5.86057 6.66667 7.33333V8.66667C6.66667 10.1394 5.47276 11.3333 4 11.3333H1.33333M13.3333 11.3333H9.33333C7.86057 11.3333 6.66667 10.1394 6.66667 8.66667V7.33333C6.66667 5.86057 5.47276 4.66667 4 4.66667H1.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Validation Error Message */}
                    {!isStartValid && startInputValue && (
                      <p className="text-[#dc2626] text-[12px] mt-1 font-['Inter:Regular',sans-serif]">
                        {startErrorMessage}
                      </p>
                    )}
                    
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
                      <div aria-hidden="true" className={`absolute border ${!isEndValid && endArticle ? 'border-[#dc2626]' : 'border-[#444444]'} border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] z-0`} />
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
                    
                    {/* Validation Error Message */}
                    {!isEndValid && endInputValue && (
                      <p className="text-[#dc2626] text-[12px] mt-1 font-['Inter:Regular',sans-serif]">
                        {endErrorMessage}
                      </p>
                    )}
                    
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
                    <div className="box-border content-stretch flex gap-[8px] items-center justify-center relative w-full p-[12px] px-[12px] py-[0px] mx-[0px] my-[-12px]">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'swapArticles')}</p>
                    </div>
                  </div>
                </button>

                {/* Same Article Error Message */}
                {sameArticleError && (
                  <div className="w-full">
                    <p className="text-[#dc2626] text-[14px] text-center lg:text-left font-['Inter:Regular',sans-serif]">
                      {language === 'ru' ? 'Начальная и конечная статьи должны различаться' : 'Start and goal articles must be different'}
                    </p>
                  </div>
                )}

                {/* Launch Button */}
                <button 
                  onClick={handleLaunchGame}
                  disabled={!startArticle || !endArticle || !isStartValid || !isEndValid || isLaunching || sameArticleError}
                  className="bg-neutral-100 relative rounded-[8px] shrink-0 w-full hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] lg:px-[32px] lg:py-[16px] relative rounded-[inherit]">
                    {isLaunching && (
                      <svg className="animate-spin h-4 w-4 text-[#1e1e1e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                      {isLaunching ? (language === 'ru' ? 'Проверка...' : 'Validating...') : getTranslation(language, 'launchGame')}
                    </p>
                  </div>
                  <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
                </button>
              </div>

              {/* Recommended Prompts Container */}
              <div className="basis-0 lg:grow content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full lg:min-w-0 px-[0px] py-[32px]">
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
      ) : (
        renderMultiplayerContent()
      )}
    </div>
  );
}