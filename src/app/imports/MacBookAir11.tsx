function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 rounded-[101.5px] size-[200px]" data-name="Background" />
      <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold leading-[1.2] ml-[100px] mt-[71px] not-italic relative text-[48px] text-black text-center text-nowrap tracking-[-0.96px] translate-x-[-50%] whitespace-pre">🏆</p>
    </div>
  );
}

function GoalInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-center justify-center relative shrink-0 w-[268px]" data-name="Goal Info">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">You won!</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[128px] whitespace-pre">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Time Elapsed</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">0:01.12</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap w-[128px] whitespace-pre">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#757575]">Clicks</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-white">5</p>
    </div>
  );
}

function LoginButton() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-[328px]" data-name="Login Button">
      <Frame1 />
      <Frame />
    </div>
  );
}

function LoginButton1() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-[362px]" data-name="Login Button">
      <p className="-webkit-box basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-center text-white">
        <span>{`Start page title `}</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[#5a5a5a]">→ Link title 1 → Link title 2 → Link title 3 → Link title 4 →</span>
        <span>{` Goal page title`}</span>
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-[640px]">
      <Group />
      <GoalInfo />
      <LoginButton />
      <LoginButton1 />
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-between px-[16px] py-[136px] relative size-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 bg-black grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[16px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#2c2c2c] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-neutral-100 text-nowrap whitespace-pre">Play again</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-black relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-[16px] pt-0 px-[48px] relative w-full">
          <Button />
        </div>
      </div>
    </div>
  );
}

export default function MacBookAir() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="MacBook Air - 11">
      <Container1 />
      <Footer />
    </div>
  );
}