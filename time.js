function convertDateFormat(inputDate) {
  // Check if the input date is in the format "DD/MM/YYYY"
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = inputDate.match(dateRegex);

  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];

    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  // If not in the "DD/MM/YYYY" format, proceed with the existing logic
  const cleanedDate = inputDate.replace(
    /(\d+)(st|nd|rd|th)( of)? (\w+)/i,
    "$1 $4"
  );

  const dateComponents = cleanedDate.split(" ");
  const hasDayFirst = !isNaN(dateComponents[0]);
  const dayWithSuffix = hasDayFirst ? dateComponents[0] : dateComponents[1];

  const day = dayWithSuffix.replace(/\D/g, "");

  const month = hasDayFirst ? dateComponents[1] : dateComponents[0];

  const validMonths = [
    { name: "January", abbr: "Jan" },
    { name: "February", abbr: "Feb" },
    { name: "March", abbr: "Mar" },
    { name: "April", abbr: "Apr" },
    { name: "May", abbr: "May" },
    { name: "June", abbr: "Jun" },
    { name: "July", abbr: "Jul" },
    { name: "August", abbr: "Aug" },
    { name: "September", abbr: "Sep" },
    { name: "October", abbr: "Oct" },
    { name: "November", abbr: "Nov" },
    { name: "December", abbr: "Dec" },
  ];

  const formattedMonthInfo = validMonths.find(
    (validMonth) =>
      validMonth.name.toLowerCase() === month.toLowerCase() ||
      validMonth.abbr.toLowerCase() === month.toLowerCase()
  );

  if (!formattedMonthInfo) {
    console.error("Invalid month name or abbreviation");
    return inputDate;
  }

  const monthIndex = validMonths.indexOf(formattedMonthInfo) + 1;
  const formattedMonthString = monthIndex.toString().padStart(2, "0");
  const year = 2015;
  const formattedDay = day.padStart(2, "0");
  const formattedDate = `${formattedDay}/${formattedMonthString}/${year}`;

  return formattedDate;
}

// Example usage with a manually entered date
const inputDate = "19/01/2023";
const convertedDate = convertDateFormat(inputDate);

if (convertedDate !== null) {
  console.log(convertedDate); // Output: 19/08/2023 (unchanged in this case)
}
