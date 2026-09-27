import { t } from "elysia";

export const buyerReportEvidenceParams = t.Object({
  id: t.String({ format: "uuid" }),
  reportId: t.String({ format: "uuid" }),
});
export const buyerReportEvidenceUpload = t.Object({
  file: t.File({ type: ["image/jpeg", "image/png", "image/webp", "application/pdf"], maxSize: 5 * 1024 * 1024 }),
});
