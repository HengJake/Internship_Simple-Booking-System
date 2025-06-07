function convertMalaysiaTimeISOToUTC(isoStringMYT) {
  // Parse the input as if it's in Malaysia Time (UTC+8)
  const localDate = new Date(isoStringMYT);

  // Convert to UTC by subtracting 8 hours
  const utcDate = new Date(localDate.getTime() - 8 * 60 * 60 * 1000);

  return utcDate;
}

const utcTime = convertMalaysiaTimeISOToUTC("2025-06-08T17:00:00");
console.log(utcTime.toISOString());