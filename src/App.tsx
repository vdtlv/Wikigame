import { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import AuthModal from './components/AuthModal';
import PartyLobbyScreen from './components/PartyLobbyScreen';
import HostLaunchScreen from './components/HostLaunchScreen';
import PlayerLaunchScreen from './components/PlayerLaunchScreen';
import { supabase, supabaseUrl, supabaseAnonKey } from './utils/supabase/client';

export type GameState = 'setup' | 'playing' | 'won' | 'party-lobby' | 'host-launch' | 'player-waiting';
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

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [articles, setArticles] = useState<ArticlePair>({ start: '', end: '' });
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalStep, setAuthModalStep] = useState<'email' | 'code' | 'nickname'>('email');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Multiplayer state
  const [currentPartyUid, setCurrentPartyUid] = useState<string | null>(null);
  const [currentAccessCode, setCurrentAccessCode] = useState<string>('');
  const [isMultiplayerGame, setIsMultiplayerGame] = useState(false);

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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
  };

  const handleShowAuth = () => {
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
  };

  const handleStartGame = (start: string, end: string, partyUid?: string) => {
    setArticles({ start, end });
    if (partyUid) {
      setCurrentPartyUid(partyUid);
      setIsMultiplayerGame(true);
    } else {
      setCurrentPartyUid(null);
      setIsMultiplayerGame(false);
    }
    setGameState('playing');
  };

  const handleWin = () => {
    setGameState('won');
  };

  const handleGiveUp = () => {
    if (isMultiplayerGame && currentPartyUid) {
      // Go back to party lobby
      setGameState('party-lobby');
    } else {
      setGameState('setup');
    }
  };

  const handlePlayAgain = () => {
    if (isMultiplayerGame && currentPartyUid) {
      // Go back to party lobby
      setGameState('party-lobby');
    } else {
      setGameState('setup');
    }
  };

  const handleBackToSetup = () => {
    setGameState('setup');
    setCurrentPartyUid(null);
    setCurrentAccessCode('');
    setIsMultiplayerGame(false);
  };

  const handleJoinPartyLobby = (partyUid: string, accessCode: string) => {
    setCurrentPartyUid(partyUid);
    setCurrentAccessCode(accessCode);
    setGameState('party-lobby');
  };
  
  const handleHostReady = (start: string, end: string) => {
    setArticles({ start, end });
    setGameState('host-launch');
  };
  
  const handlePlayerReady = () => {
    setGameState('player-waiting');
  };
  
  const handleBackToPartyLobby = () => {
    setGameState('party-lobby');
  };

  const handleLaunchPartyGame = () => {
    if (isMultiplayerGame && currentPartyUid) {
      // Go back to party lobby
      setGameState('party-lobby');
    } else {
      setGameState('setup');
    }
  };

  return (
    <div className="size-full">
      {isCheckingAuth ? (
        <div className="bg-black size-full flex items-center justify-center">
          <p className="text-white text-[16px] font-['Inter:Regular',sans-serif]">Loading...</p>
        </div>
      ) : (
        <>
          {gameState === 'setup' && (
            <SetupScreen 
              onStartGame={handleStartGame} 
              language={language}
              onLanguageChange={setLanguage}
              user={user}
              onShowAuth={handleShowAuth}
              onShowNickname={handleShowNickname}
              onLogout={handleLogout}
            />
          )}
          {gameState === 'playing' && (
            <GameScreen
              startArticle={articles.start}
              endArticle={articles.end}
              onWin={handleWin}
              onGiveUp={handleGiveUp}
              language={language}
              partyUid={isMultiplayerGame ? currentPartyUid : undefined}
              user={user}
            />
          )}
          {gameState === 'won' && (
            <WinScreen 
              onPlayAgain={handlePlayAgain}
              language={language}
            />
          )}
          {gameState === 'party-lobby' && currentPartyUid && user && (
            <PartyLobbyScreen
              language={language}
              user={user}
              partyUid={currentPartyUid}
              accessCode={currentAccessCode}
              onLanguageChange={setLanguage}
              onBack={handleBackToSetup}
              onHostReady={handleHostReady}
              onPlayerReady={handlePlayerReady}
              onLeave={handleBackToSetup}
            />
          )}
          {showAuthModal && (
            <AuthModal
              onAuthSuccess={handleAuthSuccess}
              onClose={() => setShowAuthModal(false)}
              language={language}
              initialStep={authModalStep}
            />
          )}
          {gameState === 'host-launch' && currentPartyUid && user && (
            <HostLaunchScreen
              language={language}
              user={user}
              partyUid={currentPartyUid}
              accessCode={currentAccessCode}
              startArticle={articles.start}
              endArticle={articles.end}
              onLaunch={() => handleStartGame(articles.start, articles.end, currentPartyUid)}
              onBack={handleBackToPartyLobby}
            />
          )}
          {gameState === 'player-waiting' && currentPartyUid && user && (
            <PlayerLaunchScreen
              language={language}
              user={user}
              partyUid={currentPartyUid}
              onStartGame={(start, end) => handleStartGame(start, end, currentPartyUid)}
              onBack={handleBackToPartyLobby}
            />
          )}
        </>
      )}
    </div>
  );
}