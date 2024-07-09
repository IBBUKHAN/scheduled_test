// Function to split full name into first name and last name
function splitName(fullName) {
  // Split the full name by spaces
  const nameParts = fullName.trim().split(" ");

  // Handle the case where only one name part is provided
  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: "" };
  }

  // Get the first name and last name
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" "); // Join the rest to form the last name

  return { firstName, lastName };
}

// Example usage
const fullName1 = "IBRAHIM";
const fullName2 = "SYED ZAIRAN NADEEM";

const { firstName: firstName1, lastName: lastName1 } = splitName(fullName1);
const { firstName: firstName2, lastName: lastName2 } = splitName(fullName2);

console.log(`Full Name: ${fullName1}`);
console.log(`First Name: ${firstName1}`);
console.log(`Last Name: ${lastName1}`);
console.log();
console.log(`Full Name: ${fullName2}`);
console.log(`First Name: ${firstName2}`);
console.log(`Last Name: ${lastName2}`);
