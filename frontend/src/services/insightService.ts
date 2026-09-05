import { apiPostStream } from "@/lib/api";
import { withMockLatency } from "./api";
import { mockInsights } from "./mockData";
import type { AIInsightResponse, Insight } from "@/types/insightflow";

export async function getRecentInsights(_datasetId?: string): Promise<Insight[]> {
  return withMockLatency(mockInsights);
}

export async function queryDataWithAI(
  prompt: string,
  datasetId = "ds-ecomm-2025",
  onToken?: (token: string) => void,
): Promise<AIInsightResponse> {
  try {
    return await apiPostStream<AIInsightResponse>(
      "/insights/query",
      { prompt, dataset_id: datasetId },
      onToken,
    );
  } catch {
    return {
      id: `local-fallback-${Date.now()}`,
      category: "AI analysis",
      severity: "high",
      title: `Analysis for “${prompt}”`,
      finding: "The West region is the clearest opportunity for recovery this month.",
      evidence: "Revenue is down 18.7%, repeat orders are down 15%, and Electronics availability is below the safety threshold.",
      impact: "₹ 2.4M at risk",
      action: "Prioritize inventory coverage and a targeted retention campaign before the next reporting cycle.",
      timestamp: "Just now",
      source: "Offline fallback",
      fallback_used: true,
    };
  }
}