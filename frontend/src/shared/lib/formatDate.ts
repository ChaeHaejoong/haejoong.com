export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - d.getTime());

  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  if (diff < DAY * 3) {
    if (diff < MINUTE) return `${Math.floor(diff / SECOND)}초 전`;
    if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
    if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;

    return `${Math.floor(diff / DAY)}일 전`;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
