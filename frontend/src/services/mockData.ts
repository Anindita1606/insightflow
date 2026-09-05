import type {
  Anomaly,
  Dataset,
  DatasetPreview,
  Insight,
  Recommendation,
  Report,
  User,
} from "@/types/insightflow";

export const demoUser: User = {
  id: "usr-01",
  name: "Maya Chen",
  email: "maya@northstarcommerce.com",
  role: "Head of Growth",
  initials: "MC",
};

export const mockDatasets: Dataset[] = [
  {
    id: "ds-ecomm-2025",
    name: "Global_Ecommerce_Transactions_2025.csv",
    rows: 48520,
    columns: 10,
    size: "4.8 MB",
    uploadedAt: "Jan 14, 2025",
    status: "ready",
    description: "Comprehensive transactional data across North America, EMEA, APAC, and LATAM.",
    columnNames: ["order_id", "order_date", "customer_segment", "region", "product_category", "revenue", "discount", "profit_margin", "shipping_cost", "status"],
  },
  {
    id: "ds-saas-arr-q4",
    name: "Enterprise_SaaS_Revenue_Cohorts.csv",
    rows: 12840,
    columns: 8,
    size: "1.9 MB",
    uploadedAt: "Jan 09, 2025",
    status: "ready",
    description: "Subscription cohort retention and expansion analytics with predictive churn signals.",
    columnNames: ["account_id", "subscription_tier", "mrr", "churn_risk_score", "region", "nps", "expansion_revenue", "contract_length_months"],
  },
  {
    id: "ds-supply-telemetry",
    name: "Omnichannel_Supply_Chain_Logistics.csv",
    rows: 31200,
    columns: 8,
    size: "3.4 MB",
    uploadedAt: "Dec 22, 2024",
    status: "ready",
    description: "Logistics throughput, transit lead times, and SLA deviation telemetry.",
    columnNames: ["shipment_id", "origin_hub", "destination_hub", "lead_time_days", "carrier", "fuel_surcharge", "on_time_flag", "damage_rate"],
  },
];

export const preview: DatasetPreview = {
  ...mockDatasets[0],
  numericColumns: 4,
  categoricalColumns: 4,
  profile: [
    { name: "order_id", type: "categorical", missing: 0, sample: "ORD-18429" },
    { name: "order_date", type: "datetime", missing: 0, sample: "2025-01-14" },
    { name: "customer_segment", type: "categorical", missing: 128, sample: "Returning" },
    { name: "region", type: "categorical", missing: 0, sample: "West" },
    { name: "product_category", type: "categorical", missing: 42, sample: "Electronics" },
    { name: "revenue", type: "numeric", missing: 0, sample: "₹ 18,420" },
    { name: "discount", type: "numeric", missing: 16, sample: "0.12" },
    { name: "profit_margin", type: "numeric", missing: 20, sample: "0.31" },
  ],
  sampleRows: [
    { order_id: "ORD-18429", order_date: "2025-01-14", customer_segment: "Returning", region: "West", product_category: "Electronics", revenue: 18420, status: "Completed" },
    { order_id: "ORD-18428", order_date: "2025-01-14", customer_segment: "New", region: "North", product_category: "Home & Living", revenue: 9240, status: "Completed" },
    { order_id: "ORD-18427", order_date: "2025-01-13", customer_segment: "Returning", region: "South", product_category: "Apparel", revenue: 6720, status: "Completed" },
    { order_id: "ORD-18426", order_date: "2025-01-13", customer_segment: "At risk", region: "West", product_category: "Electronics", revenue: 4120, status: "Refunded" },
    { order_id: "ORD-18425", order_date: "2025-01-12", customer_segment: "New", region: "East", product_category: "Beauty", revenue: 3560, status: "Completed" },
  ],
};

