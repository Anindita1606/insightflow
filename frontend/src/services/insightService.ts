import { withMockLatency } from "./api";
import { mockInsights } from "./mockData";
import type { Insight } from "@/types/insightflow";

export async function getRecentInsights(_datasetId?: string): Promise<Insight[]> { return withMockLatency(mockInsights); }
export async function queryDataWithAI(prompt: string): Promise<Insight> {
  return withMockLatency({ id: `query-${Date.now()}`, category: "AI analysis", severity: "medium", title: `Analysis for “${prompt}”`, finding: "The West region is the clearest opportunity for recovery this month.", evidence: "Revenue is down 18.7%, repeat orders are down 15%, and Electronics availability is below the safety threshold.", impact: "₹ 2.4M at risk", action: "Prioritize inventory coverage and a targeted retention campaign before the next reporting cycle.", timestamp: "Just now" }, 900);
}