import fetchApi from 'components/modules/fetch_api';
import resourceApi from 'components/modules/resource_api';

const { index, show, update, create, destroy } = resourceApi('disputes');

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
      dispute_id: filters.id,
      created_at: filters.created_at,
      officer_id: filters.officer_id,
      user_name: filters.user_name,
      email: filters.email,
      parking_lot_id: filters.parking_lot_id,
      dispute_type: filters.dispute_type,
      status: filters.status
    }
  });
};

export {
  filterFetcher,
  index,
  show,
  create,
  update,
  destroy
};
