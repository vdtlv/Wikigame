import { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import AuthModal from './components/AuthModal';
import PartyLobbyScreen from './components/PartyLobbyScreen';
import HostLaunchScreen from './components/HostLaunchScreen';
import PlayerLaunchScreen from './components/PlayerLaunchScreen';
import { supabase, supabaseUrl, supabaseAnonKey } from './utils/supabase/client';

export type Language = 'en' | 'ru';

export interface ArticlePair {
  start: string;
  end: string;
}

export interface User {
  id: string;
  nickname: string;
  email?: string;
}

// Simple router using hash-based navigation
function useHashRouter() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // Parse route and query params
  const [pathname, search] = route.split('?');
  const searchParams = new URLSearchParams(search || '');
  
  return { pathname, searchParams, navigate };
}

export default function App() {
  const { pathname, searchParams, navigate } = useHashRouter();
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalStep, setAuthModalStep] = useState<'email' | 'code' | 'nickname'>('email');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [returnPath, setReturnPath] = useState<string>('/');

  // 🔍 CAPTURE URL IMMEDIATELY ON LOAD
  useEffect(() => {
    console.log('🚀 APP LOADED - IMMEDIATE URL CAPTURE');
    console.log('📍 EXACT URL:', window.location.href);
    console.log('🔗 HASH:', window.location.hash);
    console.log('🔗 SEARCH:', window.location.search);
    console.log('🔗 PATHNAME:', window.location.pathname);
    console.log('🔗 ORIGIN:', window.location.origin);
    
    // Log all parts of URL
    const url = new URL(window.location.href);
    console.log('📦 URL Object:', {
      href: url.href,
      origin: url.origin,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      searchParams: Object.fromEntries(url.searchParams.entries()),
    });
    
    // 🔍 CHECK FOR OAUTH ERRORS IN URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    const error = hashParams.get('error') || queryParams.get('error');
    const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
    const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
    
    if (error) {
      console.error('🚨 OAUTH ERROR DETECTED IN URL!');
      console.error('❌ Error:', error);
      console.error('❌ Error Code:', errorCode);
      console.error('❌ Error Description:', errorDescription);
    }
  }, []); // Run ONCE on mount

  // Check for existing session on mount
  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      console.log('🔍 Checking URL for OAuth callback...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔗 Hash:', window.location.hash);
      console.log('🔗 Search:', window.location.search);
      
      // Check for OAuth callback in URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      console.log('📦 Hash params:', Object.fromEntries(hashParams.entries()));
      console.log('📦 Query params:', Object.fromEntries(queryParams.entries()));
      
      const error = queryParams.get('error') || hashParams.get('error');
      const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
      
      if (error) {
        console.error('❌ OAuth error in URL:', error);
        console.error('📝 Error description:', errorDescription);
        setIsCheckingAuth(false);
        return;
      }
      
      // Supabase with detectSessionInUrl:true automatically handles the code exchange
      // So we just need to check for an existing session
      console.log('ℹ️ Supabase will automatically handle OAuth callback');
      await checkSession();
      
    } catch (error) {
      console.error('❌ Error handling OAuth callback:', error);
      setIsCheckingAuth(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event);
      
      if (session) {
        console.log('🔑 Session ID:', session.access_token.substring(0, 20) + '...');
        console.log('⏰ Session expires at:', new Date(session.expires_at! * 1000).toLocaleString());
      }
      
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        if (event === 'INITIAL_SESSION') {
          console.log('🔄 Restoring previous session');
        } else {
          console.log('🆕 New session created');
        }
        
        // Fetch user profile
        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/user-profile/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        });

        if (response.ok) {
          const profile = await response.json();
          
          if (profile.nickname) {
            // Log authentication status
            const authMethod = session.user.app_metadata.provider || 'email';
            console.log('✅ User logged in successfully');
            console.log('📧 Email:', session.user.email);
            console.log('👤 Nickname:', profile.nickname);
            console.log('🔐 Login method:', authMethod === 'google' ? 'Google OAuth' : 'Email Magic Link');
            console.log('🆔 User ID:', session.user.id);
            
            setUser({
              id: session.user.id,
              nickname: profile.nickname,
              email: session.user.email,
            });
            setShowAuthModal(false);
            
            // Navigate back to the return path after successful auth
            if (returnPath && returnPath !== '/') {
              console.log('🔄 Returning to:', returnPath);
              navigate(returnPath);
              setReturnPath('/');
            }
          } else {
            console.log('⚠️ User signed in but no nickname set yet');
            console.log('📝 Showing nickname modal for user to complete profile');
            // User needs to set nickname - show the nickname modal
            setAuthModalStep('nickname');
            setShowAuthModal(true);
          }
        } else if (response.status === 404) {
          // Profile doesn't exist yet - first time Google user
          console.log('🆕 First time user - no profile found');
          console.log('📝 Showing nickname modal for new user to set up profile');
          setAuthModalStep('nickname');
          setShowAuthModal(true);
        } else {
          console.log('⚠️ User signed in but profile fetch failed:', response.status);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out');
        setUser(null);
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, returnPath]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('🔄 Continuing previous session');
        console.log('🔑 Session ID:', session.access_token.substring(0, 20) + '...');
        console.log('⏰ Session expires at:', new Date(session.expires_at! * 1000).toLocaleString());
        
        // Fetch user profile
        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/user-profile/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        });

        if (response.ok) {
          const profile = await response.json();
          setUser({
            id: session.user.id,
            nickname: profile.nickname,
            email: session.user.email,
          });
          
          // Log authentication status
          const authMethod = session.user.app_metadata.provider || 'email';
          console.log('✅ User is logged in');
          console.log('📧 Email:', session.user.email);
          console.log('👤 Nickname:', profile.nickname);
          console.log('🔐 Login method:', authMethod === 'google' ? 'Google OAuth' : 'Email Magic Link');
          console.log('🆔 User ID:', session.user.id);
        }
      } else {
        console.log('❌ User is not logged in');
        console.log('❌ No session found');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      console.log('❌ User is not logged in (error occurred)');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuthSuccess = (userId: string, nickname: string) => {
    console.log('🎉 handleAuthSuccess called');
    console.log('👤 Setting user with nickname:', nickname);
    setUser({ id: userId, nickname });
    setShowAuthModal(false);
    // Reset step for next time
    setAuthModalStep('email');
    
    // Navigate back to the return path after successful auth
    if (returnPath && returnPath !== '/') {
      console.log('🔄 Returning to:', returnPath);
      navigate(returnPath);
      setReturnPath('/');
    }
  };

  const handleShowAuth = (currentPath?: string) => {
    // Store where the user was when they clicked login
    if (currentPath) {
      console.log('💾 Storing return path:', currentPath);
      setReturnPath(currentPath);
    }
    setAuthModalStep('email');
    setShowAuthModal(true);
  };

  const handleShowNickname = () => {
    setAuthModalStep('nickname');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    console.log('🚪 User logged out successfully');
    navigate('/');
  };

  if (isCheckingAuth) {
    return (
      <div className="bg-black size-full flex items-center justify-center">
        <p className="text-white text-[16px] font-['Inter:Regular',sans-serif]">Loading...</p>
      </div>
    );
  }

  // Route rendering logic
  const renderRoute = () => {
    // Extract route params
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Home route
    if (pathname === '/' || pathname === '') {
      return (
        <SetupScreen 
          onStartGame={(start, end) => {
            navigate(`/game?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
          }}
          language={language}
          onLanguageChange={setLanguage}
          user={user}
          onShowAuth={() => handleShowAuth('/')}
          onShowNickname={handleShowNickname}
          onLogout={handleLogout}
          onJoinPartyLobby={(partyUid, accessCode) => {
            navigate(`/lobby/${partyUid}?access=${accessCode}`);
          }}
          onNavigateToMultiplayer={() => navigate('/multiplayer')}
        />
      );
    }
    
    // Multiplayer selection route
    if (pathname === '/multiplayer') {
      return (
        <SetupScreen 
          onStartGame={(start, end) => {
            navigate(`/game?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
          }}
          language={language}
          onLanguageChange={setLanguage}
          user={user}
          onShowAuth={() => handleShowAuth('/multiplayer')}
          onShowNickname={handleShowNickname}
          onLogout={handleLogout}
          onJoinPartyLobby={(partyUid, accessCode) => {
            navigate(`/lobby/${partyUid}?access=${accessCode}`);
          }}
          initialView="multiplayer"
          onNavigateToHome={() => navigate('/')}
        />
      );
    }
    
    // Game route
    if (pathname === '/game') {
      const startArticle = searchParams.get('start') || '';
      const endArticle = searchParams.get('end') || '';
      const partyUid = searchParams.get('party') || undefined;
      
      return (
        <GameScreen
          startArticle={startArticle}
          endArticle={endArticle}
          onWin={() => {
            navigate(`/win?party=${partyUid || ''}`);
          }}
          onGiveUp={() => {
            if (partyUid) {
              navigate(`/lobby/${partyUid}`);
            } else {
              navigate('/');
            }
          }}
          language={language}
          partyUid={partyUid}
          user={user}
        />
      );
    }
    
    // Win route
    if (pathname === '/win') {
      const partyUid = searchParams.get('party');
      return (
        <WinScreen 
          onPlayAgain={() => {
            if (partyUid) {
              navigate(`/lobby/${partyUid}`);
            } else {
              navigate('/');
            }
          }}
          language={language}
        />
      );
    }
    
    // Lobby route
    if (pathSegments[0] === 'lobby' && pathSegments[1]) {
      const partyUid = pathSegments[1];
      const accessCode = searchParams.get('access') || '';
      
      // Redirect to home if no user
      if (!user) {
        // Trigger auth modal with return path
        setTimeout(() => {
          handleShowAuth(`/lobby/${partyUid}?access=${accessCode}`);
        }, 0);
        
        return (
          <div className="bg-black size-full flex items-center justify-center">
            <p className="text-white text-[16px] font-['Inter:Regular',sans-serif]">Please log in...</p>
          </div>
        );
      }
      
      return (
        <PartyLobbyScreen
          language={language}
          user={user}
          partyUid={partyUid}
          accessCode={accessCode}
          onLanguageChange={setLanguage}
          onBack={() => navigate('/')}
          onHostReady={(start, end) => {
            navigate(`/host-launch/${partyUid}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&access=${accessCode}`);
          }}
          onPlayerReady={() => {
            navigate(`/player-waiting/${partyUid}?access=${accessCode}`);
          }}
          onLeave={() => navigate('/')}
        />
      );
    }
    
    // Host launch route
    if (pathSegments[0] === 'host-launch' && pathSegments[1]) {
      const partyUid = pathSegments[1];
      const startArticle = searchParams.get('start') || '';
      const endArticle = searchParams.get('end') || '';
      const accessCode = searchParams.get('access') || '';
      
      if (!user) {
        navigate('/');
        return null;
      }
      
      return (
        <HostLaunchScreen
          language={language}
          user={user}
          partyUid={partyUid}
          accessCode={accessCode}
          startArticle={startArticle}
          endArticle={endArticle}
          onLaunch={() => {
            navigate(`/game?start=${encodeURIComponent(startArticle)}&end=${encodeURIComponent(endArticle)}&party=${partyUid}`);
          }}
          onBack={() => navigate(`/lobby/${partyUid}?access=${accessCode}`)}
        />
      );
    }
    
    // Player waiting route
    if (pathSegments[0] === 'player-waiting' && pathSegments[1]) {
      const partyUid = pathSegments[1];
      const accessCode = searchParams.get('access') || '';
      
      if (!user) {
        navigate('/');
        return null;
      }
      
      return (
        <PlayerLaunchScreen
          language={language}
          user={user}
          partyUid={partyUid}
          onGameStarted={(start, end) => {
            navigate(`/game?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&party=${partyUid}`);
          }}
          onLeave={() => navigate(`/lobby/${partyUid}?access=${accessCode}`)}
        />
      );
    }
    
    // 404 - redirect to home
    navigate('/');
    return null;
  };

  return (
    <div className="size-full">
      {renderRoute()}
      
      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
          language={language}
          initialStep={authModalStep}
        />
      )}
    </div>
  );
}