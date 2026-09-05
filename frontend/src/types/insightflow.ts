export type Severity = "high" | "medium" | "low" | "resolved";
export type DatasetStatus = "ready" | "processing" | "error";
export type RecommendationPriority = "high" | "medium" | "low";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  size: string;
  uploadedAt: string;
  status: DatasetStatus;
  description: string;
  columnNames: string[];
}

export interface DatasetColumn {
  name: string;
  type: "numeric" | "categorical" | "datetime";
  missing: number;
  sample: string;
}

export interface DatasetPreview extends Dataset {
  numericColumns: number;
  categoricalColumns: number;
  profile: DatasetColumn[];
  sampleRows: Record<string, string | number>[];
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: number;
  previous: string;
  trend: number[];
  accent: "blue" | "emerald" | "amber" | "violet" | "cyan";
}

export interface TrendPoint {
  month: string;
  current: number;
  previous: number;
}

export interface RegionMetric {
  region: string;
  revenue: number;
  growth: number;
}

export interface ProductMetric {
  product: string;
  revenue: number;
  growth: number;
}

export interface SegmentMetric {
  name: string;
  value: number;
  color: string;
}

export interface Insight {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  finding: string;
  evidence: string;
  impact: string;
  action: string;
  timestamp: string;
}

export interface Anomaly {
  id: string;
  metric: string;
  actual: string;
  expected: string;
  deviation: number;
  severity: Severity;
  detectedAt: string;
  affected: string;
  status: "active" | "resolved";
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  reason: string;
  impact: string;
  metric: string;
  status: "open" | "reviewed";
}

export interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  createdAt: string;
  owner: string;
  status: "ready" | "generating";
}

export interface OverviewData {
  kpis: Kpi[];
  trends: TrendPoint[];
  regions: RegionMetric[];
  products: ProductMetric[];
  segments: SegmentMetric[];
  insights: Insight[];
}

export interface AnalyticsData {
  points: Array<{ label: string; value: number; comparison: number }>;
  stats: { total: string; average: string; change: string; peak: string };
}

export interface AnalyticsFilters {
  metric: string;
  dimension: string;
  timeRange: string;
  region: string;
  category: string;
}