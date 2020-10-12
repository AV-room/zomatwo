export const withinRange = (range: number[], value: number) =>
  value >= range[0] && value <= range[1];

export const convertPriceBracketToSymbol = (priceBracket: number) => {
  let symbolString = '';
  for (let i = 0; i < priceBracket; i++) {
    symbolString = `${symbolString}$`;
  }

  return symbolString;
};

export const getTimeoutPromise = (): Promise<any> =>
  new Promise((resolve, reject) => setTimeout(() => reject(), 20000));
