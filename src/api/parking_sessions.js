import fetchApi from 'components/modules/fetch_api';

const show = (params = {}) => {
  const { id } = params;
  return fetchApi(`dashboard/parking_sessions/${id}`, { method: 'GET' });
};

const index = (params = {}) => {
  const { page, perPage, parkingLotId, vehicleId, query } = params;
  return fetchApi(`dashboard/parking_sessions`, { method: 'GET',
    params: {
      page, perPage, parking_lot_id: parkingLotId, vehicle_id: vehicleId, ...query
    } });
};

const filterFetcher = (params = {}) => {
  const { page, perPage, query, id, filters = {} } = params;
  return index({
    page,
    perPage,
    query: Object.assign({}, {
      ...query,
      parking_session_id: filters.id,
      payment_methods: filters.payment_methods,
      statuses: filters.statuses,
      user_ids: filters.user_ids,
      kiosk_ids: filters.kiosk_ids,
      created_at: filters.created_at,
      check_in: filters.check_in,
      check_out: filters.check_out,
      slot_name: filters.slot_name,
      fee_applied: filters.fee_applied,
      total_price: filters.total_price,
      query: {
        vehicles: {
          plate_number: filters.vehicles_plate_number
        }
      }
    }),
    parkingLotId: id
  });
};

const subscriberVehicleSessionsFilterFetcher = (params = {}) => {
  const { page, perPage, query, id, filters = {} } = params;
  return index({
    page,
    perPage,
    query: Object.assign({}, {
      ...query,
      parking_session_id: filters.id,
      payment_methods: filters.payment_methods,
      statuses: filters.statuses,
      user_ids: filters.user_ids,
      kiosk_ids: filters.kiosk_ids,
      created_at: filters.created_at,
      check_in: filters.check_in,
      check_out: filters.check_out,
      slot_name: filters.slot_name,
      fee_applied: filters.fee_applied,
      total_price: filters.total_price,
      query: {
        vehicles: {
          plate_number: filters.vehicles_plate_number
        }
      }
    }),
    vehicleId: id
  });
};

export { filterFetcher, subscriberVehicleSessionsFilterFetcher, show };
