import React from 'react';
import PropTypes from 'prop-types';
import { fields } from 'components/helpers/fields/parking/settings';
import { Form } from 'informed';
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import CollapsableCard from 'components/base/collapsable_card';

const FormSetting = props => {
  const { record, isSaving, setFormApi, fieldProps, disabled, errors } = props;
  const settingErrors = errors?.settings || null;

  return (
    <fieldset disabled={isSaving}>
      <Form getApi={setFormApi} initialValues={{ ...record, incremental: record?.incremental || 0 }} >
        {({ formState }) => {
          formState.values.parking_hour = formState.values.parking_hour ? formState.values.parking_hour : { from: record?.parking_hour_from, to: record?.parking_hour_to };
          return (
            <React.Fragment>
              {renderFieldsWithGrid(fields(disabled), 2, 6, { ...fieldProps, initialValues: { from: record?.parking_hour_from, to: record?.parking_hour_to }, formState, iSize: 6, lSize: 6, errors: { parking_hour: settingErrors } })}
            </React.Fragment>
          );
        }
        }
      </Form>
    </fieldset>
  );
};

const SettingSection = props => (
  <CollapsableCard header="Parking Lot Settings">
    <FormSetting {...props} />
  </CollapsableCard>
);

SettingSection.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired
};

FormSetting.propTypes = {
  record: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  setFormApi: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default SettingSection;
