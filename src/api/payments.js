import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';
import fetchApi from 'components/modules/fetch_api';

const { index, show, update, create } = resourceApi('payments');

const search = searchApi('payments');

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
      ...filters
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

  return fetchApi(`dashboard/parking/payments/${id}/payment_history_logs`, {
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

export { filterFetcher, show, update, create, search, filterFetcherActivityLogs };
