const SearchBox = (props) => {
  const { google, map, searchInputRef } = props;
  const input = searchInputRef.current;
  if (map && input) {
    map.disableDefaultUI = true;
    map.zoomControl = true;
    map.fullscreenControl = true;
    new google.maps.places.PlacesService(map);
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input);

    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  return null;
};

export default SearchBox;
