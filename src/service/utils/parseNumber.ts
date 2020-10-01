const parseNumber = (value: any): number | null => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

export default parseNumber;
