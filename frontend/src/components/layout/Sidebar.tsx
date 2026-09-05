import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Bot, FileText, Gauge, Lightbulb, LogOut, Settings, ShieldAlert, Table2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { logout } from "@/services/authService";
import type { User } from "@/types/insightflow";

const links = [{ to: "/app", label: "Overview", icon: Gauge, end: true }, { to: "/app/datasets", label: "Datasets", icon: Table2 }, { to: "/app/analytics", label: "Analytics", icon: BarChart3 }, { to: "/app/insights", label: "AI Insights", icon: Bot, badge: "3" }, { to: "/app/anomalies", label: "Anomalies", icon: ShieldAlert, badge: "4" }, { to: "/app/recommendations", label: "Recommendations", icon: Lightbulb }, { to: "/app/reports", label: "Reports", icon: FileText }, { to: "/app/settings", label: "Settings", icon: Settings }];

export function Sidebar({ user, onClose }: { user: User; onClose?: () => void }) {
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/login"); onClose?.(); };
  return <aside className="flex h-full w-[260px] flex-col border-r border-white/[.07] bg-[#0b111f] px-4 py-5" data-testid="app-sidebar">
    <div className="mb-8 px-2"><Logo /></div>
    <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Workspace</div>
    <nav className="space-y-1" aria-label="Primary navigation">{links.map(({ to, label, icon: Icon, badge, end }) => { const slug = label.toLowerCase().replaceAll(" ", "-").replace("ai-insights", "insights"); return <NavLink key={to} to={to} end={end} onClick={onClose} data-testid={`nav-${slug}-link`} className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${isActive ? "bg-blue-500/12 text-blue-300 shadow-[inset_2px_0_0_#3b82f6]" : "text-slate-500 hover:bg-white/[.04] hover:text-slate-200"}`}><Icon className="size-[17px]" strokeWidth={1.8} /><span className="flex-1">{label}</span>{badge && <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">{badge}</span>}</NavLink>; })}</nav>
    <div className="mt-auto space-y-3"><div className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"><div className="mb-2 flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-xs font-bold text-blue-300">{user.initials}</div><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-200">{user.name}</div><div className="truncate text-[10px] text-slate-500">{user.role}</div></div></div><button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-xs text-slate-500 transition-colors hover:text-rose-300" data-testid="sidebar-logout-button"><LogOut className="size-3.5" />Log out</button></div><div className="px-2 text-[10px] text-slate-600">InsightFlow v1.0 · Demo workspace</div></div>
  </aside>;
}