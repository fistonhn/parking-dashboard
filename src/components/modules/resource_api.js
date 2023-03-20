import fetchApi from 'components/modules/fetch_api';
import { generatePath } from 'react-router';

const resourceApi = resources => {
  const index = (params = {}) => {
    const { id, page, perPage, query, nestedParams = {} } = params;
    return fetchApi(
      generatePath(`dashboard/${resources}`, nestedParams),
      { method: 'GET', params: { id, page, per_page: perPage, ...query } }
    );
  };

  const show = (params = {}) => {
    const { id, nestedParams = {} } = params;
    return fetchApi(generatePath(`dashboard/${resources}/${id}`, nestedParams), { method: 'GET' });
  };

  const update = (params = {}) => {
    const { id, data, nestedParams = {} } = params;
    return fetchApi(generatePath(`dashboard/${resources}/${id}`, nestedParams), {
      method: 'PUT',
      data
    });
  };

  const destroy = (params = {}) => {
    const { id, nestedParams = {} } = params;
    return fetchApi(generatePath(`dashboard/${resources}/${id}`, nestedParams), {
      method: 'DELETE'
    });
  };

  const create = (params = {}) => {
    const { data, nestedParams = {} } = params;
    return fetchApi(generatePath(`dashboard/${resources}`, nestedParams), {
      method: 'POST',
      data
    });
  };

  return { index, show, update, destroy, create };
};

export default resourceApi;
