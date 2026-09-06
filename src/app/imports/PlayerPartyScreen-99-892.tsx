import svgPaths from "./svg-61ibn2ge8b";

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
        <g id="User">
          <path d={svgPaths.p39e64980} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[32px] shrink-0" data-name="Icon Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
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
    <div className="bg-black h-[56px] relative shrink-0 w-full" data-name="Footer">
      <LogoContainer />
      <LoginButton />
    </div>
  );
}

function TextContentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[328px]" data-name="Text Content Heading">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
        <p className="leading-[1.4]">Host is launching a game</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">I am ready</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function QuickPlayContent() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] items-center px-0 py-[48px] relative shrink-0" data-name="Quick Play Content">
      <TextContentHeading />
      <Button1 />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <QuickPlayContent />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="328" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
          <QuickPlayContainer />
        </div>
      </div>
    </div>
  );
}

function Copy() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Copy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_48_3379)" id="Copy">
          <path d={svgPaths.p3a92e900} id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_48_3379">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[32px] shrink-0" data-name="Icon Button">
      <Copy />
    </div>
  );
}

function CodeContainer() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Code Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[24px] text-center text-nowrap text-white tracking-[-0.48px] whitespace-pre">ABCDE</p>
      <IconButton1 />
    </div>
  );
}

function TextContentHeading1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Text Content Heading">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Share this code with your friends</p>
      </div>
      <CodeContainer />
    </div>
  );
}

function QuickPlayContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
          <QuickPlayContainer1 />
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Title">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Connected players</p>
    </div>
  );
}

function Title1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full" data-name="Title">
      <Title />
    </div>
  );
}

function PlayerInfo() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[187px]" data-name="Player Info">
      <div className="flex flex-col justify-center relative shrink-0 text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Slava</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#b2b2b2]">
        <p className="leading-[1.4] text-nowrap whitespace-pre">You</p>
      </div>
    </div>
  );
}

function TextLinkListItem() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap w-full" data-name="Text Link List Item">
      <PlayerInfo />
      <div className="flex flex-col justify-center relative shrink-0 text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Host</p>
      </div>
    </div>
  );
}

function PlayerInfo1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[187px]" data-name="Player Info">
      <div className="flex flex-col justify-center relative shrink-0 text-white">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Lena</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">You</p>
      </div>
    </div>
  );
}

function TextLinkListItem1() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal items-center justify-between leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap w-full" data-name="Text Link List Item">
      <PlayerInfo1 />
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[1.4] text-nowrap whitespace-pre">Host</p>
      </div>
    </div>
  );
}

function PromptText() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]" data-name="Prompt Text">
      <Title1 />
      <TextLinkListItem />
      <TextLinkListItem1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
          <PromptText />
        </div>
      </div>
    </div>
  );
}

function PlayedGamesTitle() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Played Games Title">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Played games</p>
    </div>
  );
}

function Title2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full" data-name="Title">
      <PlayedGamesTitle />
    </div>
  );
}

function TextLinkListItem2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Text Link List Item">
      <p className="-webkit-box font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Start page title → Goal page title</p>
    </div>
  );
}

function PromptText1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]" data-name="Prompt Text">
      <Title2 />
      <TextLinkListItem2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center p-[16px] relative w-full">
          <PromptText1 />
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Go back</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Footer1() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-center pb-[16px] pt-[8px] px-[16px] relative w-full">
          <Button2 />
        </div>
      </div>
    </div>
  );
}

export default function PlayerPartyScreen() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Player party screen">
      <Footer />
      <Container />
      <Container1 />
      <Container2 />
      <Container3 />
      <Footer1 />
    </div>
  );
}