import svgPaths from "./svg-xyxf6mcmtj";

function LogoContainer() {
  return (
    <div className="absolute h-[40px] left-[48px] top-1/2 translate-y-[-50%] w-[80px]" data-name="Logo Container">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 40">
        <g id="Logo Container">
          <path clipRule="evenodd" d={svgPaths.p3b36bf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Login Button">
      <Button />
      <IconButton />
    </div>
  );
}

function LoginButton1() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center right-[48px] top-1/2 translate-y-[-50%]" data-name="Login Button">
      <LoginButton />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-black h-[86px] relative shrink-0 w-full" data-name="Header">
      <LogoContainer />
      <LoginButton1 />
    </div>
  );
}

function TextContentHeading() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-full" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Create lobby</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Invite your friends to participate</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Create</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading />
      <Button1 />
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0" data-name="Container">
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
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-full" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Connect</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">If someone already sent you a code</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">Enter code</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
    </div>
  );
}

function InputField() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Input Field">
      <Input />
    </div>
  );
}

function ArticleSelector() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Article Selector">
      <InputField />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#383838] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">Connect</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ConnectContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Connect Container">
      <ArticleSelector />
      <Button2 />
    </div>
  );
}

function TextContentHeading2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Text Content Heading">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] text-center w-full">
        <p className="leading-[1.4]">You’ve played here earlier</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-full" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">ABCDE</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">You and Slava(host)</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 bg-neutral-100 grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Enter</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ButtonDanger() {
  return (
    <div className="bg-[#c00f0c] relative rounded-[8px] shrink-0 w-[128px]" data-name="Button Danger">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit] w-[128px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">Leave</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4776a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Button Group">
      <Button3 />
      <ButtonDanger />
    </div>
  );
}

function Body() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-[160px] relative shrink-0" data-name="Body">
      <Text />
      <ButtonGroup />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#1e1e1e] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="min-w-inherit size-full">
        <div className="box-border content-start flex flex-wrap gap-[24px] items-start min-w-inherit p-[16px] relative w-full">
          <Body />
        </div>
      </div>
    </div>
  );
}

function QuickPlayContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading1 />
      <ConnectContainer />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(68, 68, 68, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 544 1">
            <line id="Line 4" stroke="var(--stroke-0, #444444)" x2="544" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <TextContentHeading2 />
      <Card />
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full">
          <QuickPlayContainer1 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-black h-[746px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="box-border content-stretch flex gap-[32px] h-[746px] items-start justify-center px-[48px] py-[16px] relative w-full">
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

export default function MultiplayerDesktop() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Multiplayer desktop">
      <Header />
      <Container2 />
    </div>
  );
}