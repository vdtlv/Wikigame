import { useState } from 'react';
import { Language } from '../App';
import svgPaths from '../imports/svg-luu954fqih';
import Logo from './Logo';
import { supabase, supabaseUrl, supabaseAnonKey } from '../utils/supabase/client';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (userId: string, nickname: string) => void;
  language: Language;
  initialStep?: AuthStep;
}

type AuthStep = 'email' | 'nickname' | 'waiting' | 'code';

export default function AuthModal({ onClose, onAuthSuccess, language, initialStep = 'email' }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempUserId, setTempUserId] = useState('');

  // Email validation
  const isValidEmail = (email: string) => {
    return email.includes('@') && email.includes('.') && email.length > 5;
  };

  const handleSendMagicLink = async () => {
    if (!isValidEmail(email)) {
      setError(language === 'ru' ? 'Введите корректный e-mail' : 'Enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call our custom endpoint to send magic link via UniSender Go
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
      
      // Provide helpful error message
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
      console.log('✅ Code verified, user ID:', data.userId);

      // Establish Supabase session with the tokens
      console.log('🔑 Establishing session with tokens...');
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        console.error('❌ Error setting session:', sessionError);
        throw new Error('Failed to establish session');
      }

      console.log('✅ Session established successfully');
      console.log('🔑 Session ID:', sessionData.session?.access_token.substring(0, 20) + '...');

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
          console.log('✅ User has nickname:', profile.nickname);
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
      // Use tempUserId from code verification, or get current session user ID
      let userId = tempUserId;
      
      if (!userId) {
        console.log('⚠️ No tempUserId, checking current session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          userId = session.user.id;
          console.log('✅ Got userId from current session:', userId);
        } else {
          console.error('❌ No session found');
          throw new Error('No user ID found');
        }
      }

      console.log('💾 Saving nickname for user:', userId);

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
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to save profile:', response.status, errorData);
        throw new Error('Failed to save profile');
      }

      console.log('✅ User profile saved successfully');
      console.log('📧 Email:', email);
      console.log('👤 Nickname:', nickname);
      console.log('🔐 Login method: Email + Code');
      console.log('🆔 User ID:', userId);

      onAuthSuccess(userId, nickname);
    } catch (err: any) {
      console.error('Set nickname error:', err);
      console.error('📝 Error details:', {
        message: err.message,
        stack: err.stack,
      });
      setError(language === 'ru' ? 'Ошибка сохранения имени' : 'Error saving name');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔵 Starting Google OAuth sign-in...');
      console.log('🔗 Redirect URL will be:', window.location.origin);
      
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
        console.error('❌ Google OAuth error:', signInError);
        throw signInError;
      }
      
      console.log('✅ Google OAuth redirect initiated');
      console.log('📊 OAuth data:', data);
      
      // 🔍 LOG THE EXACT URL WE'RE REDIRECTING TO
      if (data?.url) {
        console.log('🌐 FULL OAUTH URL:', data.url);
        console.log('🔍 Parsing URL components...');
        
        try {
          const oauthUrl = new URL(data.url);
          console.log('📦 OAuth URL breakdown:');
          console.log('  - Protocol:', oauthUrl.protocol);
          console.log('  - Host:', oauthUrl.host);
          console.log('  - Pathname:', oauthUrl.pathname);
          console.log('  - Search params:', Object.fromEntries(oauthUrl.searchParams.entries()));
          
          // Check redirect_to parameter
          const redirectTo = oauthUrl.searchParams.get('redirect_to');
          console.log('🎯 REDIRECT_TO parameter:', redirectTo);
        } catch (err) {
          console.error('Failed to parse OAuth URL:', err);
        }
      }
      
      // Don't set loading to false here - we're redirecting
    } catch (err: any) {
      console.error('❌ Error during Google sign-in:', err);
      setError(language === 'ru' ? 'Ошибка входа через Google' : 'Google sign-in error');
      setLoading(false);
    }
  };

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
            {step === 'email' && (
              <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
                {/* Heading */}
                <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                    {language === 'ru' ? 'Вход или регистрация' : 'Login or sign in'}
                  </p>
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                    <p className="leading-[1.4]">{language === 'ru' ? 'Введите e-mail для продолжения' : 'Enter your e-mail to continue'}</p>
                  </div>
                </div>

                {/* Input */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                      <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                          <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={language === 'ru' ? 'Ваш e-mail' : 'Your e-mail'}
                              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                            />
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMagicLink}
                    disabled={loading || !isValidEmail(email)}
                    className={`relative rounded-[8px] shrink-0 w-full transition-colors ${
                      isValidEmail(email) && !loading
                        ? 'bg-white hover:bg-gray-100'
                        : 'bg-[#383838] cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
                        <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
                          isValidEmail(email) && !loading ? 'text-black' : 'text-[#b3b3b3]'
                        }`}>
                          {loading ? (language === 'ru' ? 'Отправка...' : 'Sending...') : (language === 'ru' ? 'Продолжить' : 'Continue')}
                        </p>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </button>
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
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                      <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                          <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                            <input
                              type="text"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                              placeholder={language === 'ru' ? 'Ваш код' : 'Your code'}
                              maxLength={6}
                              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                            />
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="bg-[#383838] relative rounded-[8px] shrink-0 w-full hover:bg-[#484848] transition-colors disabled:opacity-50"
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">
                          {loading ? (language === 'ru' ? 'Проверка...' : 'Verifying...') : (language === 'ru' ? 'Проверить код' : 'Verify code')}
                        </p>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </button>
                </div>

                {error && (
                  <p className="text-[#dc2626] text-[14px] mt-2 font-['Inter:Regular',sans-serif]">
                    {error}
                  </p>
                )}
              </div>
            )}

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
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                      <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                          <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                            <input
                              type="text"
                              value={nickname}
                              onChange={(e) => setNickname(e.target.value)}
                              placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'}
                              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                            />
                          </div>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSetNickname}
                    disabled={loading}
                    className="bg-[#383838] relative rounded-[8px] shrink-0 w-full hover:bg-[#484848] transition-colors disabled:opacity-50"
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">
                          {loading ? (language === 'ru' ? 'Сохранение...' : 'Saving...') : (language === 'ru' ? 'Продолжить' : 'Continue')}
                        </p>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </button>
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