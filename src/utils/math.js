export function roundNumber(numberToRound, numberOfDecimalPlaces) {
  if (numberToRound === 0) {
    return 0;
  }

  if (!numberToRound) {
    return '';
  }

  // Use regular expressions with the global flag to replace all occurrences
  const scrubbedNumber = numberToRound
    .toString()
    .replace(/\$/g, '') // Replace all occurrences of '$'
    .replace(/,/g, ''); // Replace all occurrences of ','

  return (
    Math.round(scrubbedNumber * Math.pow(10, numberOfDecimalPlaces)) /
    Math.pow(10, numberOfDecimalPlaces)
  );
}
}