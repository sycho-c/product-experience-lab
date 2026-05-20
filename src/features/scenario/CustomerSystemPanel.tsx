import {
  ScanLine,
  Sparkles,
  Database,
  FileSignature,
  Lock,
  ClipboardList,
  Gauge,
  ShieldCheck,
  MessageCircle,
  Bell,
  FileSpreadsheet,
  FolderSearch,
  Factory,
  ArrowLeftRight,
  Workflow,
  Users,
  Briefcase,
  IdCard,
  Search,
  PenLine,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { selectCurrentStep, useScenarioStore } from './store';
import type { SystemAccent, SystemNode } from '@/types/scenario';

const ICON_MAP: Record<string, LucideIcon> = {
  ScanLine,
  Sparkles,
  Database,
  FileSignature,
  Lock,
  ClipboardList,
  Gauge,
  ShieldCheck,
  MessageCircle,
  Bell,
  FileSpreadsheet,
  FolderSearch,
  Factory,
  ArrowLeftRight,
  Workflow,
  Users,
  Briefcase,
  IdCard,
  Search,
  PenLine,
  Phone,
};

const ACCENT_BG: Record<SystemAccent, string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
};

/**
 * Customer System Panel
 *
 * Workspace + Guest 디바이스 화면 아래에 가로로 표시되는 "고객사 시스템" 영역.
 * 시나리오에 정의된 systems[] 를 카드로 렌더하며, 현재 step.activeSystems 에
 * 포함된 시스템은 펄스 + 외곽 강조로 활성화 표시된다.
 * step.systemStatuses 가 있으면 시스템별 상태 텍스트를 override 한다.
 */
export function CustomerSystemPanel() {
  const scenario = useScenarioStore((s) => s.scenario);
  const step = useScenarioStore(selectCurrentStep);

  if (!scenario?.systems || scenario.systems.length === 0) return null;

  const systems = scenario.systems;
  const activeIds = new Set(step?.activeSystems ?? []);

  return (
    <section className="mt-3 shrink-0 rounded-2xl border border-surface-border bg-white p-2 shadow-sm">
      <header className="mb-1.5 flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
          외부 시스템
        </span>
        <span className="text-[10px] text-ink-muted">
          {systems.length}개 시스템 · 활성 {activeIds.size}개
        </span>
      </header>

      <ul
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${systems.length}, minmax(0, 1fr))` }}
      >
        {systems.map((node) => (
          <SystemCard key={node.id} node={node} isActive={activeIds.has(node.id)} stepStatus={step?.systemStatuses?.[node.id]} />
        ))}
      </ul>
    </section>
  );
}

interface SystemCardProps {
  node: SystemNode;
  isActive: boolean;
  stepStatus?: string;
}

function SystemCard({ node, isActive, stepStatus }: SystemCardProps) {
  const Icon: LucideIcon = (node.icon ? ICON_MAP[node.icon] : undefined) ?? Workflow;
  const accent = ACCENT_BG[node.accent ?? 'slate'];
  const status =
    stepStatus ?? (isActive ? node.activeStatus ?? '동작 중' : node.defaultStatus ?? '연동 대기');

  return (
    <li
      className={cn(
        'relative flex min-w-0 flex-col gap-1 rounded-xl border bg-white px-2.5 py-2 transition-all duration-300',
        isActive
          ? 'border-brand-primary shadow-[0_0_0_3px_rgba(79,70,229,0.16)]'
          : 'border-surface-border opacity-95'
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', accent)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-ink-primary">{node.label}</span>
          {node.labelEn && (
            <span className="truncate text-[10px] text-ink-muted">{node.labelEn}</span>
          )}
        </div>
      </div>
      <span
        className={cn(
          'flex items-center gap-1 text-[10px] leading-tight',
          isActive ? 'text-brand-primary' : 'text-ink-muted'
        )}
      >
        <span
          className={cn(
            'inline-block h-1.5 w-1.5 shrink-0 rounded-full',
            isActive ? 'animate-pulse bg-brand-primary' : 'bg-ink-muted/40'
          )}
        />
        <span className="truncate">{status}</span>
      </span>
    </li>
  );
}
