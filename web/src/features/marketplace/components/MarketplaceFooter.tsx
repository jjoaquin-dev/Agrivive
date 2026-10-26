import { PageContainer } from "@/src/components/PageContainer";

export function MarketplaceFooter() {
  return (
    <footer className="mt-16 border-t border-[#457D00]/20 bg-[#142B20] text-white">
      <PageContainer className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <div className="flex items-center gap-1.5">
          <img
            src="/brand/agrivive-logo-crate-dark.png"
            alt="Agrivive"
            className="size-7 object-contain"
          />
          <span className="font-heading text-sm font-bold text-white">
            Agrivive
          </span>
          <span className="hidden text-xs text-white/60 sm:inline">
            • Helping Davao&apos;s local farmers reach more tables
          </span>
        </div>
        <p className="text-xs text-white/70">
          Fresh produce, fair prices. Less waste.
        </p>
      </PageContainer>
    </footer>
  );
}
