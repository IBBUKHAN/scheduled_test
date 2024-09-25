function parseBudget(input) {
  // Use regular expressions to extract all numbers from the input string
  const matches = input.match(/\d+/g);

  // If no numbers are found, return null for both budgets
  if (!matches) {
    return { minBudget: null, maxBudget: null };
  }

  // Convert matches to numbers
  const numbers = matches.map(Number);

  // If only one number is found, set it as minBudget
  if (numbers.length === 1) {
    return { minBudget: numbers[0], maxBudget: null };
  }

  // If two numbers are found, set the first as minBudget and the second as maxBudget
  if (numbers.length >= 2) {
    return { minBudget: numbers[0], maxBudget: numbers[1] };
  }
}

// Example usage
const input1 = "300 - 500";
const input2 = "My budget is 1000 to 2000";

console.log(parseBudget(input1)); // { minBudget: 1000, maxBudget: null }
console.log(parseBudget(input2)); // { minBudget: 1000, maxBudget: 2000 }
