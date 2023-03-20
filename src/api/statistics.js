import resourceApi from 'components/modules/resource_api';

const { index } = resourceApi('statistics');

const filterFetcher = (params = {}) => {
  const { filters = {} } = params;
  var from, to;
  if (filters.range) {
    from = filters.range.from;
    to = filters.range.to;
  } else if (params.range) {
    from = params.range.from;
    to = params.range.to;
  }

  return index({
    query: {
      type: params.type,
      parking_lot_ids: params.parkingLotIds,
      range: {
        from,
        to
      }
    }
  });
};

export { filterFetcher };
