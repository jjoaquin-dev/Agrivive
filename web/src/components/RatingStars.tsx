import { Star } from "lucide-react";

const starValues = [1, 2, 3, 4, 5];

export function RatingStars({ rating, large = false }: { rating: number; large?: boolean }) {
  const size = large ? "size-5" : "size-4";
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {starValues.map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={`${size} ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function RatingPicker({ value, onChange, label }: {
  value: number;
  onChange: (rating: number) => void;
  label: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="mt-2 flex gap-1">
        {starValues.map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            aria-pressed={value === star}
            onClick={() => onChange(star)}
            className="flex size-11 items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star aria-hidden="true" className={`size-6 ${star <= value ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
