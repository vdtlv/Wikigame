import { useState, useEffect } from 'react';
import { Language, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PlayerLaunchScreenProps {
  language: Language;
  user: User;
  partyUid: string;
  onLeave: () => void;
  onGameStarted: (startArticle: string, endArticle: string) => void;
}

export default function PlayerLaunchScreen({
  language,
  user,
  partyUid,
  onLeave,
  onGameStarted,
}: PlayerLaunchScreenProps) {
  const [memberCount, setMemberCount] = useState(1);
  const [startArticle, setStartArticle] = useState('');
  const [endArticle, setEndArticle] = useState('');

  // Poll for party updates to detect when game starts
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
          
          if (party.startArticle) setStartArticle(party.startArticle);
          if (party.endArticle) setEndArticle(party.endArticle);
          
          // Check if host started the game
          if (party.status === 'in_progress' && party.startArticle && party.endArticle) {
            onGameStarted(party.startArticle, party.endArticle);
          }
        }
      } catch (error) {
        console.error('Error fetching party details:', error);
      }
    };

    fetchPartyDetails();
    const interval = setInterval(fetchPartyDetails, 1000); // Poll every second for quick response

    return () => clearInterval(interval);
  }, [partyUid, onGameStarted]);

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
              {startArticle && endArticle && (
                <p className="-webkit-box font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-center text-nowrap text-white whitespace-pre">
                  {startArticle} → {endArticle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center justify-between pb-[16px] pt-0 px-[48px] relative w-full">
            <button
              onClick={onLeave}
              className="bg-[#303030] relative rounded-[8px] shrink-0"
            >
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                  {language === 'ru' ? 'Выйти' : 'Leave'}
                </p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
