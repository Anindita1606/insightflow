import { apiPostStream } from "@/lib/api";
import { withMockLatency } from "./api";
import { mockRecommendations } from "./mockData";
import type { Recommendation, RecommendationGenerateResponse } from "@/types/insightflow";

let recommendations = [...mockRecommendations];

export async function getRecommendations(): Promise<Recommendation[]> {
  return withMockLatency([...recommendations]);
}

export async function generateRecommendations(
  datasetId = "ds-ecomm-2025",
  onToken?: (token: string) => void,
): Promise<RecommendationGenerateResponse> {
  try {
    const response = await apiPostStream<RecommendationGenerateResponse>(
      "/recommendations/generate",
      { dataset_id: datasetId },
      onToken,
    );
    recommendations = response.recommendations;
    return response;
  } catch {
    const response = {
      recommendations: [...mockRecommendations],
      source: "Offline fallback",
      fallback_used: true,
    };
    recommendations = response.recommendations;
    return response;
  }
}

export async function updateRecommendationStatus(id: string): Promise<void> {
  recommendations = recommendations.map((item) => item.id === id ? { ...item, status: "reviewed" } : item);
  return withMockLatency(undefined, 220);
}