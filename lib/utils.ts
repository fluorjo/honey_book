export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}
export function formatToTime(date: string): string {
  const day = new Date(date);
  const year = day.getFullYear();
  const month = day.getMonth() + 1; // 월 추출 (월은 0부터 시작하므로 1을 더해줍니다)
  const dateOfMonth = day.getDate(); // 일 추출
  return `${year}. ${month}. ${dateOfMonth}.`;
}

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
