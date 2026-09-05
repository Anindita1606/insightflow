import { withMockLatency } from "./api";
import { mockDatasets, preview } from "./mockData";
import type { Dataset, DatasetPreview } from "@/types/insightflow";

let datasets = [...mockDatasets];

export async function getDatasets(): Promise<Dataset[]> { return withMockLatency([...datasets]); }
export async function getDatasetById(id: string): Promise<DatasetPreview> { return withMockLatency({ ...preview, ...(datasets.find((dataset) => dataset.id === id) ?? {}) }); }
export async function getDatasetPreview(_id: string): Promise<DatasetPreview> { return withMockLatency(preview); }
export async function uploadDataset(file: File): Promise<Dataset> {
  const next: Dataset = { id: `ds-${Date.now()}`, name: file.name, rows: Math.max(1200, Math.round(file.size / 18)), columns: 8, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, uploadedAt: "Just now", status: "ready", description: "Uploaded CSV ready for analysis.", columnNames: ["date", "region", "category", "revenue", "orders", "customers", "margin", "status"] };
  datasets = [next, ...datasets];
  return withMockLatency(next, 650);
}
export async function loadSampleDataset(id: string): Promise<Dataset> { return withMockLatency(datasets.find((dataset) => dataset.id === id) ?? datasets[0], 480); }
export async function deleteDataset(id: string): Promise<void> { datasets = datasets.filter((dataset) => dataset.id !== id); return withMockLatency(undefined, 220); }