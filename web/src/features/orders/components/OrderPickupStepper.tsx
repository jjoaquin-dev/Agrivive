import { AlertCircle, Check, CheckCircle2, ClipboardCheck, Clock, Info, PackageCheck, Send, Store, XCircle } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";

const clock = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" }) : "");
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", timeZone: "Asia/Manila" }) : "");

const stepDefs = [
  { id: "placed", label: "Placed", icon: Send },
  { id: "confirmed", label: "Confirmed", icon: ClipboardCheck },
  { id: "preparing", label: "Preparing", icon: PackageCheck },
  { id: "ready", label: "Ready for pickup", icon: Store },
  { id: "completed", label: "Completed", icon: Check },
] as const;

const terminalCopy = {
  expired: { label: "Expired", note: "The pickup QR ran out before the stall scanned it. Unclaimed items went back to the seller." },
  cancelled: { label: "Cancelled", note: "This reservation was cancelled and the items went back to the seller." },
  declined: { label: "Declined at pickup", note: "Declined produce goes back to the seller and is not put back on sale." },
} as const;

/** The bar follows the order status saved on the server. "Ready" never shows as "Completed". */
export function OrderPickupStepper({ order, shopName }: { order: BuyerOrder; shopName?: string }) {
  const { progress } = order;
  const currentIndex = stepDefs.findIndex((step) => step.id === progress.current);
  const terminal = progress.terminal;
  const seller = shopName || order.stall?.shopName || "the stall";
  const completed = order.status === "completed";
  const captions: Record<string, string> = {
    placed: day(order.createdAt),
    confirmed: order.confirmedAt ? (order.confirmationMode === "auto" ? "Automatically" : "By seller") : "Seller has 3 hours",
    preparing: "Seller packing",
    ready: order.pickupEnd ? `By ${day(order.pickupEnd)}, ${clock(order.pickupEnd)}` : "At the stall",
    completed: completed ? "Success" : "After scan",
  };
  const banner = terminal
    ? { tone: terminal === "declined" ? "bg-[#FFF8E6] border-[#F4DFA5] text-[#6B4E00]" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]", Icon: terminal === "expired" ? AlertCircle : XCircle, title: `This reservation is ${terminalCopy[terminal].label.toLowerCase()}`, text: terminalCopy[terminal].note }
    : completed
      ? { tone: "bg-[#F0FDF4] border-[#DCFCE7] text-[#14532D]", Icon: CheckCircle2, title: "Order completed at the stall!", text: `Your pickup pass was verified by ${seller}. Thank you for helping reduce surplus food waste!` }
      : order.confirmedAt
        ? { tone: "bg-[#F0F5FF] border-[#D0E2FF] text-[#1E3A8A]", Icon: Info, title: progress.current === "ready" ? "Your order is ready for pickup" : "The seller confirmed your order", text: `Come to ${seller} ${order.pickupStart ? `between ${clock(order.pickupStart)} and ${clock(order.pickupEnd)}` : "at your pickup time"} and look over your items first.` }
        : { tone: "bg-[#F0F5FF] border-[#D0E2FF] text-[#1E3A8A]", Icon: Clock, title: "Waiting for the seller to confirm", text: "You can cancel until the seller confirms. If they do not answer in 3 hours, the order is confirmed for you." };
  const BannerIcon = banner.Icon;

  return (
    <div className="rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-sm sm:p-6" aria-label="Order progress">
      <ol className="grid grid-cols-5 gap-x-1">
        {stepDefs.map((step, index) => {
          const done = !terminal && (completed || index < currentIndex);
          const current = !terminal && index === currentIndex && !completed;
          const Icon = step.icon;
          const circle = done || (completed && index === currentIndex) ? "border-[#457D00] bg-[#457D00] text-white" : current ? "border-2 border-[#457D00] bg-white text-[#457D00] ring-4 ring-[#457D00]/15" : "border-2 border-[#E5E2DA] bg-[#F8F6F1] text-neutral-400";
          return (
            <li key={step.id} className="relative flex flex-col items-center text-center" aria-current={current ? "step" : undefined}>
              {index > 0 ? <span aria-hidden="true" className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${done || (completed) || (!terminal && index <= currentIndex) ? "bg-[#457D00]" : "bg-[#E5E2DA]"}`} /> : null}
              <span className={`relative z-10 flex size-10 items-center justify-center rounded-full ${circle}`}><Icon className="size-5" aria-hidden="true" /></span>
              <span className={`mt-3 text-xs leading-tight sm:text-sm ${current ? "font-bold text-[#457D00]" : done ? "font-semibold text-[#14231A]" : "font-medium text-neutral-500"}`}>{step.label}</span>
              <span className="mt-1 hidden text-xs leading-tight text-neutral-500 sm:block">{captions[step.id]}</span>
            </li>
          );
        })}
      </ol>
      {terminal ? <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700"><XCircle className="size-4" />{terminalCopy[terminal].label}</p> : null}
      <div className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${banner.tone}`}>
        <BannerIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{banner.title}</p>
          <p className="mt-1 text-sm leading-snug">{banner.text}</p>
        </div>
      </div>
    </div>
  );
}
