import svgPaths from "./svg-cidqrpxxxc";

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
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Close</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function LoginButton() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center right-[16px] top-1/2 translate-y-[-50%]" data-name="Login Button">
      <Button />
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
    <div className="content-stretch flex flex-col gap-[8px] items-center not-italic relative shrink-0 text-center w-[328px]" data-name="Text Content Heading">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[24px] text-white tracking-[-0.48px] w-full">Almost ready</p>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] w-full">
        <p className="leading-[1.4]">Enter a code from email</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#1e1e1e] min-w-[120px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.4)]">Your code</p>
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Article Selector">
      <InputField />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#383838] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[32px] py-[16px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#b3b3b3] text-[16px] text-nowrap whitespace-pre">Continue</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[328px]" data-name="Input Container">
      <ArticleSelector />
      <Button1 />
    </div>
  );
}

function QuickPlayContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0" data-name="Quick Play Container">
      <TextContentHeading />
      <InputContainer />
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

export default function LoginOrSignInCode() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Login or sign in – code">
      <Footer />
      <Container />
    </div>
  );
}