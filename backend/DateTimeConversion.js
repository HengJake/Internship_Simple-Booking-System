// ============Convert "00:00" to UTC time====================
export function convertAvailabilityToUTC(dayOfWeek, timeStr) {
  // Malaysia timezone offset in minutes (+8 hours = 480 minutes)
  const MALAYSIA_OFFSET = 8 * 60;

  // Get today's date in UTC
  const now = new Date();

  // Get current day of week (0=Sun ... 6=Sat)
  const todayDay = now.getUTCDay();

  // Calculate how many days ahead is the desired dayOfWeek
  let dayDiff = dayOfWeek - todayDay;
  if (dayDiff < 0) dayDiff += 7; // next week if already passed

  // Reference date in UTC for the target day (00:00 UTC of that day)
  const refDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + dayDiff
    )
  );

  // Parse timeStr "HH:mm"
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Malaysia is UTC+8, so convert local time to UTC by subtracting 8 hours
  // So to get UTC time, subtract Malaysia offset from local hours/minutes
  let utcHours = hours - 8;
  let utcDate = new Date(refDate); // start of day UTC for target day

  // Handle negative hour (previous day)
  if (utcHours < 0) {
    utcDate.setUTCDate(utcDate.getUTCDate() - 1);
    utcHours += 24;
  }

  utcDate.setUTCHours(utcHours);
  utcDate.setUTCMinutes(minutes);
  utcDate.setUTCSeconds(0);
  utcDate.setUTCMilliseconds(0);

  return utcDate;
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
