import resourceApi from 'components/modules/resource_api';

const { index } = resourceApi('voi_vehicles');

const filterFetcher = (params = {}) => {
  const { page, perPage = 20, id, query, filters = {} } = params;
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
      parking_lot_id: id,
      plate_number: filters.plate_number,
      range: {
        from,
        to
      }
    }
  });
};

export { filterFetcher, index };
