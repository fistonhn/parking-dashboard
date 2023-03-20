const addressAttributes = {
  country: 'country',
  postal_code: 'zip',
  administrative_area_level_1: 'state',
  street_number: 'street',
  route: 'street',
  locality: 'city'
};

const extractGeocodeInfo = (results) => {
  const locationRequest = {};
  const address = results[0];
  if (address) {
    address.address_components.forEach(component => {
      component.types.forEach(type => {
        if (addressAttributes[type]) {
          locationRequest[addressAttributes[type]] = component.long_name;
        }
      });
    });
  }
  return locationRequest;
};

export default extractGeocodeInfo;
