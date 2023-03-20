import resourceApi from 'components/modules/resource_api';

const { create, index } = resourceApi('comments');

const filterFetcher = (params, subjectType) => {
  const { page, perPage = 10, query, filters = {}, id } = params;
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
      subject_id: id,
      subject_type: subjectType,
      officer_id: filters.officer_id,
      user_name: filters.user_name,
      range: {
        from,
        to
      }
    }
  });
};

const filterFetcherViolation = (params = {}) => {
  return filterFetcher(params, 'Parking::Violation');
};

const filterFetcherDispute = (params = {}) => {
  return filterFetcher(params, 'Dispute');
};

export { filterFetcherViolation, filterFetcherDispute, create };
