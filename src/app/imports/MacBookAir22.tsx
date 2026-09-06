function Container() {
  return (
    <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[8px] relative size-full">
          <div className="basis-0 bg-white grow min-h-px min-w-px rounded-[32px] shrink-0 w-full" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function GoalInfo() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow h-[42px] items-start leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-nowrap" data-name="Goal Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">Goal</p>
      <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">Goal page title</p>
    </div>
  );
}

function ClicksInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre" data-name="Clicks Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Clicks</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">0</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chevron down">
          <path d="M5 7.5L10 12.5L15 7.5" id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0" data-name="Icon Button">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[inherit]">
        <ChevronDown />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function LoginButton() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[328px]" data-name="Login Button">
      <GoalInfo />
      <ClicksInfo />
      <IconButton />
    </div>
  );
}

function CurrentPageInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[198px]" data-name="Current Page Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">Current Page</p>
      <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">Goal page title</p>
    </div>
  );
}

function TimeInfo() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre" data-name="Time Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Time Elapsed</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">0:01.12</p>
    </div>
  );
}

function LinksClickedInfo() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-[328px]" data-name="Links Clicked Info">
      <CurrentPageInfo />
      <TimeInfo />
    </div>
  );
}

function ButtonDanger() {
  return (
    <div className="bg-[#ec221f] relative rounded-[8px] shrink-0 w-full" data-name="Button Danger">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">Give up</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c00f0c] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-center pb-[16px] pt-[8px] px-[16px] relative w-full">
          <LoginButton />
          <LinksClickedInfo />
          <ButtonDanger />
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="MacBook Air - 22">
      <Container />
      <Footer />
    </div>
  );
}