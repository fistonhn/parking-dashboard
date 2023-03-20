import resourceApi from 'components/modules/resource_api';

const { index, show, update, create, destroy } = resourceApi('agency_types');

const filterFetcher = ({ page, perPage = 20, query } = {}) => index({ page, perPage, query });

export { create, destroy, filterFetcher, index, show, update };
