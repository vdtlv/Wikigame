function Container() {
  return (
    <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
          <div className="basis-0 bg-white grow min-h-px min-w-px rounded-[32px] shrink-0 w-full" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function GoalInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]" data-name="Goal Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">Goal</p>
      <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">Goal page title</p>
    </div>
  );
}

function LinksClickedInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre" data-name="Links Clicked Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Links clicked</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">0</p>
    </div>
  );
}

function TimeElapsedInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre" data-name="Time Elapsed Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Time Elapsed</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">0:01.12</p>
    </div>
  );
}

function CurrentPageInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]" data-name="Current Page Info">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">Current Page</p>
      <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">Goal page title</p>
    </div>
  );
}

function LoginButton() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Login Button">
      <GoalInfo />
      <LinksClickedInfo />
      <TimeElapsedInfo />
      <CurrentPageInfo />
    </div>
  );
}

function ButtonDanger() {
  return (
    <div className="bg-[#ec221f] relative rounded-[8px] shrink-0" data-name="Button Danger">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">Give up</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c00f0c] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-[16px] pt-0 px-[48px] relative w-full">
          <LoginButton />
          <ButtonDanger />
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="MacBook Air - 1">
      <Container />
      <Footer />
    </div>
  );
}