export function getAgeComponents(birthDateValue: string, now = new Date()) {
  const [birthYear, birthMonth, birthDay] = birthDateValue.split("-").map(Number);
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  function addMonthsClamped(date: Date, months: number) {
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(date.getDate(), lastDay));
    return target;
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  while (addMonthsClamped(birthDate, years * 12) > now) years -= 1;
  while (addMonthsClamped(birthDate, (years + 1) * 12) <= now) years += 1;

  let months = 0;
  while (addMonthsClamped(birthDate, years * 12 + months + 1) <= now) months += 1;

  let cursor = addMonthsClamped(birthDate, years * 12 + months);
  let days = 0;
  while (true) {
    const nextDay = new Date(cursor);
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay > now) break;
    cursor = nextDay;
    days += 1;
  }

  let remainingMs = now.getTime() - cursor.getTime();
  const hours = Math.floor(remainingMs / 3_600_000);
  remainingMs %= 3_600_000;
  const minutes = Math.floor(remainingMs / 60_000);
  remainingMs %= 60_000;

  return {
    "years old": years,
    month: months,
    days,
    hour: hours,
    minutes,
    seconds: Math.floor(remainingMs / 1_000),
  };
}