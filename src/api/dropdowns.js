import fetchApi from 'components/modules/fetch_api';

const search = (fieldName, query = {}) => {
  return fetchApi(`dashboard/dropdowns/${fieldName}`, { method: 'GET', params: { ...query } });
};

const searchV1 = (fieldName, query = {}) => {
  return fetchApi(`v1/dropdowns/${fieldName}`, { method: 'GET', params: { ...query } });
};

export { search, searchV1 };
