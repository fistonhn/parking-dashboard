const list = res => {
  return {
    list: res.data,
    total: parseInt(res.headers['x-total'], 10),
    perPage: parseInt(res.headers['x-per-page'], 10),
    page: parseInt(res.headers['x-page'], 10)
  };
};

export { list };
