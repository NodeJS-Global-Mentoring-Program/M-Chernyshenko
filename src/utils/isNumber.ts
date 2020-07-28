const isNumber = (value: any): boolean => {
  if (typeof value === 'number') {
    return true;
  }

  const parsedValue = Number(value);
  if (!isNaN(parsedValue)) {
    return true;
  }

  return false;
};

export default isNumber;
