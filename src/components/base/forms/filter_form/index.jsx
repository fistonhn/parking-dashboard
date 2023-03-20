import React from 'react';
import { Form, Text } from 'informed';
import PropTypes from 'prop-types';
import { Col, FormGroup, Label } from 'reactstrap';
import {
  CustomSelect,
  CustomMultiSelect,
  DateRangeInput,
  FieldType
} from 'components/helpers/form_fields';
import Loader from 'components/helpers/loader';
import Button from 'components/base/button';
import ErrorWrapper from './error';
import styles from './filter_form.module.sass';
import { FILTER_FORM_ACTION_LABEL as LABELS } from '../../../../lang/en';

class FilterForm extends React.Component {
  state = {
    errors: {}
  }

  renderField = (field, key) => {
    return (
      <FormGroup row key={key}>
        <Label
          className={`${styles.inputLabel} general-text-1`}
          for={field.name}
          xs={3}
        >
          {field.label}
        </Label>
        <Col xs={9}>
          <ErrorWrapper errors={this.state.errors} field={field}>
            {this.renderInput(field)}
          </ErrorWrapper>
        </Col>
      </FormGroup>
    );
  }

  renderInput = field => {
    switch (field.type) {
      case FieldType.DATE_FIELD:
        return <DateRangeInput className="form-control" field={field.name} initialValues={this.props.values} />;
      case FieldType.MULTISELECT_FIELD:
        return <CustomMultiSelect field={field.name} options={field.options} values={this.props.values} />;
      case FieldType.SELECT_FIELD:
        return <CustomSelect field={field} emptyOptionEnabled />;
      default:
        return <Text className="form-control" {...field.props} field={field.name} validate={field.validate} />;
    }
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields.map((field, idx) => this.renderField(field, idx));
  };

  renderButtons = formState => {
    const { cancelFilter, submitForm, isFetching } = this.props;
    return (
      <div className="d-flex justify-content-center mt-5">
        <Button
          className="mr-3 text-uppercase"
          onClick={cancelFilter}
          status="danger"
          size="md"
        >
          {LABELS.CLEAR}
        </Button>
        <Button
          className="text-uppercase"
          onClick={() => {
            const fromArr = formState?.values?.range?.from.split('-');
            const toArr = formState?.values?.range?.to.split('-');
            const formattedFrom = fromArr && [fromArr[1], fromArr[2], fromArr[0]].join('/');
            const formattedTo = toArr && [toArr[1], toArr[2], toArr[0]].join('/');
            const from = new Date(formattedFrom);
            const to = new Date(formattedTo);
            formState.values.range && from >= to
              ? this.setState({ errors: { range: ['From date cannot be greater than or equal to To date'] } })
              : submitForm(formState.values);
          } }
          status="success"
          type="submit"
          size="md"
          isLoading={isFetching()
          }
        >
          {LABELS.APPLY}
        </Button>
      </div>
    );
  };

  renderForm = ({ formState }) => (
    <React.Fragment>
      {this.renderFields()}
      {this.renderButtons(formState)}
    </React.Fragment>
  );

  render () {
    const { values, isFetching } = this.props;
    return (
      isFetching() ? <Loader /> : <Form initialValues={values} component={this.renderForm} />
    );
  }
}

FilterForm.propTypes = {
  cancelFilter: PropTypes.func,
  fields: PropTypes.array.isRequired,
  isFetching: PropTypes.func,
  submitForm: PropTypes.func,
  values: PropTypes.shape({})
};

export default FilterForm;
