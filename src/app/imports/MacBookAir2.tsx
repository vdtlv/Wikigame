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

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-start leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[268px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575] whitespace-pre">Goal</p>
      <p className="[white-space-collapse:collapse] font-['Inter:Semi_Bold',sans-serif] font-semibold h-[19px] overflow-ellipsis overflow-hidden relative shrink-0 text-white w-full">Goal page title</p>
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chevron up">
          <path d="M18 15L12 9L6 15" id="Icon" stroke="var(--stroke-0, #F5F5F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0" data-name="Icon Button">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[inherit]">
        <ChevronUp />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function LoginButton() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[328px]" data-name="Login Button">
      <Frame />
      <IconButton />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start justify-center pb-[16px] pt-[8px] px-[16px] relative w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="MacBook Air - 2">
      <Container />
      <Footer />
    </div>
  );
}