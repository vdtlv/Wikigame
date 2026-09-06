import svgPaths from "./svg-5smecte5v7";

function Logo() {
  return (
    <div className="absolute h-[33.645px] left-[6.12px] top-[1.26px] w-[62.237px]" data-name="Logo">
      <div className="absolute bottom-[-11.37%] left-[-4.4%] right-[-5.6%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 38">
          <g id="Logo">
            <path d={svgPaths.p1d233400} fill="var(--stroke-0, #2C2C2C)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function LogoContainer() {
  return (
    <div className="relative size-full" data-name="Logo Container">
      <Logo />
    </div>
  );
}