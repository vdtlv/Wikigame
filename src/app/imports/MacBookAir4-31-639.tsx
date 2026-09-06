import svgPaths from "./svg-3h6239ug75";

function LogoContainer() {
  return (
    <div className="absolute h-[40px] left-[48px] top-1/2 translate-y-[-50%] w-[80px]" data-name="Logo Container">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 40">
        <g id="Logo Container">
          <path clipRule="evenodd" d={svgPaths.p29e44d00} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">EN</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Login</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function LoginButton() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center right-[48px] top-1/2 translate-y-[-50%]" data-name="Login Button">
      <Button />
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#303030] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Quick Play</p>
    </div>
  );
}

function Lock() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Lock">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_29_644)" id="Lock">
          <path d={svgPaths.pe233c00} id="Icon" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_29_644">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">Multiplayer</p>
      <Lock />
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="absolute box-border content-stretch flex gap-[16px] items-center left-[calc(50%-0.5px)] px-[12px] py-0 top-[23px] translate-x-[-50%]" data-name="Button Group">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-black h-[86px] relative shrink-0 w-full" data-name="Header">
      <LogoContainer />
      <LoginButton />
      <ButtonGroup />
    </div>
  );
}

function TextContentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-[412px]" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Quick Play</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Wondering what could possibly link Philosophy to Chuck Norris? Stop wondering and find out yourself!</p>
      </div>
    </div>
  );
}

function Shuffle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Shuffle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Shuffle">
          <path d={svgPaths.p18962d00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <div className="flex flex-row items-center min-w-inherit size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">Start Article</p>
          <Shuffle />
        </div>
      </div>
    </div>
  );
}

function SelectField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[220px]" data-name="Select Field">
      <Select />
    </div>
  );
}

function RefreshCcw() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Refresh ccw">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_29_653)" id="Refresh ccw">
          <path d={svgPaths.p191f62a0} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </g>
        <defs>
          <clipPath id="clip0_29_653">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[8px] shrink-0 size-[40px]" data-name="Icon Button">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[inherit] size-[40px]">
        <RefreshCcw />
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Shuffle1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Shuffle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Shuffle">
          <path d={svgPaths.p18962d00} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-[#1e1e1e] h-[40px] min-w-[120px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <div className="flex flex-row items-center min-w-inherit size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[40px] items-center min-w-inherit pl-[16px] pr-[12px] py-[12px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">End Article</p>
          <Shuffle1 />
        </div>
      </div>
    </div>
  );
}

function SelectField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[220px]" data-name="Select Field">
      <Select1 />
    </div>
  );
}

function ArticleSelector() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Article Selector">
      <SelectField />
      <IconButton />
      <SelectField1 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Launch game</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Quick Play Container">
      <TextContentHeading />
      <ArticleSelector />
      <Button4 />
    </div>
  );
}

function TextContentHeading1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-[412px]" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Recommended Prompts</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">{`Here's what other players have been playing recently`}</p>
      </div>
    </div>
  );
}

function PromptText() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Prompt Text">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">Primera División 1958 → Minnesota Lynx 2008</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[8px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Launch game</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function PromptItem() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Prompt Item">
      <PromptText />
      <Button5 />
    </div>
  );
}

function PromptText1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="Prompt Text">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
        <p className="leading-[1.4] whitespace-pre">Primera División 1958 → Minnesota Lynx 2008</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[8px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Launch game</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function PromptItem1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Prompt Item">
      <PromptText1 />
      <Button6 />
    </div>
  );
}

function PromptsList() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Prompts List">
      <PromptItem />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 576 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="576" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 576 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="576" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem1 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 576 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="576" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem />
    </div>
  );
}

function RecommendedPromptsContainer() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Recommended Prompts Container">
      <TextContentHeading1 />
      <PromptsList />
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="basis-0 content-stretch flex gap-[32px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Content Container">
      <QuickPlayContainer />
      <RecommendedPromptsContainer />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-black h-[746px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[746px] items-center justify-center px-[48px] py-[16px] relative w-full">
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="MacBook Air - 4">
      <Header />
      <Container />
    </div>
  );
}