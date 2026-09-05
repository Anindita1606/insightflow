import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/services/authService";
import { AppShell } from "@/components/layout/AppShell";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Overview from "@/pages/Overview";
import Datasets from "@/pages/Datasets";
import DatasetPreviewPage from "@/pages/DatasetPreviewPage";
import Analytics from "@/pages/Analytics";
import Insights from "@/pages/Insights";
import Anomalies from "@/pages/Anomalies";
import Recommendations from "@/pages/Recommendations";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

function RequireAuth({ children }: { children: ReactNode }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
      <Route index element={<Overview />} />
      <Route path="datasets" element={<Datasets />} />
      <Route path="datasets/:id" element={<DatasetPreviewPage />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="insights" element={<Insights />} />
      <Route path="anomalies" element={<Anomalies />} />
      <Route path="recommendations" element={<Recommendations />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
