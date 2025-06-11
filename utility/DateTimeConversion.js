export function convertUTCToMalaysiaISOString(dayOfWeek, timeStr) {
  // Get today's UTC date
  const now = new Date();
  const todayDay = now.getUTCDay();

  // Calculate day difference to the target dayOfWeek
  let dayDiff = dayOfWeek - todayDay;
  if (dayDiff < 0) dayDiff += 7;

  // Reference date in UTC for the target day
  const baseDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + dayDiff
    )
  );

  // Parse "HH:mm"
  const [hoursStr, minutesStr] = timeStr.split(":");
  const utcHours = parseInt(hoursStr, 10);
  const utcMinutes = parseInt(minutesStr, 10);

  // Set UTC time
  baseDate.setUTCHours(utcHours);
  baseDate.setUTCMinutes(utcMinutes);
  baseDate.setUTCSeconds(0);
  baseDate.setUTCMilliseconds(0);

  // Add 8 hours to convert to Malaysia time
  const malaysiaDate = new Date(baseDate.getTime() + 8 * 60 * 60 * 1000);

  // Return ISO string (in UTC timezone)
  return new Date(malaysiaDate.toISOString()); // this will be in UTC format
}

export function convertMalaysiaToUTC(dayOfWeek, timeStr) {
  // Get current date in Malaysia Time
  const now = new Date();
  const malaysiaOffsetMs = 8 * 60 * 60 * 1000;

  // Get current day in Malaysia time
  const malaysiaNow = new Date(now.getTime() + malaysiaOffsetMs);
  const currentMalaysiaDay = malaysiaNow.getUTCDay();

  // Calculate how many days to add to get to target dayOfWeek
  let dayDiff = dayOfWeek - currentMalaysiaDay;
  if (dayDiff < 0) dayDiff += 7;

  // Create base date in Malaysia time (UTC +8)
  const targetMalaysiaDate = new Date(
    malaysiaNow.getUTCFullYear(),
    malaysiaNow.getUTCMonth(),
    malaysiaNow.getUTCDate() + dayDiff
  );

  // Parse timeStr ("HH:mm") and apply it in Malaysia time
  const [hoursStr, minutesStr] = timeStr.split(":");
  targetMalaysiaDate.setHours(parseInt(hoursStr, 10));
  targetMalaysiaDate.setMinutes(parseInt(minutesStr, 10));
  targetMalaysiaDate.setSeconds(0);
  targetMalaysiaDate.setMilliseconds(0);

  // Convert Malaysia time to UTC by subtracting 8 hours
  const utcDate = new Date(targetMalaysiaDate.getTime() - malaysiaOffsetMs);

  // Return as ISO 8601 string
  return utcDate.toISOString();
}

export function convertMalaysiaTimeISOToUTC(isoStringMYT) {
  // Parse the input as if it's in Malaysia Time (UTC+8)
  const localDate = new Date(isoStringMYT);

  // Convert to UTC by subtracting 8 hours
  const utcDate = new Date(localDate.getTime() - 8 * 60 * 60 * 1000);

  return utcDate;
}

export function convertMalaysiaTimeToUTC(utcDate) {
  const malaysiaOffset = 8 * 60; // +8 hours in minutes
  return new Date(utcDate.getTime() - malaysiaOffset * 60 * 1000);
}

export function convertUTCToMalaysiaTime(utcDate) {
  const malaysiaOffset = 8 * 60; // +8 hours in minutes
  return new Date(utcDate.getTime() + malaysiaOffset * 60 * 1000);
}

export function convertToTimeComponents(isoString) {
  const date = new Date(isoString);
  // Convert to Malaysia time (UTC+8)
  const malaysiaDate = new Date(date.getTime());

  const hours = malaysiaDate.getHours().toString().padStart(2, "0");
  const minutes = malaysiaDate.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const year = malaysiaDate.getFullYear();
  const month = (malaysiaDate.getMonth() + 1).toString().padStart(2, "0");
  const day = malaysiaDate.getDate().toString().padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  return [time, dateStr];
}
