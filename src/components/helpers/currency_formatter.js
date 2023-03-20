export const formatToUSD = (money) => {
  return money.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
