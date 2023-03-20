import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';
import { generatePath } from 'react-router';

const { index, show, destroy, create, update } = resourceApi('notification_configurations');
const { index: fetchNotiTypes } = resourceApi('notifications/types');

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;

  return index({
    page,
    perPage,
    query: Object.assign({}, query, {
      types: filters.type
    })
  });
};

export { filterFetcher, fetchNotiTypes, show, update, create, destroy };
