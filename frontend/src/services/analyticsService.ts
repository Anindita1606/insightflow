import { withMockLatency } from "./api";
import type { AnalyticsData, AnalyticsFilters, OverviewData } from "@/types/insightflow";
import { mockInsights } from "./mockData";

const kpis = [
  { id: "revenue", label: "Total Revenue", value: "₹24.8M", delta: 12.4, previous: "₹22.1M previous period", trend: [42, 46, 44, 52, 49, 61, 58, 66], accent: "blue" as const },
  { id: "orders", label: "Total Orders", value: "18,429", delta: 8.7, previous: "16,954 previous period", trend: [38, 42, 39, 47, 51, 48, 56, 62], accent: "emerald" as const },
  { id: "customers", label: "Total Customers", value: "12,840", delta: 5.2, previous: "12,206 previous period", trend: [32, 35, 37, 36, 42, 44, 45, 49], accent: "violet" as const },
  { id: "aov", label: "Average Order Value", value: "₹1,346", delta: -2.1, previous: "₹1,375 previous period", trend: [55, 52, 54, 51, 49, 50, 47, 45], accent: "amber" as const },
  { id: "growth", label: "Revenue Growth", value: "+12.4%", delta: 3.8, previous: "+8.6% previous period", trend: [28, 31, 30, 38, 40, 45, 46, 54], accent: "cyan" as const },
];

const trends = [
  { month: "Aug", current: 3.2, previous: 2.8 }, { month: "Sep", current: 3.8, previous: 3.1 }, { month: "Oct", current: 3.5, previous: 3.6 }, { month: "Nov", current: 4.1, previous: 3.7 }, { month: "Dec", current: 4.7, previous: 4.0 }, { month: "Jan", current: 5.5, previous: 4.6 },
];
const regions = [{ region: "North", revenue: 7.8, growth: 18 }, { region: "South", revenue: 5.9, growth: 6 }, { region: "East", revenue: 6.2, growth: 11 }, { region: "West", revenue: 4.9, growth: -18.7 }];
const products = [{ product: "Electronics", revenue: 8.4, growth: 4 }, { product: "Home & Living", revenue: 6.8, growth: 32 }, { product: "Apparel", revenue: 4.6, growth: 12 }, { product: "Beauty", revenue: 3.1, growth: -3 }, { product: "Sports", revenue: 1.9, growth: 8 }];
const segments = [{ name: "Returning", value: 46, color: "#3b82f6" }, { name: "New", value: 34, color: "#10b981" }, { name: "At risk", value: 14, color: "#f59e0b" }, { name: "Dormant", value: 6, color: "#64748b" }];

export async function getOverviewKPIs(_datasetId?: string, _timeRange?: string): Promise<OverviewData> { return withMockLatency({ kpis, trends, regions, products, segments, insights: mockInsights }); }
export async function getCustomAnalytics(filters: AnalyticsFilters): Promise<AnalyticsData> {
  const factor = filters.region === "West" ? 0.82 : filters.region === "North" ? 1.14 : 1;
  const points = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"].map((label, index) => ({ label, value: Math.round((48 + index * 7 + (filters.category === "Electronics" ? 8 : 0)) * factor), comparison: Math.round((42 + index * 5) * factor) }));
  return withMockLatency({ points, stats: { total: "₹24.8M", average: "₹4.13M", change: filters.region === "West" ? "-18.7%" : "+12.4%", peak: "January" } }, 360);
}