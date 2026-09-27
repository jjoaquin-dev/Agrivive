import { t } from "elysia";

export const sellerReportEvidenceParams = t.Object({
  id: t.String({ format: "uuid" }),
  reportId: t.String({ format: "uuid" }),
});
export const sellerReportEvidenceUpload = t.Object({
  file: t.File({ type: ["image/jpeg", "image/png", "image/webp", "application/pdf"], maxSize: 5 * 1024 * 1024 }),
});
