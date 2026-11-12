import type { Conversation } from "../api";
import { Store } from "lucide-react";
import { ConversationRowMenu } from "./ConversationRowMenu";
import { formatDate, formatTime } from "@/src/lib/format";

function formatListTime(value: string) {
  const date = new Date(value);
  if (date.toDateString() === new Date().toDateString()) return formatTime(date);
  return formatDate(date, { month: "short", day: "numeric" });
}

export function displayName(item: Conversation) {
  return item.sellerShopName || item.sellerName || "Seller";
}

/** One conversation in the list: seller photo, name, last message and the row menu. */
export function ConversationListRow({ item, isSelected, onSelect, onChanged }: {
  item: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
  onChanged: () => void;
}) {
  const title = displayName(item);

  return (
    <div
      key={item.id}
      className={`flex items-center gap-1 rounded-2xl pr-1.5 transition-all ${
        isSelected
          ? "border border-[#E3EBCE] bg-[#F6F8ED] shadow-sm"
          : "border border-transparent hover:bg-agrivive-wash"
      }`}
    >
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-2.5 text-left"
    >
      {/* Avatar with status capsule */}
      <div className="relative shrink-0">
        <div
          className={`size-10 overflow-hidden rounded-full ring-2 ${
            isSelected ? "ring-agrivive-primary/30" : "ring-neutral-200"
          }`}
        >
          {item.sellerImage ? (
            <img src={item.sellerImage} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-agrivive-mist text-agrivive-primary">
              <Store className="size-4" />
            </div>
          )}
        </div>
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-agrivive-primary" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-xs font-bold text-agrivive-forest">{title}</span>
          <span className="shrink-0 text-xs text-agrivive-gray">
            {formatListTime(item.lastMessageAt)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-1">
          <p className="truncate text-xs text-agrivive-gray">
            {item.lastMessageBody || "New conversation"}
          </p>
          {item.unreadCount > 0 ? (
            <span className="size-2 rounded-full bg-[#F59E0B] shrink-0" />
          ) : null}
        </div>
      </div>
    </button>
    <ConversationRowMenu item={item} onChanged={onChanged} />
    </div>
  );
}
