function parseBudget(input) {
  // Regex patterns for different input formats
  const fullPattern = /(\d+)\s+(\d+)\s+(\w+)/;
  const partialPattern = /(\d+)\s+(\d+)/;
  const singleWithUnitPattern = /(\d+)\s+(\w+)/;
  const singlePattern = /(\d+)/;

  let minBudget,
    maxBudget = "0",
    priceUnit;

  if (fullPattern.test(input)) {
    const match = input.match(fullPattern);
    [, minBudget, maxBudget, priceUnit] = match;
  } else if (partialPattern.test(input)) {
    const match = input.match(partialPattern);
    [, minBudget, maxBudget] = match;
  } else if (singleWithUnitPattern.test(input)) {
    const match = input.match(singleWithUnitPattern);
    [, minBudget, priceUnit] = match;
  } else if (singlePattern.test(input)) {
    const match = input.match(singlePattern);
    [, minBudget] = match;
  } else {
    throw new Error(
      "Invalid input format. Expected format: 'min_budget max_budget price_unit' or 'min_budget max_budget' or 'min_budget price_unit' or 'min_budget'"
    );
  }

  const data = {
    min_budget: minBudget,
    max_budget: maxBudget,
  };

  if (priceUnit) {
    data.price_unit = priceUnit;
  }

  return data;
}

// Example usage:
const input = "400 500 monthly";
try {
  const parsedData = parseBudget(input);
  console.log(parsedData);
} catch (error) {
  console.error(error.message);
}
