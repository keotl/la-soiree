const MONTH_ABBRV: { [month: number]: string } = {
  1: "jan.",
  2: "fév.",
  3: "mar.",
  4: "avr.",
  5: "mai",
  6: "juin",
  7: "juil.",
  8: "août",
  9: "sept.",
  10: "oct.",
  11: "nov.",
  12: "déc.",
};

export function formatDate(datestring: string): string {
  const date = new Date(datestring);
  const month = MONTH_ABBRV[date.getMonth() + 1];
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  let remaining = seconds - days * 3600 * 24;
  const hours = Math.floor(remaining / 3600);
  remaining = remaining - hours * 3600;
  const minutes = Math.floor(remaining / 60);
  remaining = remaining - minutes * 60;

  return `${days > 0 ? days + "j" : ""}${hours > 0 ? hours + "h" : ""}${
    minutes > 0 ? minutes + "m" : ""
  }${remaining}s`;
}
