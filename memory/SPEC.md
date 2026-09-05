# InsightFlow living spec

## Product
InsightFlow is a frontend-only analytics and decision-support SaaS demo. It communicates the path from data to analysis to insight to action.

## Auth
- Demo authentication accepts any non-empty email/password.
- Sign up accepts any non-empty name/email/password, shows an in-place success state, and never redirects or refreshes automatically.
- Only an explicit Log in submission enters `/app`; the sign-up screen remains static until the user chooses another action.
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
- The application topbar includes an active dataset selector populated through the dataset service.
- Analytics includes metric, dimension, time range, region, and product-category filters.
- Reports can be filtered by reporting period and include loading, empty, and error states.
- Dataset deletion requires confirmation before the in-memory record is removed.
- `POST /api/insights/query` streams structured GPT-5.4 business analysis over SSE using summarized trusted business context.
- `POST /api/recommendations/generate` streams three prioritized GPT-5.4 business actions over SSE.
- AI request/response history is persisted in MongoDB `ai_history`; credentials remain backend-only in `EMERGENT_LLM_KEY`.
- Both AI flows return deterministic fallbacks when the model, backend, or network is unavailable.
- The application topbar includes an active dataset selector populated through the dataset service.
- Analytics includes metric, dimension, time range, region, and product-category filters.
- Reports can be filtered by reporting period and include loading, empty, and error states.
- Dataset deletion requires confirmation before the in-memory record is removed.
- Settings supports session preferences and logout.

## Visual system
Light landing/auth presentation, dark default workspace, Plus Jakarta Sans headings, Geist body, JetBrains Mono metrics, cobalt/emerald/amber accents, and responsive layouts.