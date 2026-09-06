import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-zv4i9x4x1f';
import Logo from './Logo';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PlayerPartyScreenProps {
  language: Language;
  user: User;
  partyUid: string;
  accessCode: string;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  onReady: () => void;
  onLeave: () => void;
}

interface PartyMember {
  userId: string;
  nickname: string;
}

interface GameHistory {
  startArticle: string;
  endArticle: string;
  completedAt: string;
  results: any[];
}

export default function PlayerPartyScreen({
  language,
  user,
  partyUid,
  accessCode,
  onLanguageChange,
  onBack,
  onReady,
  onLeave,
}: PlayerPartyScreenProps) {
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [creatorId, setCreatorId] = useState('');
  const [hostIsLaunching, setHostIsLaunching] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

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
          setCreatorId(party.creatorId);
          setGameHistory(party.gameHistory || []);
          
          // Check if host has selected articles (ready to launch)
          setHostIsLaunching(party.startArticle && party.endArticle);
          
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

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
  };

  const handleLeave = async () => {
    setIsLeaving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/${partyUid}/leave`,
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
        onLeave();
      }
    } catch (error) {
      console.error('Error leaving party:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="bg-black content-stretch flex flex-col items-center relative size-full">
      {/* Host is launching message (if ready) */}
      {hostIsLaunching && (
        <div className="bg-black relative shrink-0 w-full">
          <div className="flex flex-col items-center size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
              <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[328px]">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
                    <p className="leading-[1.4]">
                      {language === 'ru' ? 'Хост запускает игру' : 'Host is launching a game'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onReady}
                  className="bg-neutral-100 relative rounded-[8px] shrink-0"
                >
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                      {language === 'ru' ? 'Я готов' : 'I am ready'}
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
      )}

      {/* Access Code Container */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
                <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
                  <p className="leading-[1.4]">
                    {language === 'ru' ? 'Поделитесь этим кодом с дру��ьями' : 'Share this code with your friends'}
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
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap w-full"
                >
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                    <div className="flex flex-col justify-center relative shrink-0 text-white">
                      <p className="leading-[1.4] text-nowrap whitespace-pre">{member.nickname}</p>
                    </div>
                    {member.userId === user.id && (
                      <div className="flex flex-col justify-center relative shrink-0 text-[#b2b2b2]">
                        <p className="leading-[1.4] text-nowrap whitespace-pre">{language === 'ru' ? 'Вы' : 'You'}</p>
                      </div>
                    )}
                  </div>
                  {member.userId === creatorId && (
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

      {/* Played Games */}
      {gameHistory.length > 0 && (
        <div className="bg-black relative shrink-0 w-full">
          <div className="flex flex-col items-center size-full">
            <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]">
                <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full">
                  <div className="content-stretch flex items-start relative shrink-0 w-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                      {language === 'ru' ? 'Сыгранные игры' : 'Played games'}
                    </p>
                  </div>
                </div>
                {gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="content-stretch flex items-center relative shrink-0 w-full"
                  >
                    <p className="-webkit-box font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                      {game.startArticle} → {game.endArticle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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

            <button
              onClick={handleLeave}
              disabled={isLeaving}
              className="bg-[#c00f0c] relative rounded-[8px] shrink-0 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">
                    {isLeaving
                      ? (language === 'ru' ? 'Загрузка...' : 'Loading...')
                      : (language === 'ru' ? 'Выйти из лобби' : 'Leave party')}
                  </p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#f4776a] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}