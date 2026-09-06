import svgPaths from "./svg-be6c9166nu";

function Logo() {
  return (
    <div className="absolute h-[42.563px] left-[2.68px] top-[-4.9px] w-[66.945px]" data-name="Logo">
      <div className="absolute bottom-[-2.49%] left-0 right-[-3.31%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 44">
          <g id="Logo">
            <path d={svgPaths.p5d12d00} fill="var(--stroke-0, #2C2C2C)" id="Vector 1" />
            <path d={svgPaths.p3c683e00} fill="var(--stroke-0, #2C2C2C)" id="Vector 2" />
            <path d={svgPaths.p14f0b100} fill="var(--stroke-0, #2C2C2C)" id="Vector 3" />
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