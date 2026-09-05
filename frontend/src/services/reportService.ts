import { withMockLatency } from "./api";
import { mockReports } from "./mockData";
import type { Report } from "@/types/insightflow";

export async function getReports(): Promise<Report[]> { return withMockLatency(mockReports); }
export async function downloadReport(report: Report): Promise<void> { await withMockLatency(undefined, 260); const blob = new Blob([`InsightFlow report\n${report.title}\n${report.period}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${report.title.replaceAll(" ", "-").toLowerCase()}.txt`; anchor.click(); URL.revokeObjectURL(url); }