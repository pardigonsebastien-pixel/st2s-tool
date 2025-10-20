export type ClickValue = -2 | -1 | -0.5 | 0 | 0.5 | 1 | 2 | 3;

export interface Click {
  timestamp: string;
  value: ClickValue;
  cumulatedRawAfterClick: number;
}

export interface EleveParticipation {
  eleve_id: string;
  clicks: Click[];
  session_raw: number;
  cap_applied: boolean;
  session_capped: number;
  pre_total: number;
  post_total: number;
}

export interface SessionData {
  session_id: string;
  session_datetime: string;
  classe: string;
  groupe: string;
  eleves: Record<string, EleveParticipation>;
}

export interface ParticipationCSVRow {
  session_id: string;
  session_datetime: string;
  classe: string;
  eleve_id: string;
  nom: string;
  prenom: string;
  pre_total: number;
  session_raw: number;
  cap_applied: string;
  cap_limit: number;
  session_capped: number;
  post_total: number;
  override_reason: string;
}

export interface ClicksCSVRow {
  session_id: string;
  session_datetime: string;
  classe: string;
  eleve_id: string;
  click_timestamp: string;
  item_value: ClickValue;
  cumulated_raw_after_click: number;
  actor: string;
}
