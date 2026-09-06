function GoalCircle() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-[19px] py-[57px] relative rounded-[101.5px] shrink-0 size-[200px]" data-name="Goal circle">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">2 players joined</p>
    </div>
  );
}

function GoalContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0" data-name="Goal container">
      <GoalCircle />
      <p className="-webkit-box font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Start page title→ Goal page title</p>
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-between px-[16px] py-[136px] relative size-full">
          <GoalContainer />
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

export default function PlayerLaunchScreen() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start relative size-full" data-name="Player launch screen">
      <Container />
      <Footer />
    </div>
  );
}