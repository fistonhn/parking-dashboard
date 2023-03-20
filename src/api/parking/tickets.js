import resourceApi from 'components/modules/resource_api';
import fetchApi from 'components/modules/fetch_api';
const resources = 'parking/tickets';
const { show, update } = resourceApi(resources);

const index = (params = {}) => {
  const { page, perPage, agency_id, query } = params;
  return fetchApi(`dashboard/${resources}`, { method: 'GET', params: { page, perPage, agency_id, ...query } });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, query, filters = {}, agency_id } = params;

  if (filters.range) {
    var from = filters.range.from;
    var to = filters.range.to;
  }

  return index({
    page,
    perPage,
    agency_id: agency_id,
    query: Object.assign({}, query, {
      ticket_id: filters.ticket_id,
      admin_ids: filters.admin_ids,
      agency_ids: filters.agency_ids,
      type: filters.type,
      query: filters.query,
      status: filters.status,
      range: {
        from,
        to
      }
    })
  });
};

export { filterFetcher, show, update };
