import fetchApi from 'components/modules/fetch_api';

const index = (params = {}) => {
  const { page, perPage, query } = params;
  return fetchApi(`dashboard/parking_rules`, { method: 'GET', params: { page, perPage, ...query } });
};

const update = (params = {}) => {
  const { page, perPage, parkingLotId, agencyId, query } = params;
  return fetchApi(`dashboard/parking_rules`, { method: 'PUT', params: { page, perPage, ...query, parking_lot_id: parkingLotId, agency_id: agencyId } });
};

export { index, update };
