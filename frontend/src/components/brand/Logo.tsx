import { Activity } from "lucide-react";

interface LogoProps { light?: boolean; compact?: boolean }
export function Logo({ light = false, compact = false }: LogoProps) {
  return <div className="flex items-center gap-2.5" data-testid="insightflow-logo">
    <div className="relative flex size-8 items-center justify-center rounded-[10px] bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,.28)]"><Activity className="size-4.5 text-white" strokeWidth={2.5} /></div>
    {!compact && <span className={`font-heading text-[17px] font-bold tracking-[-0.04em] ${light ? "text-slate-900" : "text-white"}`}>Insight<span className={light ? "text-blue-600" : "text-blue-400"}>Flow</span></span>}
  </div>;
}