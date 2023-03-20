import resourceApi from 'components/modules/resource_api';

const { index, show, update, create } = resourceApi('users');

const filterFetcher = (params = {}) => {
  const { page = 1, perPage = 20, query, filters = {} } = params;

  return index({
    page,
    perPage,
    query: {
      ...query,
      users: {
        first_name: filters.first_name,
        last_name: filters.last_name
      },
      range: {
        from: filters.created_at && filters.created_at.from,
        to: filters.created_at && filters.created_at.to
      }
    }
  });
};

export { filterFetcher, show, update, create, index };
