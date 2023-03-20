import fetchApi from 'components/modules/fetch_api';
import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';
import { generatePath } from 'react-router';

const index = (params = {}) => {
  const { id, page, perPage = 10, query } = params;
  return fetchApi(`dashboard/vehicles`, { method: 'GET', params: { page, per_page: perPage, user_id: id, ...query } });
};

const { show, create } = resourceApi('vehicles');

const search = searchApi('vehicles');

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
      },
      ...filters
    }
  });
};

const resources = 'vehicles';

const update = (params = {}) => {
  const { id, data, nestedParams = {} } = params;
  console.log('data', data);
  return fetchApi(generatePath(`dashboard/${resources}/${id}`), { method: 'PUT', data });
};

export { index, filterFetcher, show, update, create, search };
