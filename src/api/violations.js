import fetchApi from 'components/modules/fetch_api';
import resourceApi from 'components/modules/resource_api';

const { index, show, update, create, destroy } = resourceApi('parking/violations');

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
      agency_id: filters.agency_id,
      officer_id: filters.officer_id,
      ticket_id: filters.ticket_id,
      parking_lot_id: filters.parking_lot_id,
      ticket_status: filters.ticket_status,
      violation_type: filters.violation_type
    }
  });
};

const filterFetcherActivityLogs = (params = {}) => {
  const { page, perPage = 10, filters = {}, query, id } = params;

  let from, to;
  if (filters.range) {
    from = filters.range.from;
    to = filters.range.to;
  }

  return fetchApi(`dashboard/parking/violations/${id}/violation_history_logs`, {
    method: 'GET',
    params: {
      ...query,
      page,
      per_page: perPage,
      range: {
        from,
        to
      },
      activity_log: filters.activity_log
    }
  });
};

export {
  filterFetcher,
  filterFetcherActivityLogs,
  index,
  show,
  create,
  update,
  destroy
};
