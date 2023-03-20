import resourceApi from 'components/modules/resource_api';

const { index } = resourceApi('reports');
const filterFetcher = (params = {}) => {
  const { page, perPage = 20, query, filters = {} } = params;
  if (filters.range) {
    var from = filters.range.from;
    var to = filters.range.to;
  }
  return index({
    page,
    perPage,
    query: {
      ...query,
      name: filters.name,
      type: filters.type,
      range: {
        from,
        to
      }
    }
  });
};

export { filterFetcher };
