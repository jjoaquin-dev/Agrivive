"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiError, isAbortError } from "@/src/lib/api";
import {
  getBuyerProductInquiries,
  sendBuyerProductInquiry,
  type BuyerProductInquiry,
} from "../api/inquiries";

export function ProductQuestionsSection({ productId }: { productId: string }) {
  const [inquiries, setInquiries] = useState<BuyerProductInquiry[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);

  const hasOpenInquiry = inquiries.some((item) => !item.reply);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);

    getBuyerProductInquiries(productId, controller.signal)
      .then((items) => {
        if (!active) return;
        setInquiries(items);
        setRequiresAuth(false);
      })
      .catch((reason: unknown) => {
        if (!active || isAbortError(reason)) return;
        if (reason instanceof ApiError && (reason.status === 401 || reason.status === 403)) {
          setRequiresAuth(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [productId]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const created = await sendBuyerProductInquiry(productId, trimmed);
      setInquiries((prev) => [...prev, created]);
      setQuestion("");
    } catch (reason: unknown) {
      if (reason instanceof ApiError) {
        if (reason.status === 409) {
          setError("You already have a question awaiting this seller's response.");
        } else if (reason.status === 401) {
          setRequiresAuth(true);
        } else {
          setError(reason.message || "Could not send your question.");
        }
      } else {
        setError("Could not send your question. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 border-t pt-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-primary" aria-hidden="true" />
        <h2 className="font-heading text-xl font-bold">Questions for the Seller</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Ask about freshness, stall location, or custom reservation requests.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Ask a question</CardTitle>
            <CardDescription>
              The seller will receive your question in their message inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requiresAuth ? (
              <div className="space-y-3 py-2 text-sm">
                <p className="text-muted-foreground">
                  Sign in with your buyer account to send questions to this seller.
                </p>
                <Link
                  href={`/login?next=${encodeURIComponent(`/marketplace/${productId}`)}`}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  Sign in to ask
                </Link>
              </div>
            ) : hasOpenInquiry ? (
              <Alert>
                <Clock className="size-4 text-primary" />
                <AlertDescription>
                  Your previous question is awaiting the seller's reply. You can ask another once they answer.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="listing-question-input" className="sr-only">
                    Your question
                  </label>
                  <textarea
                    id="listing-question-input"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. When was this produce harvested? Can I pick up early morning?"
                    maxLength={1000}
                    rows={4}
                    disabled={submitting}
                    className="w-full resize-y rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Be specific and respectful</span>
                    <span>{question.length}/1000</span>
                  </div>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  disabled={submitting || !question.trim()}
                  className="h-11 w-full gap-2 sm:w-auto"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {submitting ? "Sending…" : "Send Question"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div>
          <h3 className="font-heading text-base font-semibold">Your previous questions</h3>
          {loading ? (
            <div className="mt-3 space-y-3">
              <div className="h-20 animate-pulse rounded-xl bg-card" />
              <div className="h-20 animate-pulse rounded-xl bg-card" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              You haven’t asked any questions about this listing yet.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-semibold text-primary">You:</span> {inquiry.question}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {inquiry.reply ? (
                    <div className="mt-2 rounded-xl bg-agrivive-surface p-3 border border-border/60">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <CheckCircle2 className="size-3.5" />
                        <span>Seller reply:</span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{inquiry.reply}</p>
                      {inquiry.repliedAt ? (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Answered on{" "}
                          {new Date(inquiry.repliedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600">
                      <Clock className="size-3.5" />
                      <span>Awaiting seller response</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
