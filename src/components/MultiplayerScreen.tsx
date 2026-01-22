import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-3tc7k9n2ww';
import Logo from './Logo';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MultiplayerScreenProps {
  language: Language;
  user: User | null;
  onLanguageChange: (lang: Language) => void;
  onShowAuth: () => void;
  onShowNickname: () => void;
  onBack: () => void;
  onCreateParty: (party: Party) => void;
  onJoinParty: (party: Party) => void;
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

interface MemberProfile {
  userId: string;
  nickname: string;
}

export default function MultiplayerScreen({
  language,
  user,
  onLanguageChange,
  onShowAuth,
  onShowNickname,
  onBack,
  onCreateParty,
  onJoinParty,
}: MultiplayerScreenProps) {
  const [activeTab, setActiveTab] = useState<'quickplay' | 'multiplayer'>('multiplayer');
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [userLobbies, setUserLobbies] = useState<Party[]>([]);
  const [isLoadingLobbies, setIsLoadingLobbies] = useState(false);
  const [lobbyMembers, setLobbyMembers] = useState<{ [key: string]: MemberProfile[] }>({});
  const [leavingLobby, setLeavingLobby] = useState<string | null>(null);

  // Fetch user's lobbies when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserLobbies();
    } else {
      setUserLobbies([]);
      setLobbyMembers({});
    }
  }, [user?.id]); // Changed from [user] to [user?.id] to prevent infinite loop

  const fetchUserLobbies = async () => {
    if (!user) return;

    setIsLoadingLobbies(true);
    try {
      console.log('🔄 Fetching user lobbies for:', user.id);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/user/${user.id}/parties`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        console.error('❌ Failed to fetch user lobbies:', response.status);
        setIsLoadingLobbies(false);
        return;
      }

      const parties = await response.json();
      console.log('✅ Fetched parties:', parties.length);
      setUserLobbies(parties);
      
      // Fetch member nicknames for each party
      const membersData: { [key: string]: MemberProfile[] } = {};
      for (const party of parties) {
        console.log('🔄 Fetching members for party:', party.partyUid);
        try {
          const memberProfiles = await Promise.all(
            party.members.map(async (userId: string) => {
              try {
                const profileController = new AbortController();
                const profileTimeoutId = setTimeout(() => profileController.abort(), 5000); // 5 second timeout per profile
                
                const profileResponse = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/user-profile/${userId}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${publicAnonKey}`,
                    },
                    signal: profileController.signal,
                  }
                );
                
                clearTimeout(profileTimeoutId);
                
                if (profileResponse.ok) {
                  const profile = await profileResponse.json();
                  return { userId, nickname: profile.nickname };
                }
                console.warn('⚠️ Profile not found for user:', userId);
                return { userId, nickname: 'Unknown' };
              } catch (error) {
                console.error('❌ Error fetching profile for user:', userId, error);
                return { userId, nickname: 'Unknown' };
              }
            })
          );
          membersData[party.partyUid] = memberProfiles;
          console.log('✅ Fetched members for party:', party.partyUid, memberProfiles.length);
        } catch (error) {
          console.error('❌ Error fetching members for party:', party.partyUid, error);
          membersData[party.partyUid] = [];
        }
      }
      setLobbyMembers(membersData);
      console.log('✅ All lobby data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching user lobbies:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ Request timed out');
        setError(language === 'ru' ? 'Время ожидания истекло' : 'Request timed out');
      }
    } finally {
      setIsLoadingLobbies(false);
      console.log('🏁 Loading complete');
    }
  };

  const handleRejoinLobby = (party: Party) => {
    if (party.creatorId === user?.id) {
      onCreateParty(party);
    } else {
      onJoinParty(party);
    }
  };

  const handleLeaveLobby = async (party: Party, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!user) return;

    setLeavingLobby(party.partyUid);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/${party.partyUid}/leave`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      if (response.ok) {
        // Refresh the lobbies list
        await fetchUserLobbies();
      }
    } catch (error) {
      console.error('Error leaving party:', error);
    } finally {
      setLeavingLobby(null);
    }
  };

  const formatMembersList = (party: Party): string => {
    const members = lobbyMembers[party.partyUid] || [];
    if (members.length === 0) return '';
    
    const userMember = members.find(m => m.userId === user?.id);
    const otherMembers = members.filter(m => m.userId !== user?.id);
    
    let result = '';
    if (userMember) {
      result = language === 'ru' ? 'Вы' : 'You';
    }
    
    if (otherMembers.length > 0) {
      const otherNames = otherMembers.map(m => {
        const isHost = m.userId === party.creatorId;
        return isHost ? `${m.nickname}(${language === 'ru' ? 'хост' : 'host'})` : m.nickname;
      }).join(', ');
      
      result = result ? `${result} ${language === 'ru' ? 'и' : 'and'} ${otherNames}` : otherNames;
    }
    
    return result;
  };

  const handleCreateParty = async () => {
    // Check if user is authenticated
    if (!user) {
      onShowAuth();
      return;
    }

    // Check if user has a nickname
    if (!user.nickname) {
      onShowNickname();
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
            language,
          }),
        }
      );

      if (response.ok) {
        const party = await response.json();
        onCreateParty(party);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create party');
      }
    } catch (error) {
      console.error('Error creating party:', error);
      setError('Network error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinParty = async () => {
    if (!user) {
      onShowAuth();
      return;
    }

    // Check if user has a nickname
    if (!user.nickname) {
      onShowNickname();
      return;
    }

    if (!joinCode || joinCode.length !== 6) {
      setError(language === 'ru' ? 'Введите 6-значный код' : 'Enter 6-digit code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            accessCode: joinCode.toUpperCase(),
            userId: user.id,
          }),
        }
      );

      if (response.ok) {
        const party = await response.json();
        onJoinParty(party);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to join party');
      }
    } catch (error) {
      console.error('Error joining party:', error);
      setError('Network error');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-[rgb(0,0,0)] content-stretch flex flex-col items-center relative size-full">
      {/* Desktop: Side-by-side layout, Mobile: Stacked */}
      <div className="bg-black relative shrink-0 w-full lg:h-[746px]">
        <div className="flex flex-col lg:flex-row lg:justify-center size-full">
          <div className="box-border content-stretch flex flex-col lg:flex-row gap-[0] lg:gap-[32px] lg:h-[746px] items-start lg:justify-center lg:px-[48px] lg:py-[16px] relative w-full">
            
            {/* Create Party Container */}
            <div className="w-full lg:basis-0 bg-black lg:grow lg:min-h-px lg:min-w-px relative lg:shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[8px] items-center lg:items-start not-italic relative shrink-0 w-full text-center lg:text-left">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                        {language === 'ru' ? 'Создать лобби' : 'Create lobby'}
                      </p>
                      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                        <p className="leading-[1.4]">
                          {language === 'ru' ? 'Пригласите своих друзей' : 'Invite your friends to participate'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCreateParty}
                      disabled={isCreating}
                      className="bg-neutral-100 relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                          {isCreating
                            ? (language === 'ru' ? 'Создание...' : 'Creating...')
                            : (language === 'ru' ? 'Создать' : 'Create')}
                        </p>
                      </div>
                      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect Container */}
            <div className="w-full lg:basis-0 bg-black lg:grow lg:min-h-px lg:min-w-px relative lg:shrink-0">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-center lg:items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[8px] items-center lg:items-start not-italic relative shrink-0 w-full text-center lg:text-left">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                        {language === 'ru' ? 'Подключиться' : 'Connect'}
                      </p>
                      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                        <p className="leading-[1.4]">
                          {language === 'ru' ? 'Если кто-то уже отправил вам код' : 'If someone already sent you a code'}
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0">
                        <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full">
                            <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                              <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
                                <input
                                  type="text"
                                  value={joinCode}
                                  onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                                    setJoinCode(value);
                                    setError('');
                                  }}
                                  placeholder={language === 'ru' ? 'Введите код' : 'Enter code'}
                                  className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white bg-transparent border-none outline-none placeholder:text-[rgba(255,255,255,0.4)]"
                                />
                              </div>
                            </div>
                            <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleJoinParty}
                        disabled={isJoining || joinCode.length !== 6}
                        className="bg-[#383838] relative rounded-[8px] shrink-0 h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit] h-full">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">
                            {isJoining
                              ? (language === 'ru' ? 'Загрузка...' : 'Loading...')
                              : (language === 'ru' ? 'Подключить' : 'Connect')}
                          </p>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      </button>
                    </div>

                    {/* Show lobbies only if user is logged in and has lobbies */}
                    {user && userLobbies.length > 0 && (
                      <>
                        {/* Divider */}
                        <div className="h-0 relative shrink-0 w-full">
                          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 544 1">
                              <line stroke="#444444" x2="544" y1="0.5" y2="0.5" />
                            </svg>
                          </div>
                        </div>

                        {/* You've played here earlier text */}
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
                            <p className="leading-[1.4]">
                              {language === 'ru' ? 'Вы играли здесь раньше' : 'You\'ve played here earlier'}
                            </p>
                          </div>
                        </div>

                        {/* Lobby cards */}
                        {isLoadingLobbies ? (
                          <div className="flex items-center justify-center w-full py-8">
                            <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[rgba(255,255,255,0.7)]">
                              {language === 'ru' ? 'Загрузка...' : 'Loading...'}
                            </p>
                          </div>
                        ) : (
                          userLobbies.map((lobby) => (
                            <div
                              key={lobby.partyUid}
                              className="bg-[#1e1e1e] min-w-[240px] relative rounded-[8px] shrink-0 w-full"
                            >
                              <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
                              <div className="min-w-inherit size-full">
                                <div className="box-border content-start flex flex-wrap gap-[24px] items-start min-w-inherit p-[16px] relative w-full">
                                  <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-[160px] relative shrink-0">
                                    {/* Text */}
                                    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-full">
                                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">
                                        {lobby.accessCode}
                                      </p>
                                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                                        {formatMembersList(lobby)}
                                      </p>
                                    </div>
                                    {/* Button Group - mobile stacked, desktop horizontal */}
                                    <div className="content-stretch flex flex-col lg:flex-row gap-[8px] items-center lg:items-start relative shrink-0 w-full">
                                      <button
                                        onClick={() => handleRejoinLobby(lobby)}
                                        className="bg-neutral-100 lg:basis-0 lg:grow lg:min-h-px lg:min-w-px relative rounded-[8px] shrink-0 w-full"
                                      >
                                        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                                          <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                                            <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                                              {language === 'ru' ? 'Войти' : 'Enter'}
                                            </p>
                                          </div>
                                        </div>
                                        <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
                                      </button>
                                      <button
                                        onClick={(e) => handleLeaveLobby(lobby, e)}
                                        disabled={leavingLobby === lobby.partyUid}
                                        className="bg-[#c00f0c] relative rounded-[8px] shrink-0 w-full lg:w-[128px] disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                                          <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative lg:w-[128px]">
                                            <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">
                                              {leavingLobby === lobby.partyUid
                                                ? (language === 'ru' ? 'Загрузка...' : 'Loading...')
                                                : (language === 'ru' ? 'Выйти' : 'Leave')}
                                            </p>
                                          </div>
                                        </div>
                                        <div aria-hidden="true" className="absolute border border-[#f4776a] border-solid inset-0 pointer-events-none rounded-[8px]" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-black relative shrink-0 w-full">
          <div className="flex flex-col items-center size-full">
            <div className="box-border content-stretch flex flex-col items-center px-[16px] pb-[16px] relative w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic text-[14px] text-center text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}