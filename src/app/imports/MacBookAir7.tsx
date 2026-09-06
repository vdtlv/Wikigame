function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 rounded-[101.5px] size-[200px]" data-name="Background" />
      <p className="[grid-area:1_/_1] font-['Inter:Bold',sans-serif] font-bold leading-[1.2] ml-[76px] mt-[57px] not-italic relative text-[72px] text-black text-nowrap tracking-[-2.16px] whitespace-pre">3</p>
    </div>
  );
}

function GoalInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[42px] items-center justify-center relative shrink-0 w-[268px]" data-name="Goal Info">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Loading...</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0">
      <Group />
      <GoalInfo />
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-between px-[16px] py-[136px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#303030] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[12px] relative rounded-[inherit]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Leave</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#949494] border-solid inset-0 pointer-events-none rounded-[8px]" />
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
    <div className="bg-black content-stretch flex flex-col items-start relative size-full" data-name="MacBook Air - 7">
      <Container />
      <Footer />
    </div>
  );
}