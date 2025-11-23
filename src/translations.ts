import { Language } from './App';

export const translations = {
  en: {
    // Header
    login: 'Login',
    language: 'Language',
    
    // Setup Screen
    quickPlay: 'Quick Play',
    quickPlayDescription: 'Wondering what could possibly link Philosophy to Chuck Norris? Stop wondering and find out yourself!',
    startArticlePlaceholder: 'Start Article',
    endArticlePlaceholder: 'End Article',
    swapArticles: 'Swap articles',
    launchGame: 'Launch game',
    launch: 'Launch',
    recommendedPrompts: 'Recommended Prompts',
    recommendedPromptsDescription: "Here's what other players have been playing recently",
    
    // Game Screen
    goal: 'Goal',
    linksClicked: 'Links clicked',
    clicks: 'Clicks',
    timeElapsed: 'Time Elapsed',
    currentPage: 'Current Page',
    giveUp: 'Give up',
    leave: 'Leave',
    loading: 'Loading...',
    
    // Win Screen
    congratulations: 'Congratulations!',
    youReached: 'You reached',
    from: 'from',
    playAgain: 'Play Again',
    youWon: 'You Won!',
    
    // Language names
    languageEnglish: 'English',
    languageRussian: 'Русский',
  },
  ru: {
    // Header
    login: 'Войти',
    language: 'Язык',
    
    // Setup Screen
    quickPlay: 'Быстрая игра',
    quickPlayDescription: 'Интересно, что может связывать философию и Чака Норриса? Прекратите гадать и узнайте сами!',
    startArticlePlaceholder: 'Начальная статья',
    endArticlePlaceholder: 'Конечная статья',
    swapArticles: 'Поменять статьи',
    launchGame: 'Начать игру',
    launch: 'Начать',
    recommendedPrompts: 'Рекомендуемые задания',
    recommendedPromptsDescription: 'Вот что играли другие игроки недавно',
    
    // Game Screen
    goal: 'Цель',
    linksClicked: 'Переходов',
    clicks: 'Кликов',
    timeElapsed: 'Время',
    currentPage: 'Текущая страница',
    giveUp: 'Сдаться',
    leave: 'Вернуться',
    loading: 'Загрузка...',
    
    // Win Screen
    congratulations: 'Поздравляем!',
    youReached: 'Вы добрались до',
    from: 'из',
    playAgain: 'Играть еще раз',
    youWon: 'Вы выиграли!',
    
    // Language names
    languageEnglish: 'English',
    languageRussian: 'Русский',
  },
};

export const getTranslation = (language: Language, key: keyof typeof translations.en): string => {
  return translations[language][key];
};

export const POPULAR_ARTICLES = {
  en: [
    'Philosophy', 'United States', 'World War II', 'Albert Einstein', 
    'The Beatles', 'William Shakespeare', 'Leonardo da Vinci', 'Ancient Rome',
    'Mathematics', 'Solar System', 'English language', 'Napoleon',
    'Basketball', 'Python (programming language)', 'Coffee', 'Cat',
    'Internet', 'Moon', 'Pizza', 'Guitar'
  ],
  ru: [
    'Философия', 'Россия', 'Вторая мировая война', 'Альберт Эйнштейн',
    'The Beatles', 'Уильям Шекспир', 'Леонардо да Винчи', 'Древний Рим',
    'Математика', 'Солнечная система', 'Русский язык', 'Наполеон Бонапарт',
    'Баскетбол', 'Python', 'Кофе', 'Кошка',
    'Интернет', 'Луна', 'Пицца', 'Гитара'
  ]
};

export const RECOMMENDED_PROMPTS = {
  en: [
    { start: 'Philosophy', end: 'Chuck Norris' },
    { start: 'Albert Einstein', end: 'Pizza' },
    { start: 'World War II', end: 'The Beatles' },
    { start: 'Ancient Rome', end: 'Basketball' },
  ],
  ru: [
    { start: 'Философия', end: 'Чак Норрис' },
    { start: 'Альберт Эйнштейн', end: 'Пицца' },
    { start: 'Вторая мировая война', end: 'The Beatles' },
    { start: 'Древний Рим', end: 'Баскетбол' },
  ]
};