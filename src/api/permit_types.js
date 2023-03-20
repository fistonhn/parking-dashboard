import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, create, destroy } = resourceApi('permit_types');

const search = searchApi('permit_types');

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

export { filterFetcher, index, show, update, create, destroy, search };
