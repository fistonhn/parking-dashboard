function getRangeOfPage (total, page, perPage) {
  if (page < 1) return [0, 0];
  const fromNumber = (page - 1) * perPage + 1;
  if (fromNumber > total) return [0, 0];
  const toNumber = Math.min(page * perPage, total);
  return [fromNumber, toNumber];
}

export default getRangeOfPage;
