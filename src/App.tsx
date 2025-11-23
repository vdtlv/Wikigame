import { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';

export type GameState = 'setup' | 'playing' | 'won';
export type Language = 'en' | 'ru';

export interface ArticlePair {
  start: string;
  end: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [articles, setArticles] = useState<ArticlePair>({ start: '', end: '' });
  const [language, setLanguage] = useState<Language>('en');

  const handleStartGame = (start: string, end: string) => {
    setArticles({ start, end });
    setGameState('playing');
  };

  const handleWin = () => {
    setGameState('won');
  };

  const handleGiveUp = () => {
    setGameState('setup');
  };

  const handlePlayAgain = () => {
    setGameState('setup');
  };

  return (
    <div className="size-full">
      {gameState === 'setup' && (
        <SetupScreen 
          onStartGame={handleStartGame} 
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
      {gameState === 'playing' && (
        <GameScreen
          startArticle={articles.start}
          endArticle={articles.end}
          onWin={handleWin}
          onGiveUp={handleGiveUp}
          language={language}
        />
      )}
      {gameState === 'won' && (
        <WinScreen 
          onPlayAgain={handlePlayAgain}
          language={language}
        />
      )}
    </div>
  );
}