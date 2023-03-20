import fetchApi from 'components/modules/fetch_api';
import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';
import { generatePath } from 'react-router';

const { index, show, create } = resourceApi('vehicles');

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
  return fetchApi(generatePath(`dashboard/${resources}/${id}/${data.status}`), { method: 'PUT', data });
};

const updateValidation = (params = {}) => {
  const { id, data, nestedParams = {} } = params;
  return fetchApi(generatePath(`dashboard/${resources}/${id}`), { method: 'PUT', data });
};

export { filterFetcher, show, update, create, search, updateValidation };
