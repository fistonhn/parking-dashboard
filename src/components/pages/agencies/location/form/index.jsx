import React, { useState } from 'react';
import { withFormApi } from 'informed';
import ModalForm from 'components/helpers/modals/form';
import { InputGroup } from 'reactstrap';
import { ReactComponent as LocationIcon } from 'assets/location_icon.svg';
import styles from './location.module.sass';
import { cloneDeep, isEmpty } from 'lodash';
import { fieldsName as fieldsNameLocation } from 'components/helpers/fields/location';
/* Actions */
/* API */
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
/* Helpers */
import { fields } from 'components/helpers/fields/location';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */

const LocationForm = (props) => {
  const { currentLocation, setCurrentLocation, formApi, errors = {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(null);
  const [locationFormErrors, setLocationFormErrors] = useState({});

  const googleMapEvents = {
    onMapClick: (locationRequest) => {
      formApi.setValues({ location: locationRequest });
      setShowSaveButton(true);
    }
  };

  const events = {
    onChange: () => setShowSaveButton(true)
  };

  const onClickSave = () => {
    const values = formApi.getValue('location');

    if (isRequiredFieldEmpty(values)) return;

    const formValueWithFullAddress = {
      ...values,
      full_address: formatFullAddress(values)
    };

    fields.forEach(field => {
      // location fields name has a location.field pattern
      // Example: location.street
      const name = field.name.split('.')[1];
      if (!formValueWithFullAddress[name]) {
        formatFullAddress[name] = '';
      }
    });

    setCurrentLocation(cloneDeep(formValueWithFullAddress));
    setIsSaved(true);
    setIsOpen(false);
  };

  const isRequiredFieldEmpty = (values) => {
    const errorObject = locationFormFieldKey.reduce((error, currentKey) => {
      return Object.keys(values).includes(currentKey)
        ? { ...error }
        : { ...error, ['location.' + currentKey]: ['* Required'] };
    }, {});

    setLocationFormErrors(errorObject);

    return !isEmpty(errorObject);
  };

  const onModalClose = () => {
    if (!isSaved) {
      formApi.setValues({ location: currentLocation });
    }
    setLocationFormErrors({});
  };

  const onOpened = () => {
    if (formApi) {
      formApi.setValues({ location: currentLocation });
    }
  };

  const hasError = Object.keys(errors).some(key => fieldsNameLocation.includes(key));

  return (
    <React.Fragment>
      <ModalForm
        title="Add location"
        showSaveButton={showSaveButton}
        onClosed={onModalClose}
        onOpened={onOpened}
        toggleModal={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        onClickSave={onClickSave}
      >
        { renderFieldsWithGrid(fields, 2, 6, { lSize: 6, events, errors: locationFormErrors }) }
        {
          renderFieldsWithGrid([
            {
              type: FieldType.GOOGLE_MAPS_FIELD,
              options: {
                markerName: 'Your agency location',
                ltd: currentLocation.ltd || defaultCenter.ltd,
                lng: currentLocation.lng || defaultCenter.lng
              }
            }], 2, 12, { iSize: 12, events: googleMapEvents })
        }
      </ModalForm>
      <InputGroup>
        <div className={`position-relative ${hasError ? 'input-error' : ''}`}>
          <input readOnly value={currentLocation.full_address} className="pr-4 bg-white form-control" onClick={() => setIsOpen(true)} />
          <LocationIcon className={styles.LocationIcon} />
          <div className="text-left general-error general-text-1 pt-1">
            {hasError ? 'Some required data is missing' : ''}
          </div>
        </div>
      </InputGroup>
    </React.Fragment>
  );
};

const locationFormFieldKey = fields.reduce(
  (locationFormField, currentObject) => {
    return currentObject.mandatory ? [...locationFormField, currentObject.name.split('.')[1]] : [...locationFormField];
  },
  []
);

const formatFullAddress = (address) => {
  return ['street', 'building', 'city', 'country', 'zip'].map(key => {
    return address[key];
  }).filter(Boolean).join(', ');
};

const defaultCenter = {
  ltd: 38.77,
  lng: -76.07
}; // Easton, USA coordinates

export default withFormApi(LocationForm);
