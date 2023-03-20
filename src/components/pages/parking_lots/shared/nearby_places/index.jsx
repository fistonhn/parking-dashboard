import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { InfoWindow, Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import CollapsableCard from 'components/base/collapsable_card';
import env from '.env';
import styles from './nearby_places.module.sass';
import Loader from 'components/helpers/loader';
import markerIcon from 'assets/marker.svg';

const NearbyPlaces = ({ google, parkingLotLocation, isLoading, places }) => {
  const [{ currentPlace, currentMarker }, setState] = useState({
    currentPlace: parkingLotLocation,
    currentMarker: null
  });

  const onMarkerClick = (place) => (props, marker) => {
    setState(prevState => ({
      ...prevState,
      currentPlace: place,
      currentMarker: marker
    }));
  };

  const onMapClicked = () => {
    if (!currentMarker) return;
    setState(prevState => ({
      ...prevState,
      currentMarker: null
    }));
  };

  const getTypeName = type => capitalize(type.replace(/_/g, ' '));

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (places.length === 0) {
      return <div>No nearby places found.</div>;
    }
    return (
      <div className={styles.container} >
        <Map
          google={google}
          initialCenter={currentPlace}
          center={currentPlace}
          zoom={15}
          onClick={onMapClicked}
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              title={place.name}
              name={place.name}
              position={place}
              onClick={onMarkerClick(place)}
            />
          ))}
          <Marker
            title='Parking Lot'
            position={parkingLotLocation}
            icon={{
              url: markerIcon,
              anchor: new google.maps.Point(32, 64),
              scaledSize: new google.maps.Size(64, 64)
            }}
            onClick={onMarkerClick(parkingLotLocation)}
          />
          <InfoWindow
            marker={currentMarker}
            visible={!!currentMarker}
          >
            <div>
              <h5>{currentPlace ? currentPlace.name : ''}</h5>
              {currentPlace && currentPlace.types &&
                <span>{currentPlace.types.map(type => getTypeName(type)).join(', ')}</span>
              }
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  };

  return (
    <CollapsableCard header="Nearby places" >
      {renderContent()}
    </CollapsableCard>
  );
};

NearbyPlaces.propTypes = {
  google: PropTypes.object,
  isLoading: PropTypes.bool,
  parkingLotLocation: PropTypes.object,
  places: PropTypes.array.isRequired
};

export default GoogleApiWrapper({ apiKey: env.google_cloud_api_key })(NearbyPlaces);
