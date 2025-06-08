// ============Convert "00:00" to UTC time====================
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
  const malaysiaDate = new Date(baseDate.getTime() - 8 * 60 * 60 * 1000);

  // Return ISO string (in UTC timezone)
  return new Date(malaysiaDate.toISOString()); // this will be in UTC format
}

export function convertMalaysiaTimeISOToUTC(isoStringMYT) {
  // Parse the input as if it's in Malaysia Time (UTC+8)
  const localDate = new Date(isoStringMYT);

  // Convert to UTC by subtracting 8 hours
  const utcDate = new Date(localDate.getTime() - 8 * 60 * 60 * 1000);

  return utcDate;
}

export function convertUTCToMalaysiaTime(utcDate) {
  const malaysiaOffset = 8 * 60; // +8 hours in minutes
  return new Date(utcDate.getTime() + malaysiaOffset * 60 * 1000);
}
