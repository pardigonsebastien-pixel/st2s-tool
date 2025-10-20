import { SessionData, ParticipationCSVRow, ClicksCSVRow } from '../types/participation';
import { Eleve } from '../lib/supabase';

export function generateParticipationCSV(
  sessionData: SessionData,
  elevesMap: Map<string, Eleve>
): string {
  const rows: ParticipationCSVRow[] = [];

  Object.entries(sessionData.eleves).forEach(([eleveId, participation]) => {
    const eleve = elevesMap.get(eleveId);
    if (!eleve) return;

    rows.push({
      session_id: sessionData.session_id,
      session_datetime: sessionData.session_datetime,
      classe: sessionData.classe,
      eleve_id: eleveId,
      nom: eleve.nom,
      prenom: eleve.prenom,
      pre_total: participation.pre_total,
      session_raw: participation.session_raw,
      cap_applied: participation.cap_applied ? 'ON' : 'OFF',
      cap_limit: 3,
      session_capped: participation.session_capped,
      post_total: participation.post_total,
      override_reason: participation.cap_applied ? '' : 'Cap manually disabled'
    });
  });

  const headers = [
    'session_id',
    'session_datetime',
    'classe',
    'eleve_id',
    'nom',
    'prenom',
    'pre_total',
    'session_raw',
    'cap_applied',
    'cap_limit',
    'session_capped',
    'post_total',
    'override_reason'
  ];

  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const values = [
      row.session_id,
      row.session_datetime,
      row.classe,
      row.eleve_id,
      row.nom,
      row.prenom,
      row.pre_total.toString(),
      row.session_raw.toString(),
      row.cap_applied,
      row.cap_limit.toString(),
      row.session_capped.toString(),
      row.post_total.toString(),
      row.override_reason
    ];
    csvLines.push(values.join(','));
  });

  return csvLines.join('\n');
}

export function generateClicksCSV(sessionData: SessionData): string {
  const rows: ClicksCSVRow[] = [];

  Object.entries(sessionData.eleves).forEach(([eleveId, participation]) => {
    participation.clicks.forEach((click) => {
      rows.push({
        session_id: sessionData.session_id,
        session_datetime: sessionData.session_datetime,
        classe: sessionData.classe,
        eleve_id: eleveId,
        click_timestamp: click.timestamp,
        item_value: click.value,
        cumulated_raw_after_click: click.cumulatedRawAfterClick,
        actor: 'teacher'
      });
    });
  });

  rows.sort((a, b) => a.click_timestamp.localeCompare(b.click_timestamp));

  const headers = [
    'session_id',
    'session_datetime',
    'classe',
    'eleve_id',
    'click_timestamp',
    'item_value',
    'cumulated_raw_after_click',
    'actor'
  ];

  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const values = [
      row.session_id,
      row.session_datetime,
      row.classe,
      row.eleve_id,
      row.click_timestamp,
      row.item_value.toString(),
      row.cumulated_raw_after_click.toString(),
      row.actor
    ];
    csvLines.push(values.join(','));
  });

  return csvLines.join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function formatDatetimeForFilename(datetime: string): string {
  return datetime
    .replace(/[:-]/g, '')
    .replace('T', '_')
    .substring(0, 15);
}
