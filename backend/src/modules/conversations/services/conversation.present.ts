import { getAvatarDisplayUrl } from "../../../utils/s3-avatar";
import type { buildConversationSelect } from "./conversation.select";

type ConversationRow = Awaited<ReturnType<typeof buildConversationSelect>>[number];

/** Turns stored avatar keys into links the app can open. */
export async function presentConversationRow(row: ConversationRow) {
  return {
    ...row,
    sellerImage: await getAvatarDisplayUrl(row.sellerImage),
    buyerImage: await getAvatarDisplayUrl(row.buyerImage),
  };
}
