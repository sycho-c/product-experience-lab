import type { DeviceKind, Talk } from './talk';
import type { UIAction, UISimSeed } from './uiaction';

export type ScenarioCategory =
  | 'customer-case'
  | 'feature'
  | 'future-concept'
  | 'industry';

export type ScenarioDifficulty = 'easy' | 'medium' | 'hard';

/** 고객사 시스템 노드 — workspace+guest 화면 아래 가로 줄지어 표시되는 외부 연계 시스템 카드.
 *  단계별로 activeSystems 와 systemStatuses 로 활성화/상태가 갱신된다. */
export type SystemAccent = 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
export interface SystemNode {
  id: string;
  label: string;
  labelEn?: string;
  /** 단계별로 systemStatuses 가 override 하지 않으면 기본 상태로 표시된다. */
  defaultStatus?: string;
  activeStatus?: string;
  /** 카드 아이콘 색 톤 */
  accent?: SystemAccent;
  /** Lucide 아이콘 이름 (예: 'ScanLine', 'Database') — runtime 에서 lucide-react map 으로 조회 */
  icon?: string;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  description?: string;
  guide?: string;
  durationMs?: number;
  autoAdvance?: boolean;
  talks: Talk[];
  /** 신규: 마이크로 UI 액션 시퀀스. 있으면 ⏭/⏮ 가 액션 단위. */
  actions?: UIAction[];
  uiState?: Record<string, unknown>;
  /** 이 단계에서 펄스로 표시되는 활성 시스템 id 목록. */
  activeSystems?: string[];
  /** 이 단계에서만 보이는 시스템 상태 텍스트 override. {시스템id: 상태} */
  systemStatuses?: Record<string, string>;
}

export interface ImpactMetric {
  label: string;
  before: number;
  after: number;
  unit: '%' | 'min' | 'count';
  improvementDirection: 'down' | 'up';
}

export interface ScenarioCustomer {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface ScenarioMeta {
  id: string;
  title: string;
  summary?: string;
  category: ScenarioCategory;
  customer?: ScenarioCustomer;
  /** 카테고리 칩 옆에 함께 노출되는 부가 라벨 (예: '기능', '흐름'). */
  tag?: string;
  difficulty: ScenarioDifficulty;
  durationMinutes: number;
  devices: DeviceKind[];
}

export interface Scenario extends ScenarioMeta {
  /**
   * 부모 시나리오 id. 지정 시 부모의 모든 step.actions 를 적용한 최종 상태를
   * 시작 시점 seed 로 사용한다. 자식의 자체 seed 는 그 위에 덮어쓴다.
   */
  extends?: string;
  /** 시작 위치 — 시나리오 로드 시 ui-simulation 스토어에 적용되는 초기 상태. */
  seed?: UISimSeed;
  steps: Step[];
  beforeSteps?: Step[];
  metrics?: ImpactMetric[];
  goals?: string[];
  /** workspace+guest 화면 아래 가로로 표시되는 고객사 시스템 카드들. 단계별로 step.activeSystems 로 활성화. */
  systems?: SystemNode[];
}

export type ScenarioSummary = ScenarioMeta;
