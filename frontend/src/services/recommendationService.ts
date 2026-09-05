import { withMockLatency } from "./api";
import { mockRecommendations } from "./mockData";
import type { Recommendation } from "@/types/insightflow";

let recommendations = [...mockRecommendations];
export async function getRecommendations(): Promise<Recommendation[]> { return withMockLatency([...recommendations]); }
export async function updateRecommendationStatus(id: string): Promise<void> { recommendations = recommendations.map((item) => item.id === id ? { ...item, status: "reviewed" } : item); return withMockLatency(undefined, 220); }