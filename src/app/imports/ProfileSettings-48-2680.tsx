import svgPaths from "./svg-5tvcp4cd93";

function MenuHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Menu Header">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col items-start leading-[1.4] not-italic p-[8px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[16px] text-white w-[264px]">Slava</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[14px] text-[rgba(255,255,255,0.7)] w-[min-content]">iamvdtlv@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

function MenuSeparator() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-center px-0 py-[8px] relative shrink-0 w-full" data-name="Menu Separator">
      <div className="bg-[#444444] h-px shrink-0 w-full" data-name="Rule" />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Row">
      <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">Log out</p>
    </div>
  );
}

function Body() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Body">
      <Row />
    </div>
  );
}

function MenuItem() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-start overflow-clip px-0 py-[4px] relative rounded-[8px] shrink-0 w-full" data-name="Menu Item">
      <Body />
    </div>
  );
}

function MenuSection() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Menu Section">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col items-start p-[8px] relative w-full">
          <MenuItem />
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute bg-[#1e1e1e] bottom-[24px] left-[24px] rounded-[8px] w-[312px] z-[6]" data-name="Menu">
      <div className="box-border content-stretch flex flex-col items-start overflow-clip px-[16px] py-[8px] relative rounded-[inherit] w-[312px]">
        <MenuHeader />
        <MenuSeparator />
        <MenuSection />
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" />
    </div>
  );
}

function LogoContainer() {
  return (
    <div className="absolute h-[40px] left-[16px] top-1/2 translate-y-[-50%] w-[80px]" data-name="Logo Container">
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
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">EN</p>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="User">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_48_1934)" id="User">
          <path d={svgPaths.p205c98f0} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_48_1934">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0 w-[36px]" data-name="Icon Button">
      <div className="box-border content-stretch flex items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit] w-[36px]">
        <User />
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function LoginButton() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center right-[16px] top-1/2 translate-y-[-50%]" data-name="Login Button">
      <Button />
      <IconButton />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black h-[56px] relative shrink-0 w-full z-[4]" data-name="Footer">
      <LogoContainer />
      <LoginButton />
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 bg-[#303030] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Quick Play</p>
        </div>
      </div>
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

function Button2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[2px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">Multiplayer</p>
          <Lock />
        </div>
      </div>
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="bg-black relative shrink-0 w-full z-[3]" data-name="Button Group">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center px-[12px] py-[8px] relative w-full">
          <Button1 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function TextContentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-full" data-name="Text Content Heading">
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
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Select Field">
      <Select />
    </div>
  );
}

function ArticleSelector() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[328px]" data-name="Article Selector">
      <SelectField />
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
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Select Field">
      <Select1 />
    </div>
  );
}

function ArticleSelector1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[328px]" data-name="Article Selector">
      <SelectField1 />
    </div>
  );
}

function Button3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">Swap articles</p>
        </div>
      </div>
    </div>
  );
}

function InputContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Input Container">
      <ArticleSelector />
      <ArticleSelector1 />
      <Button3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Launch game</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading />
      <InputContainer />
      <Button4 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-black relative shrink-0 w-full z-[2]" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full">
          <QuickPlayContainer />
        </div>
      </div>
    </div>
  );
}

function TextContentHeading1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-full" data-name="Text Content Heading">
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
      <div className="basis-0 flex flex-col font-['Inter:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">
        <p className="leading-[1.4]">Primera División 1958 → Minnesota Lynx 2008</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Launch</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function PromptItem() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Prompt Item">
      <PromptText />
      <Button5 />
    </div>
  );
}

function PromptsList() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Prompts List">
      <PromptItem />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="328" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="328" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="328" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <PromptItem />
    </div>
  );
}

function RecommendedPromptsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Recommended Prompts Container">
      <TextContentHeading1 />
      <PromptsList />
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full" data-name="Content Container">
      <RecommendedPromptsContainer />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-black relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
          <ContentContainer />
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-center relative size-full" data-name="Profile settings">
      <Menu />
      <div className="absolute bg-[rgba(0,0,0,0.7)] h-[952px] left-0 top-0 w-[360px] z-[5]" />
      <Footer />
      <ButtonGroup />
      <Container />
      <Container1 />
    </div>
  );
}