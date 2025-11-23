import { useState, useEffect, useRef } from 'react';
import { Language } from '../App';
import { getTranslation } from '../translations';
import LaunchScreen from './LaunchScreen';
import WinScreen from './WinScreen';

interface GameScreenProps {
  startArticle: string;
  endArticle: string;
  onWin: () => void;
  onGiveUp: () => void;
  language: Language;
}

export default function GameScreen({ startArticle, endArticle, onWin, onGiveUp, language }: GameScreenProps) {
  const [currentPage, setCurrentPage] = useState(startArticle);
  const [linksClicked, setLinksClicked] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [articleContent, setArticleContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [navigationPath, setNavigationPath] = useState<string[]>([startArticle]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTimeRef = useRef(Date.now());
  const visitCounterRef = useRef(0);

  // Fetch Wikipedia article content
  const fetchArticle = async (articleName: string) => {
    setLoading(true);
    try {
      const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
      // Use MediaWiki API with action=parse for full article content
      const url = `https://${wikiDomain}/w/api.php?action=parse&page=${encodeURIComponent(articleName)}&format=json&origin=*&prop=text`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Article not found');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.info || 'Article not found');
      }
      
      const htmlContent = data.parse.text['*'];
      
      // Create a temporary DOM element to parse and modify the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Remove scripts and potentially harmful elements
      tempDiv.querySelectorAll('script, noscript, style').forEach(el => el.remove());
      
      // Remove navigation elements and edit buttons
      tempDiv.querySelectorAll('[role="navigation"], .mw-footer, #mw-navigation, .mw-editsection, .navbox, .mw-jump-link').forEach(el => el.remove());
      
      // Fix relative links to absolute Wikipedia links
      const wikiPrefix = `https://${wikiDomain}`;
      tempDiv.querySelectorAll('a[href^="./"]').forEach(el => {
        const href = el.getAttribute('href');
        if (href) {
          el.setAttribute('href', wikiPrefix + '/wiki/' + href.substring(2));
        }
      });
      
      tempDiv.querySelectorAll('a[href^="/wiki/"]').forEach(el => {
        const href = el.getAttribute('href');
        if (href) {
          el.setAttribute('href', wikiPrefix + href);
        }
      });
      
      // Remove anchor links
      tempDiv.querySelectorAll('a[href^="#"]').forEach(el => {
        el.removeAttribute('href');
        el.style.cursor = 'text';
        el.style.color = 'inherit';
        el.style.textDecoration = 'none';
      });
      
      // Fix image sources
      tempDiv.querySelectorAll('img[src^="//"]').forEach(el => {
        const src = el.getAttribute('src');
        if (src) {
          el.setAttribute('src', 'https:' + src);
        }
      });
      
      // Fix protocol-relative URLs in srcset
      tempDiv.querySelectorAll('img[srcset]').forEach(el => {
        const srcset = el.getAttribute('srcset');
        if (srcset) {
          el.setAttribute('srcset', srcset.replace(/\/\//g, 'https://'));
        }
      });
      
      // Fix lazy loading images (data-src attributes)
      tempDiv.querySelectorAll('img[data-src]').forEach(el => {
        const dataSrc = el.getAttribute('data-src');
        if (dataSrc) {
          const fullSrc = dataSrc.startsWith('//') ? 'https:' + dataSrc : dataSrc;
          el.setAttribute('src', fullSrc);
          el.removeAttribute('data-src');
        }
      });
      
      // Fix relative image paths
      tempDiv.querySelectorAll('img[src^="/"]').forEach(el => {
        const src = el.getAttribute('src');
        if (src && !src.startsWith('//')) {
          el.setAttribute('src', `https://${wikiDomain}` + src);
        }
      });
      
      // Create a complete HTML document
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Lato, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #202122;
              padding: 16px;
              margin: 0;
              background: white;
            }
            a {
              color: #0645ad;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .mw-parser-output > h2 {
              margin-top: 1em;
              border-bottom: 1px solid #a2a9b1;
              padding-bottom: 0.25em;
            }
            table {
              border-collapse: collapse;
              margin: 1em 0;
            }
            table td, table th {
              border: 1px solid #a2a9b1;
              padding: 0.5em;
            }
            .infobox {
              border: 1px solid #a2a9b1;
              background-color: #f8f9fa;
              float: right;
              margin: 0 0 1em 1em;
              padding: 0.5em;
              width: 22em;
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
          <script>
            document.addEventListener('click', function(e) {
              console.log('🖱️ Click detected in iframe:', e.target);
              const link = e.target.closest('a');
              if (link) {
                console.log('✅ Link clicked:', link.href);
              }
              if (link && link.href && link.href.includes('/wiki/')) {
                console.log('📝 Wikipedia link detected:', link.href);
                e.preventDefault();
                const urlParts = link.href.split('/wiki/');
                if (urlParts[1]) {
                  const articleName = decodeURIComponent(urlParts[1].split('#')[0].split('?')[0].replace(/_/g, ' '));
                  console.log('✉️ Posting message to parent with article:', articleName);
                  window.parent.postMessage({
                    type: 'wikipediaLinkClick',
                    articleName: articleName
                  }, '*');
                }
              } else if (link) {
                console.log('❌ Link is not a Wikipedia article link (skipped)');
              }
            });
          </script>
        </body>
        </html>
      `;
      
      setArticleContent(fullHtml);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setArticleContent('<html><body><div style="padding: 32px; text-align: center; color: #dc2626;">Failed to load article. Please try again.</div></body></html>');
      setLoading(false);
    }
  };

  // Load initial article
  useEffect(() => {
    visitCounterRef.current = 0;
    const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
    console.log('🎮 Game started! Start article:', startArticle);
    console.log(`${visitCounterRef.current}: https://${wikiDomain}/wiki/${encodeURIComponent(startArticle.replace(/ /g, '_'))}`);
    fetchArticle(startArticle);
  }, [startArticle, language]);

  // Handle link clicks in iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'wikipediaLinkClick') {
        const articleName = event.data.articleName;
        
        // Skip special pages
        if (articleName.startsWith('Special:') || articleName.startsWith('File:') || 
            articleName.startsWith('Help:') || articleName.startsWith('Wikipedia:') ||
            articleName.startsWith('Category:') || articleName.startsWith('Talk:') ||
            articleName.startsWith('Template:') || articleName.startsWith('Portal:') ||
            articleName.startsWith('Служебная:') || articleName.startsWith('Файл:') ||
            articleName.startsWith('Справка:') || articleName.startsWith('Википедия:') ||
            articleName.startsWith('Категория:') || articleName.startsWith('Обсуждение:') ||
            articleName.startsWith('Шаблон:') || articleName.startsWith('Портал:')) {
          return;
        }
        
        // Increment counter and log
        visitCounterRef.current++;
        setLinksClicked(prev => prev + 1);
        
        const wikiDomain = language === 'ru' ? 'ru.wikipedia.org' : 'en.wikipedia.org';
        const fullUrl = `https://${wikiDomain}/wiki/${encodeURIComponent(articleName.replace(/ /g, '_'))}`;
        
        console.log('🖱️ Link clicked! Count:', visitCounterRef.current, '| Navigated to:', articleName);
        console.log(`${visitCounterRef.current}: ${fullUrl}`);
        console.log('📊 Display count:', visitCounterRef.current);
        
        // Add to navigation path
        setNavigationPath(prev => [...prev, articleName]);
        
        // Update current page and fetch new article
        setCurrentPage(articleName);
        fetchArticle(articleName);
        
        // Check if goal reached
        if (articleName.toLowerCase() === endArticle.toLowerCase()) {
          console.log('🎉 Goal reached!');
          setShowWinDialog(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [currentPage, endArticle, language, onWin]);

  // Timer effect
  useEffect(() => {
    // Only start the timer when the launch screen is hidden and game hasn't been won
    if (!showLaunchScreen && !showWinDialog) {
      // Reset start time when game actually begins
      startTimeRef.current = Date.now();
      
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1);

      return () => clearInterval(interval);
    }
  }, [showLaunchScreen, showWinDialog]);

  const formatTime = (seconds: number) => {
    const totalMs = Date.now() - startTimeRef.current;
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <>
      {showLaunchScreen ? (
        <LaunchScreen
          onComplete={() => setShowLaunchScreen(false)}
          onLeave={onGiveUp}
          language={language}
          goalArticle={endArticle}
        />
      ) : (
        <div className="bg-white content-stretch flex flex-col items-start relative size-full">
          {/* Container with Wikipedia content */}
          <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0 w-full">
            <div className="size-full">
              <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] lg:p-[16px] relative size-full">
                <div className="basis-0 bg-white grow min-h-px min-w-px rounded-[32px] shrink-0 w-full overflow-hidden relative">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading...</div>
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      srcDoc={articleContent}
                      sandbox="allow-same-origin allow-popups allow-scripts"
                      className="size-full border-0 rounded-[32px]"
                      title="Wikipedia Article"
                      key={currentPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Desktop Layout */}
          <div className="hidden lg:block bg-black relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex items-center justify-between pb-[16px] pt-0 px-[48px] relative w-full">
                {/* Stats */}
                <div className="content-stretch flex gap-[32px] items-center relative shrink-0">
                  {/* Goal Info */}
                  <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">{getTranslation(language, 'goal')}</p>
                    <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">{endArticle}</p>
                  </div>

                  {/* Links Clicked */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre">
                    <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">{getTranslation(language, 'linksClicked')}</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white transition-all duration-200" key={linksClicked}>{linksClicked}</p>
                  </div>

                  {/* Time Elapsed */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre w-[120px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">{getTranslation(language, 'timeElapsed')}</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">{formatTime(timeElapsed)}</p>
                  </div>

                  {/* Current Page */}
                  <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">{getTranslation(language, 'currentPage')}</p>
                    <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">{currentPage}</p>
                  </div>
                </div>

                {/* Give Up Button */}
                <button 
                  onClick={onGiveUp}
                  className="bg-[#ec221f] relative rounded-[8px] shrink-0 hover:bg-[#d11f1c] transition-colors"
                >
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'giveUp')}</p>
                  </div>
                  <div aria-hidden="true" className="absolute border border-[#c00f0c] border-solid inset-0 pointer-events-none rounded-[8px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer - Mobile Layout */}
          <div className="lg:hidden bg-black relative shrink-0 w-full">
            <div className="flex flex-col justify-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-center pb-[16px] pt-[8px] px-[16px] relative w-full">
                {/* Collapsible Goal Button */}
                <button
                  onClick={() => setIsFooterExpanded(!isFooterExpanded)}
                  className="content-stretch flex items-center justify-between relative shrink-0 w-full"
                >
                  <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre text-left">{getTranslation(language, 'goal')}</p>
                    <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full text-left">{endArticle}</p>
                  </div>
                  <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0">
                    <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[inherit]">
                      <div className="relative shrink-0 size-[20px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          {isFooterExpanded ? (
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#F5F5F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          ) : (
                            <path d="M18 15L12 9L6 15" stroke="#F5F5F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[32px]" />
                  </div>
                </button>

                {/* Expanded Stats and Button */}
                {isFooterExpanded && (
                  <>
                    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
                      {/* Links Clicked */}
                      <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre">
                        <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">{getTranslation(language, 'linksClicked')}</p>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">{linksClicked}</p>
                      </div>

                      {/* Time Elapsed */}
                      <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre">
                        <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">{getTranslation(language, 'timeElapsed')}</p>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">{formatTime(timeElapsed)}</p>
                      </div>

                      {/* Current Page */}
                      <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap flex-1 overflow-hidden">
                        <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">{getTranslation(language, 'currentPage')}</p>
                        <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">{currentPage}</p>
                      </div>
                    </div>

                    {/* Give Up Button */}
                    <button 
                      onClick={onGiveUp}
                      className="bg-[#ec221f] relative rounded-[8px] shrink-0 w-full hover:bg-[#d11f1c] transition-colors"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">{getTranslation(language, 'giveUp')}</p>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#c00f0c] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Win Dialog */}
          {showWinDialog && (
            <div className="fixed inset-0 z-50">
              <WinScreen
                startArticle={startArticle}
                endArticle={endArticle}
                linksClicked={linksClicked}
                timeElapsed={formatTime(timeElapsed)}
                navigationPath={navigationPath}
                onPlayAgain={onGiveUp}
                language={language}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}