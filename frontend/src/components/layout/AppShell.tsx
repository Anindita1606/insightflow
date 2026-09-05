import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getCurrentUser } from "@/services/authService";
import { Toaster } from "@/components/ui/sonner";
import { getDatasets } from "@/services/datasetService";

const titles: Record<string, string> = { "/app": "Overview", "/app/datasets": "Datasets", "/app/analytics": "Analytics workspace", "/app/insights": "AI Insights", "/app/anomalies": "Anomalies", "/app/recommendations": "Recommendations", "/app/reports": "Reports", "/app/settings": "Settings" };
export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState("ds-ecomm-2025");
  const location = useLocation();
  const user = getCurrentUser();
  const { data: datasets = [] } = useQuery({ queryKey: ["datasets"], queryFn: getDatasets, retry: false });
  const title = titles[location.pathname] ?? (location.pathname.startsWith("/app/datasets/") ? "Dataset preview" : "Overview");
  if (!user) return null;
  return <div className="min-h-svh bg-[#090d16] text-slate-100"><div className={`fixed inset-0 z-40 bg-black/60 lg:hidden ${mobileOpen ? "block" : "hidden"}`} onClick={() => setMobileOpen(false)} /><div className="flex min-h-svh"><div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:static lg:block ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}><Sidebar user={user} onClose={() => setMobileOpen(false)} /></div><div className="min-w-0 flex-1"><Topbar title={title} user={user} datasets={datasets} selectedDatasetId={selectedDatasetId} onDatasetChange={setSelectedDatasetId} onMenu={() => setMobileOpen(true)} /><main className="mx-auto max-w-[1480px] p-4 sm:p-7"><Outlet context={{ selectedDatasetId }} /></main></div></div><Toaster position="bottom-right" richColors /></div>;
}