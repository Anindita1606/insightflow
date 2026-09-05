/**
 * Service boundary for InsightFlow. Replace the mock implementations in the
 * sibling service files with calls through this client when Spring Boot is connected.
 */
export const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  datasets: "/api/datasets",
  upload: "/api/datasets/upload",
  dataset: (id: string) => `/api/datasets/${id}`,
  overview: "/api/analytics/overview",
  trends: "/api/analytics/trends",
  regions: "/api/analytics/regions",
  products: "/api/analytics/products",
  anomalies: "/api/anomalies",
  insights: "/api/insights",
  insightQuery: "/api/insights/query",
  recommendations: "/api/recommendations",
  reports: "/api/reports",
} as const;

export const withMockLatency = async <T>(value: T, delay = 260): Promise<T> => {
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return value;
};

export const toServiceError = (message: string) => new Error(message);