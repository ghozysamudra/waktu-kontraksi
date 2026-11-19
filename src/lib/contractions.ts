export const storageKey = 'waktu-kontraksi.v1';

export type Contraction = {
  startedAt: number;
  endedAt: number;
};

export type Session = {
  activeStart: number | null;
  records: Contraction[];
};

export function readSession(raw: string | null): Session {
  if (raw === null) return { activeStart: null, records: [] };

  const parsed: Session | null = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.records)) throw new Error('Invalid contraction data');

  const records = parsed.records
    .filter(
      (record) =>
        record &&
        isTimestamp(record.startedAt) &&
        isTimestamp(record.endedAt) &&
        record.endedAt >= record.startedAt
    )
    .sort((first, second) => second.startedAt - first.startedAt);

  return {
    activeStart: isTimestamp(parsed.activeStart) ? parsed.activeStart : null,
    records
  };
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= 8.64e15;
}

export function formatElapsed(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const parts = hours ? [hours, minutes, seconds % 60] : [minutes, seconds % 60];
  return parts.map((part) => String(part).padStart(2, '0')).join(':');
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.round(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const remainingSeconds = seconds % 60;

  if (hours) return `${hours} jam ${minutes} mnt`;
  if (minutes) return `${minutes} mnt ${remainingSeconds} dtk`;
  return `${seconds} dtk`;
}
