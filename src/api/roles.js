import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, create, destroy } = resourceApi('roles');

const filterFetcher = (params = {}) => {
  const { page, perPage = 20, query } = params;

  return index({
    page,
    perPage,
    query
  });
};

const fetchPermissionsAvailable = () => {
  return fetchApi('dashboard/permissions/permissions_available', { method: 'GET' });
};

export {
  filterFetcher,
  index,
  show,
  create,
  update,
  destroy,
  fetchPermissionsAvailable
};
