import svgPaths from "./svg-w7zzw5ie2e";

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
    <div className="bg-black h-[56px] relative shrink-0 w-full" data-name="Footer">
      <LogoContainer />
      <LoginButton />
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">Quick Play</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 bg-[#303030] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[2px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Multiplayer</p>
        </div>
      </div>
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Button Group">
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
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Create party</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Invite your friends to participate</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[32px] py-[16px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">Create</p>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading />
      <Button3 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
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

function Button4() {
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
      <Button4 />
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

function Button5() {
  return (
    <div className="bg-neutral-100 relative rounded-[8px] shrink-0 w-full" data-name="Button">
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
    <div className="bg-[#c00f0c] relative rounded-[8px] shrink-0 w-full" data-name="Button Danger">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#fee9e7] text-[16px] text-nowrap whitespace-pre">Leave</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4776a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ButtonGroup1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Button Group">
      <Button5 />
      <ButtonDanger />
    </div>
  );
}

function Body() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-[160px] relative shrink-0" data-name="Body">
      <Text />
      <ButtonGroup1 />
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
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 328 1">
            <line id="Line 1" stroke="var(--stroke-0, #444444)" x2="328" y1="0.5" y2="0.5" />
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
    <div className="bg-black relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[16px] py-[48px] relative w-full">
          <QuickPlayContainer1 />
        </div>
      </div>
    </div>
  );
}

export default function MultiplayerMobile() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Multiplayer mobile">
      <Footer />
      <ButtonGroup />
      <Container />
      <Container1 />
    </div>
  );
}