export const mockInsights: Insight[] = [
  { id: "ins-01", category: "Revenue", severity: "high", title: "West region revenue dropped 18.7%", finding: "Revenue declined 18.7% in the West region.", evidence: "Electronics sales decreased 23% and repeat customer orders fell 15%.", impact: "₹ 2.4M at risk", action: "Investigate Electronics inventory availability and launch a retention campaign for repeat customers.", timestamp: "12 min ago" },
  { id: "ins-02", category: "Customers", severity: "medium", title: "At-risk segment is growing", finding: "At-risk customers now represent 14.2% of active buyers.", evidence: "Three consecutive weeks of lower purchase frequency in the West and South.", impact: "Medium", action: "Build a win-back sequence around high-value returning customers.", timestamp: "2 hrs ago" },
  { id: "ins-03", category: "Product", severity: "low", title: "Home & Living is accelerating", finding: "Home & Living revenue is up 32.4% month over month.", evidence: "Average order value increased 11% with strong North region adoption.", impact: "₹ 860K upside", action: "Increase inventory coverage for the highest-converting product families.", timestamp: "Yesterday" },
];

export const mockAnomalies: Anomaly[] = [
  { id: "an-01", metric: "Revenue", actual: "₹3.4M", expected: "₹4.2M", deviation: -19, severity: "high", detectedAt: "Today, 09:42", affected: "West · Electronics", status: "active" },
  { id: "an-02", metric: "Repeat purchase rate", actual: "28.4%", expected: "34.0%", deviation: -16.5, severity: "high", detectedAt: "Today, 08:16", affected: "West · Returning", status: "active" },
  { id: "an-03", metric: "Average shipping cost", actual: "₹482", expected: "₹390", deviation: 23.6, severity: "medium", detectedAt: "Yesterday, 17:20", affected: "South · Logistics", status: "active" },
  { id: "an-04", metric: "Refund rate", actual: "4.8%", expected: "3.2%", deviation: 50, severity: "medium", detectedAt: "Yesterday, 11:03", affected: "East · Beauty", status: "active" },
  { id: "an-05", metric: "Order volume", actual: "12,842", expected: "12,500", deviation: 2.7, severity: "resolved", detectedAt: "Jan 12, 14:30", affected: "North · All products", status: "resolved" },
];

export const mockRecommendations: Recommendation[] = [
  { id: "rec-01", priority: "high", title: "Improve repeat-customer retention in West", reason: "Repeat-customer orders declined 15% while the at-risk segment expanded.", impact: "Potential revenue recovery of 8–12%", metric: "Repeat purchase rate", status: "open" },
  { id: "rec-02", priority: "high", title: "Protect Electronics inventory coverage", reason: "Demand is healthy, but West availability fell below the 14-day safety threshold.", impact: "Avoid ₹1.1M in lost demand", metric: "Stock coverage", status: "open" },
  { id: "rec-03", priority: "medium", title: "Rebalance South-region shipping lanes", reason: "Average shipping cost is 23.6% over the expected baseline.", impact: "Save approximately ₹280K / month", metric: "Shipping cost", status: "open" },
  { id: "rec-04", priority: "low", title: "Scale Home & Living acquisition", reason: "Category growth is 32.4% with the strongest new-customer conversion.", impact: "Estimated 6% new-customer lift", metric: "Category growth", status: "reviewed" },
];

export const mockReports: Report[] = [
  { id: "rep-01", title: "January Executive Performance Brief", type: "Executive brief", period: "Jan 01 – Jan 31, 2025", createdAt: "Feb 01, 2025", owner: "Maya Chen", status: "ready" },
  { id: "rep-02", title: "West Region Recovery Plan", type: "Deep dive", period: "Dec 01 – Jan 31, 2025", createdAt: "Jan 31, 2025", owner: "Maya Chen", status: "ready" },
  { id: "rep-03", title: "Customer Retention Pulse", type: "Segment report", period: "Q4 2024", createdAt: "Jan 07, 2025", owner: "InsightFlow AI", status: "ready" },
];