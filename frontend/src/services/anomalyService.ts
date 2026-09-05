import { withMockLatency } from "./api";
import { mockAnomalies } from "./mockData";
import type { Anomaly } from "@/types/insightflow";

let anomalies = [...mockAnomalies];
export async function getAnomalies(_datasetId?: string): Promise<Anomaly[]> { return withMockLatency([...anomalies]); }
export async function resolveAnomaly(id: string): Promise<void> { anomalies = anomalies.map((item) => item.id === id ? { ...item, status: "resolved", severity: "resolved" } : item); return withMockLatency(undefined, 220); }