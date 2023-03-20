import fetchApi from 'components/modules/fetch_api';

const index = (params = {}) => {
  const { parkingLotId, page, perPage = 20, query, full } = params;
  return fetchApi(
    `dashboard/parking_lots/${parkingLotId}/parking_slots`,
    { method: 'GET', params: { page, per_page: perPage, full: !!full, ...query } }
  );
};

const filterFetcher = (params = {}) => {
  const { page, perPage, id } = params;
  return index({
    page,
    perPage,
    parkingLotId: id
  });
};

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/parking_slots/${id}`, { method: 'GET' });
};

const update = (params = {}) => {
  const { id } = params;
  return fetchApi(
    `dashboard/parking_slots/${id}`,
    { method: 'PUT', params: { id: params.id, parking_slot: params.data } }
  );
};

export { index, filterFetcher, show, update };
