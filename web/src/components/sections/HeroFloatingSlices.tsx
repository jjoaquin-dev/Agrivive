import Image from "next/image";

export function HeroFloatingSlices() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Left Side Produce */}
      <div className="hero-slice absolute top-[7%] sm:top-[11%] left-[2%] sm:left-[8%] lg:left-[11%] w-[72px] sm:w-[168px] md:w-[192px] lg:w-[216px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-95">
        <div className="float-slice-1 w-full h-full">
          <Image src="/brand/slice-tomato-wheel.png" alt="Juicy red tomato slice" width={216} height={216} className="w-full h-auto object-contain -rotate-[16deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[22%] sm:top-[24%] -left-2 sm:left-[3%] lg:left-[4%] w-[54px] sm:w-[112px] md:w-[136px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
        <div className="float-slice-2 w-full h-full">
          <Image src="/brand/slice-cucumber-real.png" alt="Fresh green cucumber slice" width={136} height={136} className="w-full h-auto object-contain rotate-[18deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[48%] sm:top-[44%] -left-3.5 sm:left-[6%] lg:left-[7%] w-[64px] sm:w-[136px] md:w-[168px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] opacity-85 sm:opacity-95">
        <div className="float-slice-3 w-full h-full">
          <Image src="/brand/slice-red-onion-ring.png" alt="Sliced red onion ring" width={168} height={168} className="w-full h-auto object-contain -rotate-[24deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[70%] sm:top-[66%] left-[4%] sm:left-[9%] lg:left-[12%] w-[56px] sm:w-[104px] md:w-[128px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
        <div className="float-slice-4 w-full h-full">
          <Image src="/brand/slice-carrot.png" alt="Sliced orange carrot coin" width={128} height={128} className="w-full h-auto object-contain rotate-[22deg]" />
        </div>
      </div>
      <div className="hero-slice hidden sm:block absolute top-[78%] left-[1.5%] sm:left-[3%] lg:left-[4%] w-18 sm:w-22 md:w-26 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] opacity-85">
        <div className="float-slice-5 w-full h-full">
          <Image src="/brand/slice-basil-leaf.png" alt="Fresh basil leaf" width={104} height={104} className="w-full h-auto object-contain -rotate-[32deg]" />
        </div>
      </div>

      {/* Right Side Produce */}
      <div className="hero-slice absolute top-[3%] sm:top-[4%] right-[4%] sm:right-[18%] lg:right-[22%] w-[76px] sm:w-[152px] md:w-[184px] lg:w-[200px] drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-90">
        <div className="float-slice-5 w-full h-full">
          <Image src="/brand/slice-tomato-stem.png" alt="Tomato cap with fresh green stem" width={200} height={200} className="w-full h-auto object-contain -rotate-[8deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[15%] sm:top-[16%] -right-3 sm:right-[7%] lg:right-[9%] w-[80px] sm:w-[176px] md:w-[208px] lg:w-[232px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)] opacity-85 sm:opacity-95">
        <div className="float-slice-1 w-full h-full">
          <Image src="/brand/slice-tomato.png" alt="Vibrant red tomato slice" width={232} height={232} className="w-full h-auto object-contain rotate-[14deg]" />
        </div>
      </div>
      <div className="hero-slice hidden sm:block absolute top-[18%] right-[1%] sm:right-[2%] w-20 sm:w-24 md:w-28 drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] opacity-90">
        <div className="float-slice-2 w-full h-full">
          <Image src="/brand/slice-basil-leaf.png" alt="Fresh basil leaf" width={112} height={112} className="w-full h-auto object-contain rotate-[28deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[50%] sm:top-[48%] -right-3.5 sm:right-[6%] lg:right-[8%] w-[64px] sm:w-[136px] md:w-[168px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] opacity-85 sm:opacity-95">
        <div className="float-slice-3 w-full h-full">
          <Image src="/brand/slice-red-onion-ring.png" alt="Sliced red onion ring" width={168} height={168} className="w-full h-auto object-contain rotate-[32deg]" />
        </div>
      </div>
      <div className="hero-slice absolute top-[72%] sm:top-[70%] right-[4%] sm:right-[14%] lg:right-[17%] w-[60px] sm:w-[112px] md:w-[136px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] opacity-80 sm:opacity-90">
        <div className="float-slice-6 w-full h-full">
          <Image src="/brand/slice-yellow-pepper.png" alt="Bright yellow pepper slice" width={136} height={136} className="w-full h-auto object-contain -rotate-[20deg]" />
        </div>
      </div>
      <div className="hero-slice hidden sm:block absolute top-[78%] right-[1.5%] sm:right-[2.5%] w-18 sm:w-22 md:w-26 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] opacity-85">
        <div className="float-slice-4 w-full h-full">
          <Image src="/brand/slice-cucumber-real.png" alt="Fresh cucumber slice" width={104} height={104} className="w-full h-auto object-contain rotate-[12deg]" />
        </div>
      </div>

      {/* Ambient Glows */}
      <div className="hero-glow absolute left-1/4 top-1/2 size-[480px] rounded-full bg-[#E2FD56]/10 blur-[140px]" />
      <div className="hero-glow absolute right-1/4 top-1/3 size-[520px] rounded-full bg-[#E2FD56]/15 blur-[130px]" />
    </div>
  );
}
