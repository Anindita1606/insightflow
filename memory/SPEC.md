# InsightFlow living spec

## Product
InsightFlow is a frontend-only analytics and decision-support SaaS demo. It communicates the path from data to analysis to insight to action.

## Auth
- Demo authentication accepts any non-empty email/password.
- Sign up accepts any non-empty name/email/password.
- The current user is kept in module memory only and resets on browser refresh.
- `/app/*` routes redirect to `/login` when no session exists.

## Data model
- `Dataset`, `DatasetPreview`, `Kpi`, `TrendPoint`, `RegionMetric`, `ProductMetric`, `SegmentMetric`, `Insight`, `Anomaly`, `Recommendation`, and `Report` live in `frontend/src/types/insightflow.ts`.
- Mock data is owned by `frontend/src/services/mockData.ts`; components receive typed props and do not import mock records.

## Service boundary
All data access is isolated in `frontend/src/services/`: auth, datasets, analytics, anomalies, insights, recommendations, and reports. `services/api.ts` documents the future Spring Boot endpoint map and shared mock latency. Replace service implementations with REST calls without restructuring pages/components.

## Key flows
- Landing → login/signup → authenticated app shell.
- Overview shows KPI, trend, regional, product, segment, signal health, and recent insight views.
- Datasets supports mock CSV selection/drag-drop, upload progress, ready state, delete, and dataset preview/profile.
- Analytics supports metric/dimension/time/region filters and line/bar/area/table views.
- AI Insights supports natural-language prompts, simulated loading, and structured findings.
- Anomalies supports active/resolved state changes.
- Recommendations supports review state changes.
- Reports supports preview modal and text download.
- Settings supports session preferences and logout.

## Visual system
Light landing/auth presentation, dark default workspace, Plus Jakarta Sans headings, Geist body, JetBrains Mono metrics, cobalt/emerald/amber accents, and responsive layouts.