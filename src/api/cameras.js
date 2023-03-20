import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';

const { index, show, update, destroy, create } = resourceApi('cameras');
const search = searchApi('cameras');

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {} } = params;
  return index({
    page,
    perPage,
    query: {
      ...query,
      parking_lot_id: filters.parking_lot_id
    }
  });
};

export { filterFetcher, show, update, destroy, create, search };
