import { ClickValue, EleveParticipation, Click } from '../types/participation';

export function calculateSessionRaw(clicks: Click[]): number {
  return clicks.reduce((sum, click) => sum + click.value, 0);
}

export function calculateSessionCapped(sessionRaw: number, capApplied: boolean): number {
  if (!capApplied) return sessionRaw;
  return Math.max(-3, Math.min(3, sessionRaw));
}

export function calculatePostTotal(preTotal: number, sessionCapped: number): number {
  return preTotal + sessionCapped;
}

export function addClickToParticipation(
  participation: EleveParticipation,
  value: ClickValue
): EleveParticipation {
  const newClick: Click = {
    timestamp: new Date().toISOString(),
    value,
    cumulatedRawAfterClick: participation.session_raw + value
  };

  const newClicks = [...participation.clicks, newClick];
  const newSessionRaw = calculateSessionRaw(newClicks);
  const newSessionCapped = calculateSessionCapped(newSessionRaw, participation.cap_applied);
  const newPostTotal = calculatePostTotal(participation.pre_total, newSessionCapped);

  return {
    ...participation,
    clicks: newClicks,
    session_raw: newSessionRaw,
    session_capped: newSessionCapped,
    post_total: newPostTotal
  };
}

export function undoLastClick(participation: EleveParticipation): EleveParticipation {
  if (participation.clicks.length === 0) return participation;

  const newClicks = participation.clicks.slice(0, -1);
  const newSessionRaw = calculateSessionRaw(newClicks);
  const newSessionCapped = calculateSessionCapped(newSessionRaw, participation.cap_applied);
  const newPostTotal = calculatePostTotal(participation.pre_total, newSessionCapped);

  return {
    ...participation,
    clicks: newClicks,
    session_raw: newSessionRaw,
    session_capped: newSessionCapped,
    post_total: newPostTotal
  };
}

export function toggleCap(participation: EleveParticipation): EleveParticipation {
  const newCapApplied = !participation.cap_applied;
  const newSessionCapped = calculateSessionCapped(participation.session_raw, newCapApplied);
  const newPostTotal = calculatePostTotal(participation.pre_total, newSessionCapped);

  return {
    ...participation,
    cap_applied: newCapApplied,
    session_capped: newSessionCapped,
    post_total: newPostTotal
  };
}

export function initializeParticipation(eleveId: string, preTotal: number = 0): EleveParticipation {
  return {
    eleve_id: eleveId,
    clicks: [],
    session_raw: 0,
    cap_applied: true,
    session_capped: 0,
    pre_total: preTotal,
    post_total: preTotal
  };
}
