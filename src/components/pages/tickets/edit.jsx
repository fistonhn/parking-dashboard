import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Col, Nav, Row } from 'reactstrap';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { Form } from 'informed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Actions */
import { SET_RECORD } from 'actions/tickets';
/* API */
import { update, statuses, show } from 'api/parking/tickets';
/* Base */
import { renderFieldsWithGrid } from 'components/base/forms/common_form';
import Button from 'components/base/button';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { fields } from 'components/helpers/fields/tickets';
import searchAdminByRoleName from 'components/helpers/admins/search_by_role_name';
import { fromJson as showErrors } from 'components/helpers/errors';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import updateRecord from 'components/modules/form_actions/update_record';

class Edit extends React.Component {
  state = {
    isSaving: false,
    dropdowns: {}
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { officers, statuses } = this.state.dropdowns;
    return isResourceFetching || !officers || !statuses;
  }

  save = () => {
    const { values } = this.formApi.getState();
    const { backPath, record } = this.props;
    const path = generatePath(backPath, { id: record.id });
    updateRecord.bind(this, update, path)(values);
  };

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
    const { officers, statuses } = this.state.dropdowns;
    return renderFieldsWithGrid(fields(officers, statuses), 2, 6, fieldProps);
  }

   values = () => {
     const { record } = this.props;
     const values = Object.assign({}, record);
     values.admin_id = record.officer ? record.officer.id : null;

     return values;
   };

   renderHeader () {
     const { backPath, record } = this.props;
     const backPathWithId = generatePath(backPath, { id: record.id });
     return (<Row>
       <Col md={2}>
         <Link to={backPathWithId} className="mr-2" >
           <FontAwesomeIcon color="grey" icon={faChevronLeft}/>
         </Link>
         {record.type} #{record.id}
       </Col>
       <Col md={2} className="align-self-center">
        Edit {record.agency.name} Ticket
       </Col>
       <Col md={8}>
         <Nav pills className="float-right">

           <span className="mr-2 text-muted">Updated: {displayUnixTimestamp(record.updated_at)}</span>

            ID: {record.id}
         </Nav>
       </Col>
     </Row>);
   }

  setFormApi = formApi => {
    this.formApi = formApi;
  };

  renderForm () {
    const { isSaving } = this.state;

    return (
      <fieldset disabled={isSaving}>
        <Form getApi={this.setFormApi} initialValues={this.values()}>
          <React.Fragment>
            {this.renderFields()}
            {this.renderSaveButton()}
          </React.Fragment>
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
    searchAdminByRoleName(['officer'])
      .then((data) => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            officers: data.officer
          }
        });
      })
      .catch(this.handleFailed);
    statuses()
      .then(({ data }) => {
        this.setState({
          dropdowns: {
            ...this.state.dropdowns,
            statuses: data.statuses
          }
        });
      })
      .catch(this.handleFailed);
  }

  render () {
    return this.isFetching() ? <div>Loading data...</div> : this.renderRecord();
  }
}

const fieldProps = { lSize: 6 };

Edit.propTypes = {
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

export default connectRecord('ticket', SET_RECORD, resourceFetcher(show), Edit);
