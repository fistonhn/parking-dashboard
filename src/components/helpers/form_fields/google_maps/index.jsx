import React, { useRef } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Input } from 'reactstrap';
import SearchBox from 'components/modules/google_maps/search_box';
import extractGeocodeInfo from 'components/modules/google_maps/extract_geocode_info';
import env from '.env';
import styles from './google_maps.module.sass';

var marker = null;

const createMarker = (google, map, position, markerName) => {
  deleteMarker();
  marker = new google.maps.Marker({ position, map, title: markerName });
};

const deleteMarker = () => {
  if (marker) {
    marker.setMap(null);
  }
};

const GoogleMapsContainer = (props) => {
  const { ltd, lng, markerName, google } = props;
  const googleLocation = { lat: ltd, lng };
  const geocoder = new google.maps.Geocoder();
  const inputRef = useRef(null);

  const onReady = (mapProps, map) => {
    if (map) {
      createMarker(google, map, googleLocation, markerName);
    }
  };

  const mapClicked = (mapProps, map, clickEvent) => {
    const { lat, lng } = clickEvent.latLng;
    createMarker(google, map, { lat: lat(), lng: lng() }, markerName);
    geocoder.geocode({
      latLng: clickEvent.latLng
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        props.onMapClick(Object.assign({}, extractGeocodeInfo(results), {
          ltd: lat(),
          lng: lng()
        }), results[0].formatted_address);
      }
    });
  };

  return (
    <div className={styles.google_maps_container} >
      <Input innerRef={inputRef} className="form-control" id={styles.searchBox} type="text" placeholder="Search location"/>
      <Map
        google={google}
        initialCenter={googleLocation}
        onClick={mapClicked}
        onReady={onReady}
      >
        <SearchBox searchInputRef={inputRef} />
      </Map>

    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: env.google_cloud_api_key
})(GoogleMapsContainer);
