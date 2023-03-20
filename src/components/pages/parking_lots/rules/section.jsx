import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Form } from 'informed';
import { withRouter } from 'react-router-dom';
/* Actions */
/* API */
import { update } from 'api/agencies';
/* Base */
import { renderFieldsWithGrid, renderField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { fields } from 'components/helpers/fields/parking_rules';
import { fromJson as showErrors } from 'components/helpers/errors';
/* Modules */
import updateRecord from 'components/modules/form_actions/update_record';
import setFormApiFields from 'components/modules/set_form_api_fields';
import withFetching from 'components/modules/with_fetching';

class SectionRule extends React.Component {
  state = {
    isSaving: false,
    collapse: false,
    inputChanged: false
  }

  fieldProps = (lSize, iSize) => ({
    lSize,
    iSize: iSize || 12,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  save = () => {
    const values = setFormApiFields(fields(), this.formApi);
    const { match } = this.props;
    updateRecord.bind(this, update, match.url)(values);
  };

  values = () => {
    const { record } = this.props;
    const values = Object.assign({}, record);
    return values;
  };

  renderHeader () {
    const { backPath, record } = this.props;

    return (<Row>
      <Col sm={12}>
        {record.descriptive_name}
      </Col>
    </Row>);
  }

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button
          size="md"
          status="success"
          className="float-right"
          onClick={this.save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </Col>
    );
  }

  renderFields () {
    return renderFieldsWithGrid(fields(), 2, 6, this.fieldProps());
  }

  renderForm () {
    const { record } = this.props;
    const { isSaving, inputChanged } = this.state;
    const { recipient, description, agency_id, status } = fields();

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12}>
              # {record.id}
            </Col>
            <Col sm={6}>
              {renderField(status, this.fieldProps(4, 8))}
            </Col>
            <Col sm={6}>
              {renderField(agency_id, this.fieldProps(12, 12))}
            </Col>
            <Col sm={12}>
              {renderField(description, this.fieldProps(12))}
            </Col>
            <Col sm={12}>
              {renderField(recipient, this.fieldProps(12))}
            </Col>
          </Row>
          { inputChanged && this.renderSaveButton()}
        </Form>
      </fieldset>
    );
  }

  renderRecord () {
    return (
      <Card>
        <CardHeader>
          {this.renderHeader()}
        </CardHeader>
        <CardBody>
          {showErrors(this.state.errors)}
          {this.renderForm()}
        </CardBody>
      </Card>
    );
  }

  componentDidMount () {
  }

  render () {
    return this.renderRecord();
  }
}

SectionRule.propTypes = {
  match: PropTypes.object.isRequired
};

export default withRouter(
  withFetching(SectionRule)
);
