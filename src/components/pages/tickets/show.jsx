import React from 'react';
import PropTypes from 'prop-types';
import { Col, Nav, Row, FormGroup, Label, Table } from 'reactstrap';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'informed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD, SET_LIST_ELEMENT } from 'actions/tickets';
import { invoke } from 'actions';
/* API */
import { update, show } from 'api/parking/tickets';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import { renderFieldsWithGrid, renderImageField } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { fields } from 'components/helpers/fields/tickets';
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { FieldType } from 'components/helpers/form_fields';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';
import setFormApiFields from 'components/modules/set_empty_fields';

class Show extends React.Component {
  state = {
    isSaving: false,
    inputChanged: false,
    officersFetched: false,
    dropdowns: {},
    errors: {}
  }

  static contextType = AlertMessagesContext

  fieldProps = () => ({
    lSize: 6,
    events: {
      onChange: () => this.setState({ inputChanged: true })
    }
  })

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { officers, statuses } = this.state.dropdowns;
    return isResourceFetching || !officers || !statuses;
  }

  save = () => {
    const { officers, statuses } = this.state.dropdowns;
    const { backPath } = this.props;

    const values = setFormApiFields(fields(officers, statuses), this.formApi);
    values.admin_id = values.admin_id > 0 ? values.admin_id : null;
    values.photo_resolution = this.formApi.getValue('photo_resolution');

    updateRecord.bind(this, update, backPath)(values);
  };

  renderSaveButton = () => {
    const { isSaving } = this.state;
    return (
      <Col>
        <Button
          size="md"
          status="success"
          className="px-5 py-2 float-right"
          onClick={this.save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </Col>
    );
  }

  renderFields () {
    const { officers, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, statuses), 2, 6, { ...this.fieldProps(), errors: this.state.errors });
  }

   values = () => {
     const { record } = this.props;
     const values = Object.assign({}, record);
     values.admin_id = record.officer ? record.officer.id : '0';
     return values;
   };

   renderHeader () {
     const { backPath, record } = this.props;
     const backPathWithId = generatePath(backPath, { id: record.id });
     return (<Row className="p-4">
       <Col md={2}>
         <Link to={backPathWithId} className="mr-2" >
           <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
         </Link>
         {record.type}
       </Col>
       <Col md={10}>
         <Nav pills className="float-right">
            ID: {record.id}
         </Nav>
       </Col>
     </Row>);
   }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  renderUpdatedTable = () => {
    const { record } = this.props;
    return (
      <Row>
        <Col xs="12">
          <Table className="index-table">
            <thead className="bg-dark text-white">
              <tr>
                <td>Type of change</td>
                <td>Old Value</td>
                <td>New Value</td>
                <td>Performed by</td>
                <td>Date Occurred</td>
                <td>Remark</td>
              </tr>
            </thead>
            <tbody>
              {
                record.updated_trail.map((element, idx) => (
                  <tr key={idx}>
                    <td>
                      {element.type_of_change}
                    </td>
                    <td>
                      {element.old_value}
                    </td>
                    <td>
                      {element.new_value}
                    </td>
                    <td>
                      {element.performed_by}
                    </td>
                    <td>
                      {displayUnixTimestamp(element.updated_at)}
                    </td>
                    <td>
                      {element.remark}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }

  renderForm () {
    const { record } = this.props;
    const { isSaving, inputChanged } = this.state;
    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <Row>
            <Col sm={12} md={3}>
              {renderImageField({ name: 'photo_resolution', label: '', type: FieldType.FILE_FIELD }, this.fieldProps())}
            </Col>
            <Col sm={12} md={9}>
              <FormGroup row>
                <Label for='updated_at' md={8}>Last Update: {displayUnixTimestamp(record.updated_at)}</Label>
              </FormGroup>
              {this.renderFields()}
            </Col>
          </Row>
          { inputChanged && this.renderSaveButton()}
        </Form>
      </fieldset>
    );
  }

  renderRecord () {
    return (
      <Row className="m-0">
        <Col xs={12} className="mb-4 bg-white">
          {this.renderHeader()}
        </Col>
        <Col xs={12}>
          {this.renderForm()}
        </Col>
      </Row>
    );
  }

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  componentWillReceiveProps (nextProps, nextContext) {
    const { officersFetched } = this.state;
    if (nextProps.record && !officersFetched) {
      this.setState({ officersFetched: true });
      const agency = nextProps.record.agency;
      dropdownsSearch('agency_officers_list', { agency_id: agency ? agency.id : null })
        .then((response) => this.setDropdowns('officers', response.data))
        .catch(this.handleFailed);
    }
  }

  componentDidMount () {
    dropdownsSearch('tickets_statuses_field')
      .then(response => this.setDropdowns('statuses', response.data))
      .catch(this.handleFailed);
  }

  render () {
    return this.isFetching() ? <Loader/> : (
      <React.Fragment>
        {this.renderRecord()}
        <div className="mt-4"/>
        {this.renderUpdatedTable()}
      </React.Fragment>
    );
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    officer: PropTypes.object,
    type: PropTypes.string.isRequired,
    agency: PropTypes.object,
    updated_at: PropTypes.number
  })
};

function mapDispatch (dispatch) {
  return bindActionCreators({ setListElement: invoke(SET_LIST_ELEMENT) }, dispatch);
}

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), connect(null, mapDispatch)(Show));
