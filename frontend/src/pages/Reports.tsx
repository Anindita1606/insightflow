import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Download, FileText, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { getReports, downloadReport } from "@/services/reportService";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import type { Report } from "@/types/insightflow";

export default function Reports() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["reports"], queryFn: getReports, retry: false });
  const [selected, setSelected] = useState<Report | null>(null);
  const [periodFilter, setPeriodFilter] = useState("all");
  const visibleReports = data?.filter((report) => periodFilter === "all" || report.period.includes(periodFilter)) ?? [];

  const handleDownload = async (report: Report) => {
    await downloadReport(report);
    toast.success("Report download started");
  };

  return <div className="space-y-7" data-testid="reports-page">
    <SectionHeader
      eyebrow="Share the story"
      title="Reports"
      description="Turn your latest analysis into a polished executive readout for the people who need to act."
      action={<div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-slate-500" />
          <select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className="rounded-lg border border-white/[.1] bg-[#101827] py-2.5 pl-9 pr-3 text-xs text-slate-300 outline-none focus:border-blue-500/50" aria-label="Filter reports by date" data-testid="reports-date-filter">
            <option value="all">All periods</option>
            <option value="Jan">January 2025</option>
            <option value="Q4">Q4 2024</option>
          </select>
        </label>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500" data-testid="generate-report-button"><FileText className="size-3.5" />Generate report</button>
      </div>}
    />
    {isLoading && <LoadingState rows={4} />}
    {isError && <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-200" data-testid="reports-error-state">Reports are temporarily unavailable. Your existing workspace is still accessible.</div>}
    {!isLoading && !isError && visibleReports.length === 0 && <EmptyState title="No reports for this period" description="Choose another date range to view generated reports." />}
    <div className="grid gap-4 lg:grid-cols-3">
      {visibleReports.map((report) => <article key={report.id} className="rounded-xl border border-white/[.08] bg-[#101827] p-5 transition-colors hover:border-blue-500/25" data-testid={`report-card-${report.id}`}>
        <div className="flex items-start justify-between"><div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300"><FileText className="size-5" /></div><button className="rounded-md p-1 text-slate-600 hover:text-slate-300" data-testid={`report-more-${report.id}`}><MoreHorizontal className="size-4" /></button></div>
        <h3 className="mt-5 font-heading text-sm font-semibold text-white">{report.title}</h3>
        <p className="mt-1 text-xs text-slate-600">{report.type}</p>
        <div className="mt-5 space-y-2 border-t border-white/[.06] pt-4"><div className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays className="size-3.5" />{report.period}</div><div className="flex items-center justify-between"><span className="text-xs text-slate-600">Updated {report.createdAt}</span><StatusBadge status={report.status} /></div></div>
        <div className="mt-5 flex gap-2"><button onClick={() => setSelected(report)} className="flex-1 rounded-lg border border-white/[.1] px-3 py-2 text-xs font-semibold text-slate-300 hover:border-white/20 hover:text-white" data-testid={`report-open-${report.id}`}>Open report</button><button onClick={() => void handleDownload(report)} className="rounded-lg border border-white/[.1] px-3 py-2 text-slate-400 hover:border-blue-500/30 hover:text-blue-300" data-testid={`report-download-${report.id}`}><Download className="size-3.5" /></button></div>
      </article>)}
    </div>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)} data-testid="report-preview-modal"><div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-700 bg-[#101827] p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between border-b border-white/[.08] pb-6"><div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-400">InsightFlow executive report</div><h2 className="mt-3 font-heading text-2xl font-semibold text-white">{selected.title}</h2><p className="mt-2 text-xs text-slate-500">{selected.period} · Prepared for {selected.owner}</p></div><button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white" data-testid="report-preview-close-button">×</button></div><div className="grid gap-4 py-6 sm:grid-cols-3"><div className="rounded-lg bg-white/[.04] p-4"><div className="text-[10px] uppercase tracking-[.15em] text-slate-600">Revenue</div><div className="mt-2 font-mono text-xl text-white">₹24.8M</div><div className="mt-1 text-xs text-emerald-300">+12.4% vs previous</div></div><div className="rounded-lg bg-white/[.04] p-4"><div className="text-[10px] uppercase tracking-[.15em] text-slate-600">Signal health</div><div className="mt-2 font-mono text-xl text-white">94.8</div><div className="mt-1 text-xs text-emerald-300">Excellent coverage</div></div><div className="rounded-lg bg-white/[.04] p-4"><div className="text-[10px] uppercase tracking-[.15em] text-slate-600">Priority actions</div><div className="mt-2 font-mono text-xl text-white">2</div><div className="mt-1 text-xs text-amber-300">Require review</div></div></div><div className="space-y-5"><div><h3 className="font-heading text-sm font-semibold text-white">Executive memo</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">January closed with healthy growth led by North and Home &amp; Living. The primary risk is concentrated in West Electronics, where lower availability and repeat purchase rates created a meaningful revenue gap. The next operating cycle should focus on inventory coverage and retention.</p></div><div className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-4"><div className="text-xs font-semibold text-rose-200">Watch item · West recovery</div><p className="mt-1 text-xs leading-relaxed text-slate-500">Revenue is 18.7% below baseline in the West region. See the linked analysis for evidence and recommended actions.</p></div></div><div className="mt-7 flex justify-end gap-3"><button onClick={() => void handleDownload(selected)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500" data-testid="report-preview-download-button"><Download className="size-3.5" />Download summary</button></div></div></div>}
  </div>;
}