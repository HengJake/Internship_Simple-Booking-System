export function convertUTCToMalaysiaISOString(dayOfWeek, timeStr) {
  const now = new Date();
  const todayDay = now.getUTCDay(); // 0 (Sun) - 6 (Sat)

  // Calculate day difference from today to desired dayOfWeek
  let dayDiff = dayOfWeek - todayDay;
  if (dayDiff < 0) dayDiff += 7;

  // Create a UTC base date for the correct day
  const baseUtcDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + dayDiff
    )
  );

  // Set UTC time
  const [hour, minute] = timeStr.split(":").map(Number);
  baseUtcDate.setUTCHours(hour, minute, 0, 0);

  // Use Intl.DateTimeFormat to format as Malaysia time
  const malaysiaTimeParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(baseUtcDate);

  const parts = {};
  malaysiaTimeParts.forEach(({ type, value }) => {
    if (type !== "literal") parts[type] = value;
  });

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

// convert Malaysia YYYY-MM-DD, [09:00] to UTC ISOString
export function convertMalaysiaToUTCISOString(dateStr, timeStr) {
  console.log(dateStr, timeStr);

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create Date object as if it's Malaysia local time (UTC+8)
  const malaysiaTimeAsUTC  = Date.UTC(year, month - 1, day, hours, minutes, 0);

  // Convert to UTC ISO string by subtracting 8 hours (in milliseconds)
  const utcDate = new Date(malaysiaTimeAsUTC - 8 * 60 * 60 * 1000);

  return utcDate.toISOString(); // in UTC with Z
}

// convert Malaysian ISOString to UTC Date Object
export function convertMalaysiaTimeISOToUTC(isoStringMYT) {
  // Parse the input as if it's in Malaysia Time (UTC+8)
  const localDate = new Date(isoStringMYT);

  // Convert to UTC by subtracting 8 hours
  const utcDate = new Date(localDate.getTime() - 8 * 60 * 60 * 1000);

  return utcDate;
}

// convert Malaysian Date Object to UTC Date object
export function convertMalaysiaTimeToUTC(utcDate) {
  const malaysiaOffset = 8 * 60; // +8 hours in minutes
  return new Date(utcDate.getTime() - malaysiaOffset * 60 * 1000);
}

// convert UTC Date Object to Malaysia Date object
export function convertUTCToMalaysiaTime(utcDate) {
  const malaysiaOffset = 8 * 60; // +8 hours in minutes
  return new Date(utcDate.getTime() + malaysiaOffset * 60 * 1000);
}

// convert Malaysian isoString to [00:00, YYYY-MM-DD]
export function convertToTimeComponents(isoString) {
  // Split date and time parts manually to avoid timezone shifts
  const [datePart, timePart] = isoString.split("T");
  const [hours, minutes] = timePart.split(":");

  const time = `${hours}:${minutes}`;
  const date = datePart;

  return [time, date];
}
