import React from "react";
import type { SellerProductInquiryItem } from "../types";
import { QuestionCard } from "./QuestionCard";

export interface ProductInquiryCardProps {
  inquiry: SellerProductInquiryItem;
  onReply: (id: string, text: string) => Promise<void>;
  isReplying: boolean;
  onAnswerSuccess?: () => void;
}

export function ProductInquiryCard(props: ProductInquiryCardProps) {
  return <QuestionCard {...props} />;
}
