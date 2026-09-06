import { useState } from 'react';
import { Language } from '../App';
import Logo from './Logo';
import { supabase, supabaseUrl, supabaseAnonKey } from '../utils/supabase/client';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (userId: string, nickname: string) => void;
  language: Language;
  initialStep?: AuthStep;
}

type AuthStep = 'email' | 'nickname' | 'waiting' | 'code' | 'loginPassword' | 'createPassword';

export default function AuthModal({ onClose, onAuthSuccess, language, initialStep = 'email' }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email validation
  const isValidEmail = (val: string) => {
    return val.includes('@') && val.includes('.') && val.length > 5;
  };

  // Check if input is long enough to proceed
  const canContinue = email.trim().length >= 2;

  const handleContinue = async () => {
    const trimmed = email.trim();
    if (trimmed.length < 2) {
      setError(language === 'ru' ? 'Минимум 2 символа' : 'Minimum 2 characters');
      return;
    }

    if (isValidEmail(trimmed)) {
      // Email flow → send verification code
      await handleSendMagicLink();
    } else {
      // Login flow → check if login exists
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/check-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ login: trimmed }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to check login');
        }

        const data = await response.json();

        if (data.exists) {
          // Login exists → show password input
          setStep('loginPassword');
        } else {
          // New login → show create password screen
          setStep('createPassword');
        }
      } catch (err: any) {
        console.error('Check login error:', err);
        setError(language === 'ru' ? `Ошибка: ${err.message}` : `Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMagicLink = async () => {
    if (!isValidEmail(email)) {
      setError(language === 'ru' ? 'Введите корректный e-mail' : 'Enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/send-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send magic link');
      }

      setStep('code');
    } catch (err: any) {
      console.error('Send magic link error:', err);
      if (err.message?.includes('Email service not configured')) {
        setError(
          language === 'ru'
            ? 'Email сервис не настроен. Пожалуйста, используйте вход через Google.'
            : 'Email service not configured. Please use Google sign-in.'
        );
      } else {
        setError(language === 'ru' ? `Ошибка отправки ссылки: ${err.message}` : `Error sending link: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError(language === 'ru' ? 'Введите 6-значный код' : 'Enter 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Invalid code');
      }

      const data = await response.json();
      console.log('Code verified, user ID:', data.userId);

      // Establish Supabase session with the tokens
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        console.error('Error setting session:', sessionError);
        throw new Error('Failed to establish session');
      }

      // Store userId temporarily for nickname setup
      setTempUserId(data.userId);

      // Check if user has a nickname
      const profileResponse = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/user-profile/${data.userId}`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        if (profile.nickname) {
          onAuthSuccess(data.userId, profile.nickname);
          return;
        }
      }

      // No nickname, show nickname input
      setStep('nickname');
    } catch (err: any) {
      console.error('Verify code error:', err);
      setError(language === 'ru' ? `Неверный или истекший код` : `Invalid or expired code`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNickname = async () => {
    if (!nickname || nickname.length < 2) {
      setError(language === 'ru' ? 'Введите имя (минимум 2 символа)' : 'Enter name (minimum 2 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let userId = tempUserId;

      if (!userId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          userId = session.user.id;
        } else {
          throw new Error('No user ID found');
        }
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          userId: userId,
          nickname,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      onAuthSuccess(userId, nickname);
    } catch (err: any) {
      console.error('Set nickname error:', err);
      setError(language === 'ru' ? 'Ошибка сохранения имени' : 'Error saving name');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPassword = async () => {
    if (!password) {
      setError(language === 'ru' ? 'Введите пароль' : 'Enter password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/login-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          login: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setError(language === 'ru' ? 'Неверный пароль' : 'Invalid password');
        } else {
          setError(language === 'ru' ? `Ошибка: ${errorData.error}` : `Error: ${errorData.error}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Login successful, userId:', data.userId);

      // Save login session to localStorage
      localStorage.setItem('wikirunner_login_session', JSON.stringify({
        userId: data.userId,
        nickname: data.nickname,
        authMethod: 'password',
      }));

      onAuthSuccess(data.userId, data.nickname);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(language === 'ru' ? 'Ошибка входа' : 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!password || password.length < 4) {
      setError(language === 'ru' ? 'Пароль минимум 4 символа' : 'Password minimum 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setPasswordError('');

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-92321c2f/register-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          login: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create account');
      }

      const data = await response.json();
      console.log('Account created, userId:', data.userId);

      // Save login session to localStorage
      localStorage.setItem('wikirunner_login_session', JSON.stringify({
        userId: data.userId,
        nickname: data.nickname,
        authMethod: 'password',
      }));

      onAuthSuccess(data.userId, data.nickname);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(language === 'ru' ? `Ошибка создания аккаунта: ${err.message}` : `Error creating account: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err: any) {
      console.error('Error during Google sign-in:', err);
      setError(language === 'ru' ? 'Ошибка входа через Google' : 'Google sign-in error');
      setLoading(false);
    }
  };

  // Validate password match in real time
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canCreateAccount = password.length >= 4 && passwordsMatch;

  // Shared input component
  const renderInput = (
    type: string,
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    maxLength?: number,
    hasError?: boolean
  ) => (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
        <div className={`bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full`}>
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (step === 'email') handleContinue();
                    else if (step === 'code') handleVerifyCode();
                    else if (step === 'nickname') handleSetNickname();
                    else if (step === 'loginPassword') handleLoginWithPassword();
                    else if (step === 'createPassword' && canCreateAccount) handleCreateAccount();
                  }
                }}
                className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
              />
            </div>
          </div>
          <div aria-hidden="true" className={`absolute border border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] ${hasError ? 'border-[#dc2626]' : 'border-[#444444]'}`} />
        </div>
      </div>
    </div>
  );

  // Shared button component
  const renderButton = (
    onClick: () => void,
    label: string,
    loadingLabel: string,
    active: boolean,
    variant: 'primary' | 'secondary' = 'secondary'
  ) => (
    <button
      onClick={onClick}
      disabled={loading || !active}
      className={`relative rounded-[8px] shrink-0 w-full transition-colors ${
        active && !loading
          ? variant === 'primary'
            ? 'bg-white hover:bg-gray-100'
            : 'bg-[#383838] hover:bg-[#484848]'
          : 'bg-[#383838] cursor-not-allowed'
      }`}
    >
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            active && !loading
              ? variant === 'primary'
                ? 'text-black'
                : 'text-[#b3b3b3]'
              : 'text-[#b3b3b3]'
          }`}>
            {loading ? loadingLabel : label}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center z-[9999]">
      {/* Header */}
      <div className="bg-black h-[56px] lg:h-[86px] relative shrink-0 w-full">
        <div className="absolute h-[40px] left-[16px] lg:left-[48px] top-1/2 translate-y-[-50%] w-[80px]">
          <Logo />
        </div>
        <div className="absolute content-stretch flex gap-[16px] items-center right-[16px] lg:right-[48px] top-1/2 translate-y-[-50%]">
          <button
            onClick={onClose}
            className="bg-[#303030] relative rounded-[8px] shrink-0 hover:bg-[#404040] transition-colors"
          >
            <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                {language === 'ru' ? 'Закрыть' : 'Close'}
              </p>
            </div>
            <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </button>
        </div>
      </div>

      {/* Content - Centered */}
      <div className="bg-black flex-1 flex items-center justify-center relative shrink-0 w-full">
        <div className="flex flex-col items-center w-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full max-w-[360px]">

            {/* Step: Email / Login input */}
            {step === 'email' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Вход или регистрация' : 'Login or sign up'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">{language === 'ru' ? 'Введите e-mail или логин' : 'Enter your e-mail or login'}</p>
                  </div>
                </div>

                {/* Input */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  {renderInput(
                    'text',
                    email,
                    (val) => { setEmail(val); setError(''); },
                    language === 'ru' ? 'E-mail или логин' : 'E-mail or login'
                  )}
                  {renderButton(
                    handleContinue,
                    language === 'ru' ? 'Продолжить' : 'Continue',
                    language === 'ru' ? 'Проверка...' : 'Checking...',
                    canContinue,
                    'primary'
                  )}
                </div>

                {/* Or */}
                <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[328px]">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
                    <p className="leading-[1.4]">{language === 'ru' ? 'или' : 'or'}</p>
                  </div>
                </div>

                {/* Google Button */}
                <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-[328px]">
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="bg-[#383838] relative rounded-[8px] shrink-0 w-full hover:bg-[#484848] transition-colors disabled:opacity-50"
                    >
                      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">
                            {language === 'ru' ? 'Продолжить с Google' : 'Continue with Google'}
                          </p>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Step: Login with password (existing user) */}
            {step === 'loginPassword' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Добро пожаловать!' : 'Welcome back!'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">
                      {language === 'ru'
                        ? `Введите пароль, «${email.trim()}»`
                        : `Enter your password, "${email.trim()}"`}
                    </p>
                  </div>
                </div>

                {/* Password Input */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  {renderInput(
                    'password',
                    password,
                    (val) => { setPassword(val); setError(''); },
                    language === 'ru' ? 'Пароль' : 'Password',
                    undefined,
                    !!error
                  )}
                  {renderButton(
                    handleLoginWithPassword,
                    language === 'ru' ? 'Войти' : 'Login',
                    language === 'ru' ? 'Вход...' : 'Logging in...',
                    password.length > 0,
                    'primary'
                  )}
                </div>

                {/* Back button */}
                <button
                  onClick={() => { setStep('email'); setPassword(''); setError(''); }}
                  className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {language === 'ru' ? '← Назад' : '← Back'}
                </button>

                {error && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Step: Create password (new user) */}
            {step === 'createPassword' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Создание аккаунта' : 'Create account'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">
                      {language === 'ru'
                        ? `Придумайте пароль для «${email.trim()}»`
                        : `Create a password for "${email.trim()}"`}
                    </p>
                  </div>
                </div>

                {/* Password Inputs */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  {renderInput(
                    'password',
                    password,
                    (val) => { setPassword(val); setPasswordError(''); setError(''); },
                    language === 'ru' ? 'Пароль' : 'Password'
                  )}
                  {renderInput(
                    'password',
                    confirmPassword,
                    (val) => { setConfirmPassword(val); setPasswordError(''); setError(''); },
                    language === 'ru' ? 'Повторите пароль' : 'Confirm password',
                    undefined,
                    !!passwordError
                  )}

                  {/* Password mismatch hint */}
                  {confirmPassword.length > 0 && password.length > 0 && !passwordsMatch && (
                    <p className="text-[#f59e0b] text-[13px] font-['Inter:Regular',sans-serif]">
                      {language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match'}
                    </p>
                  )}

                  {password.length > 0 && password.length < 4 && (
                    <p className="text-[rgba(255,255,255,0.4)] text-[13px] font-['Inter:Regular',sans-serif]">
                      {language === 'ru' ? 'Минимум 4 символа' : 'Minimum 4 characters'}
                    </p>
                  )}

                  {renderButton(
                    handleCreateAccount,
                    language === 'ru' ? 'Создать аккаунт' : 'Create account',
                    language === 'ru' ? 'Создание...' : 'Creating...',
                    canCreateAccount,
                    'primary'
                  )}
                </div>

                {/* Back button */}
                <button
                  onClick={() => { setStep('email'); setPassword(''); setConfirmPassword(''); setError(''); setPasswordError(''); }}
                  className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {language === 'ru' ? '← Назад' : '← Back'}
                </button>

                {(error || passwordError) && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error || passwordError}
                  </p>
                )}
              </div>
            )}

            {/* Step: Verify email code */}
            {step === 'code' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Почти готово' : 'Almost ready'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">{language === 'ru' ? 'Введите код из письма' : 'Enter a code from email'}</p>
                  </div>
                </div>

                {/* Input */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  {renderInput(
                    'text',
                    code,
                    (val) => { setCode(val); setError(''); },
                    language === 'ru' ? 'Ваш код' : 'Your code',
                    6
                  )}
                  {renderButton(
                    handleVerifyCode,
                    language === 'ru' ? 'Проверить код' : 'Verify code',
                    language === 'ru' ? 'Проверка...' : 'Verifying...',
                    code.length === 6
                  )}
                </div>

                {/* Back button */}
                <button
                  onClick={() => { setStep('email'); setCode(''); setError(''); }}
                  className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
                >
                  {language === 'ru' ? '← Назад' : '← Back'}
                </button>

                {error && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Step: Set nickname (after email verification) */}
            {step === 'nickname' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Последний вопрос' : 'Last question'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">{language === 'ru' ? 'Как вас зовут?' : 'What is your name?'}</p>
                  </div>
                </div>

                {/* Input */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  {renderInput(
                    'text',
                    nickname,
                    (val) => { setNickname(val); setError(''); },
                    language === 'ru' ? 'Ваше имя' : 'Your name'
                  )}
                  {renderButton(
                    handleSetNickname,
                    language === 'ru' ? 'Продолжить' : 'Continue',
                    language === 'ru' ? 'Сохранение...' : 'Saving...',
                    nickname.length >= 2
                  )}
                </div>

                {error && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error}
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
