export function TimeToNumber(time: string) {
  const [hour, minute, second] = time.split(":");
  return parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
}

export function NumberToTime(number: number) {
  const hour = Math.floor(number / 3600);
  const minute = Math.floor((number % 3600) / 60);
  const second = number % 60;
  return `${hour}:${minute}:${second}`;
}

export function formatTime(time: string | number) {
  let timeTmp: number;
  if (typeof time === "string") timeTmp = TimeToNumber(time);
  else timeTmp = time;

  const hour = Math.floor(timeTmp / 3600);
  const minute = Math.floor((timeTmp % 3600) / 60);

  const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
  const amPm = hour < 12 ? "am" : "pm";
  // 12 hour string
  const hourString = hour % 12 === 0 ? "12" : `${hour % 12}`;

  return `${hourString}.${minuteString}${amPm}`;
}
