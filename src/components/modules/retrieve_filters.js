export const retrieveFilters = (resource) => {
  let queryFilter = localStorage[`FILTERS_${resource}`] || '{}';
  try {
    queryFilter = JSON.parse(queryFilter);
  } catch (error) {
    queryFilter = {};
    console.log(error);
  }
  return queryFilter;
};
