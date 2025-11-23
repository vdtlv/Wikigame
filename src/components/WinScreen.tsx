import { Language } from '../App';
import { getTranslation } from '../translations';

interface WinScreenProps {
  startArticle: string;
  endArticle: string;
  linksClicked: number;
  timeElapsed: string;
  navigationPath: string[];
  onPlayAgain: () => void;
  language: Language;
}

export default function WinScreen({
  startArticle,
  endArticle,
  linksClicked,
  timeElapsed,
  navigationPath,
  onPlayAgain,
  language
}: WinScreenProps) {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full">
      {/* Container */}
      <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] lg:p-[16px] relative size-full">
            <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col items-center justify-center px-[16px] py-[48px] lg:py-[136px] relative size-full">
                  {/* Main content */}
                  <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full max-w-[640px]">
                    {/* Trophy Icon */}
                    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                      <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 rounded-[101.5px] size-[200px]" />
                      <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold leading-[1.2] ml-[100px] mt-[71px] not-italic relative text-[48px] text-black text-center text-nowrap tracking-[-0.96px] translate-x-[-50%] whitespace-pre">
                        🏆
                      </p>
                    </div>

                    {/* You Won Text */}
                    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-center justify-center relative shrink-0 w-[268px]">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
                        {getTranslation(language, 'youWon')}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full max-w-[328px]">
                      {/* Time Elapsed */}
                      <div className="content-stretch flex flex-col gap-[4px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap flex-1 whitespace-pre">
                        <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">
                          {getTranslation(language, 'timeElapsed')}
                        </p>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">
                          {timeElapsed}
                        </p>
                      </div>

                      {/* Clicks */}
                      <div className="content-stretch flex flex-col gap-[4px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap flex-1 whitespace-pre">
                        <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">
                          {getTranslation(language, 'clicks')}
                        </p>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">
                          {linksClicked}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Path */}
                    <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full max-w-[640px] px-4">
                      <p className="-webkit-box basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-center text-white">
                        <span>{startArticle}</span>
                        {navigationPath.slice(1, -1).map((article, index) => (
                          <span key={index} className="font-['Inter:Regular',sans-serif] font-normal text-[#5a5a5a]">
                            {' → ' + article}
                          </span>
                        ))}
                        <span className="font-['Inter:Regular',sans-serif] font-normal text-[#5a5a5a]"> → </span>
                        <span>{endArticle}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center justify-center pb-[16px] pt-0 px-[16px] lg:px-[48px] relative w-full">
            <button
              onClick={onPlayAgain}
              className="bg-[#2c2c2c] relative rounded-[8px] shrink-0 hover:bg-[#3c3c3c] transition-colors"
            >
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">
                  {getTranslation(language, 'playAgain')}
                </p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}