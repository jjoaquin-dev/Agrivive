import { readFile } from "node:fs/promises";
import path from "node:path";

export type MbaReportSource = "none" | "synthetic" | "real";
export type MbaReportStatus = "disabled" | "demo" | "collecting" | "ready" | "unavailable";
export type MbaItemLevel = "product_name" | "category" | "product_id";

export type MbaRule = {
  antecedent: string[];
  consequent: string[];
};

export type MbaReport = {
  source: "synthetic" | "real";
  status: "demo" | "collecting" | "ready";
  generatedAt: string;
  basketCount: number;
  itemLevel: MbaItemLevel;
  rules: MbaRule[];
};

export type MbaReportState = {
  source: MbaReportSource;
  status: MbaReportStatus;
  generatedAt: string | null;
  basketCount: number;
  report: MbaReport | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function reportDirectory() {
  const configured = process.env.MBA_REPORT_DIR?.trim() || "../analytics/mba/output";
  return path.resolve(process.cwd(), configured);
}

function validRule(value: unknown): value is MbaRule {
  if (!isRecord(value) || !Array.isArray(value.antecedent) || !Array.isArray(value.consequent)) return false;
  return value.antecedent.length > 0 && value.consequent.length > 0 &&
    value.antecedent.every((item) => typeof item === "string" && normalize(item).length > 0) &&
    value.consequent.every((item) => typeof item === "string" && normalize(item).length > 0);
}

function parseReport(value: unknown, expectedSource: "synthetic" | "real"): MbaReport | null {
  if (!isRecord(value) || value.source !== expectedSource ||
    !["demo", "collecting", "ready"].includes(String(value.status)) ||
    typeof value.generatedAt !== "string" || !Number.isFinite(value.basketCount) ||
    !["product_name", "category", "product_id"].includes(String(value.itemLevel)) ||
    !Array.isArray(value.rules) || !value.rules.every(validRule)) return null;
  return {
    source: expectedSource,
    status: value.status as MbaReport["status"],
    generatedAt: value.generatedAt,
    basketCount: Number(value.basketCount),
    itemLevel: value.itemLevel as MbaItemLevel,
    rules: value.rules,
  };
}

export async function readMbaReport(): Promise<MbaReportState> {
  const mode = process.env.MBA_MODE?.trim().toLowerCase() || "disabled";
  if (mode === "disabled") {
    return { source: "none", status: "disabled", generatedAt: null, basketCount: 0, report: null };
  }
  if ((process.env.APP_ENV || process.env.NODE_ENV || "development").trim().toLowerCase() === "production" && mode === "synthetic") {
    return { source: "none", status: "disabled", generatedAt: null, basketCount: 0, report: null };
  }
  if (mode !== "synthetic" && mode !== "live") {
    return { source: "none", status: "unavailable", generatedAt: null, basketCount: 0, report: null };
  }

  const source = mode === "synthetic" ? "synthetic" : "real";
  const reportPath = path.join(reportDirectory(), `${source}_mba_report.json`);
  try {
    const parsed = parseReport(JSON.parse(await readFile(reportPath, "utf8")), source);
    if (!parsed) return { source: "none", status: "unavailable", generatedAt: null, basketCount: 0, report: null };
    return {
      source,
      status: parsed.status,
      generatedAt: parsed.generatedAt,
      basketCount: parsed.basketCount,
      report: parsed,
    };
  } catch {
    return { source: "none", status: "unavailable", generatedAt: null, basketCount: 0, report: null };
  }
}

export function normalizeMbaItem(value: string) {
  return normalize(value);
}
