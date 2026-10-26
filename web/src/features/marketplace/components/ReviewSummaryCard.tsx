import { Star } from "lucide-react";
import { RatingStars } from "@/src/components/RatingStars";

type ReviewSummaryCardProps = {
  average: string | null;
  count: number;
  breakdown: Record<number, number>;
  singular: "rating" | "review";
};

export function ReviewSummaryCard({ average, count, breakdown, singular }: ReviewSummaryCardProps) {
  const averageNumber = Number(average ?? 0);

  return (
    <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
      <div className="text-center">
        <p className="font-heading text-[36px] font-bold leading-tight text-[#14231A]">
          {averageNumber.toFixed(1)}
        </p>
        <div className="mt-1.5 flex justify-center">
          <RatingStars rating={averageNumber} large />
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Based on {count} verified {count === 1 ? singular : `${singular}s`}
        </p>
      </div>
      <div className="mt-5 space-y-2 border-t border-[#E8E8E8] pt-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const starCount = breakdown[star] ?? 0;
          const percent = count > 0 ? (starCount / count) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-[12px]">
              <span className="w-3 text-right font-medium text-foreground">{star}</span>
              <Star aria-hidden="true" className="size-3 fill-amber-400 text-amber-400" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F0F0]">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{starCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
