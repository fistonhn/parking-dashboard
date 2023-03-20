import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, create } = resourceApi('permits');

const search = searchApi('permits');

const filterFetcher = (params = {}) => {
  const { page, perPage = 20, filters = {}, query } = params;

  let from, to;

  if (filters.range) {
    from = filters.range.from;
    to = filters.range.to;
  }

  return index({
    page,
    perPage,
    query: {
      ...query,
      range: {
        from,
        to
      }
    }
  });
};

export { filterFetcher, show, update, create, search };
