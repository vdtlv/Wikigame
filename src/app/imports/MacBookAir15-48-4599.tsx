import svgPaths from "./svg-s3u8refdqj";

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
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#e3e3e3] text-[16px] text-nowrap whitespace-pre">Quick Play</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#303030] box-border content-stretch flex gap-[2px] items-center justify-center overflow-clip p-[12px] relative rounded-[8px] shrink-0" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Multiplayer</p>
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
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 w-full" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Create lobby</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Invite your friends to participate</p>
      </div>
    </div>
  );
}

function Button4() {
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
      <Button4 />
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

function Button5() {
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
      <Button5 />
    </div>
  );
}

function QuickPlayContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Quick Play Container">
      <TextContentHeading1 />
      <ConnectContainer />
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

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="MacBook Air - 15">
      <Header />
      <Container2 />
    </div>
  );
}