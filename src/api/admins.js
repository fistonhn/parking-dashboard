import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, destroy, create } = resourceApi('admins');

const search = (query) => {
  return fetchApi(`dashboard/admins/search`, { method: 'GET', params: { ...query, status: 'active' } });
};

const checkAdminPassword = (password) => {
  return fetchApi(`dashboard/admins/check_password`, { method: 'POST', data: { password } });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;
  return (
    index({
      page,
      perPage,
      query: Object.assign({}, query, {
        role_names: filters.role_names,
        status: filters.status,
        query: {
          email: filters.email,
          username: filters.username,
          name: filters.name
        }
      })
    })
  );
};

export { filterFetcher, show, update, destroy, create, search, checkAdminPassword };
