import { useState, useEffect } from 'react';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HostLaunchScreenProps {
  language: Language;
  user: User;
  partyUid: string;
  startArticle: string;
  endArticle: string;
  onBack: () => void;
  onLaunch: () => void;
}

export default function HostLaunchScreen({
  language,
  user,
  partyUid,
  startArticle,
  endArticle,
  onBack,
  onLaunch,
}: HostLaunchScreenProps) {
  const [memberCount, setMemberCount] = useState(1);
  const [isLaunching, setIsLaunching] = useState(false);

  // Poll for party member updates
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
          setMemberCount(party.members.length);
        }
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    fetchPartyDetails();
    const interval = setInterval(fetchPartyDetails, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [partyUid]);

  const handleLaunch = async () => {
    setIsLaunching(true);

    try {
      console.log('🚀 Host launching game for party:', partyUid);
      
      // Start the party game
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-92321c2f/party/${partyUid}/start`,
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
        const result = await response.json();
        console.log('✅ Party started successfully:', result);
        onLaunch();
      } else {
        const error = await response.text();
        console.error('❌ Failed to start party:', error);
      }
    } catch (error) {
      console.error('Error launching party game:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full">
      {/* Container */}
      <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col items-center justify-between px-[16px] py-[136px] relative size-full">
            {/* Goal Container */}
            <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
              {/* Goal Circle */}
              <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[19px] py-[57px] relative rounded-[101.5px] shrink-0 size-[200px]">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">
                  {memberCount} {language === 'ru' ? (memberCount === 1 ? 'игрок присоединился' : 'игроков присоединилось') : (memberCount === 1 ? 'player joined' : 'players joined')}
                </p>
              </div>
              <p className="-webkit-box font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                {startArticle} → {endArticle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex gap-[8px] items-center pb-[16px] pt-0 px-[16px] relative w-full">
            <button
              onClick={onBack}
              className="bg-[#303030] relative rounded-[8px] shrink-0"
            >
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                  {language === 'ru' ? 'Назад' : 'Go back'}
                </p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="basis-0 bg-neutral-100 grow min-h-px min-w-px relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
                    {isLaunching ? (language === 'ru' ? 'Запуск...' : 'Launching...') : (language === 'ru' ? 'Запустить игру' : 'Launch game')}
                  </p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}