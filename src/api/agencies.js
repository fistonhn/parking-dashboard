import resourceApi from 'components/modules/resource_api';
import searchApi from 'components/modules/search_api';
import fetchApi from 'components/modules/fetch_api';
import { generatePath } from 'react-router';

const { index, show, create, destroy } = resourceApi('agencies');

const search = searchApi('agencies');

const filterFetcher = (params = {}) => {
  const { page, perPage = 20, query, filters = {} } = params;

  return index({
    page,
    perPage,
    id: filters.id,
    query: Object.assign({}, query, {
      query: {
        agencies: {
          email: filters.email,
          name: filters.name,
          phone: filters.phone,
          agency_type: filters.agency_type
        },
        admins: {
          username: filters.manager_id
        }
      },
      status: filters.status
    })
  });
};

const update = (params = {}) => {
  const { id, data = {}, nestedParams = {} } = params;
  const updateData = { ...data };

  updateData.agency.location = {
    city: data.agency.location.city,
    country: data.agency.location.country,
    building: data.agency.location.full_address,
    lng: data.agency.location.lng,
    ltd: data.agency.location.ltd,
    street: data.agency.location.street,
    zip: data.agency.location.zip
  };

  return fetchApi(generatePath(`dashboard/agencies/${id}`, nestedParams), {
    method: 'PUT',
    params: updateData
  });
};

export { filterFetcher, show, update, create, search, destroy };
