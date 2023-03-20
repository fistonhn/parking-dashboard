import fetchApi from 'components/modules/fetch_api';

const searchApi = resources => {
  const search = (query = {}) => {
    return fetchApi(`dashboard/${resources}/search`, { method: 'GET', params: { ...query } });
  };

  return search;
};

export default searchApi;
