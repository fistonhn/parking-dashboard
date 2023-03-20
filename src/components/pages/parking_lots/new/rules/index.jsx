import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

/* Actions */
/* API */
import { search as dropdownsSearch } from 'api/dropdowns';
import { index } from 'api/parking_rules';
/* Base */
import IndexTable from 'components/base/table';
import Button from 'components/base/button';
/* Helpers */
import Loader from 'components/helpers/loader';
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import TooltipInfo from 'components/helpers/tooltip_info';
/* Modules */
import withCurrentUser from 'components/modules/with_current_user';
import withFetching from 'components/modules/with_fetching';

import styles from './rules.module.sass';
import ModalRecipients from '../../shared/rules/recipients';
import { renderRecords } from '../../shared/rules';

class Rules extends React.Component {
  state = {
    inputChanged: false,
    showModalRecipient: false,
    dropdowns: {
      officers: []
    },
    list: [],
    currentRule: {
      recipients: []
    },
    isFetching: true
  };

  static contextType = AlertMessagesContext;

  isFetching = () => {
    return this.state.isFetching;
  };

  setDropdowns = (key, data) =>
    this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } });

  setFormApi = (formApi) => {
    this.formApi = formApi;
  };

  toggleModal = () => this.setState({ showModalRecipient: false });

  updateRecipientsList = (newList) => {
    const { list, currentRule } = this.state;
    this.setState({
      list: list.map((rule) => {
        if (rule.name === currentRule.name) {
          rule.recipients = newList;
        }
        return rule;
      })
    });
  };

  save = () => {
    const list = this.state.list.map((rule) => {
      rule.recipient_ids = rule.recipients.map((recipient) => recipient.id);
      rule.admin_id = rule.admin_id || null;
      return rule;
    });
    this.props.save(list);
  };

  renderSaveButton = () => {
    const { backParkingRule, isSaving } = this.props;
    return (
      <Row>
        <Col className={styles.btnWrapper}>
          <Button
            status="secondary"
            className="mr-4"
            onClick={backParkingRule}
            size="md"
            isLoading={isSaving}
          >
            {'< Back'}
          </Button>
          <Button
            status="success"
            onClick={this.save}
            size="md"
            isLoading={isSaving}
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  };

  renderForm () {
    const { list } = this.state;
    return (
      <React.Fragment>
        <IndexTable
          list={list}
          perPage={100}
          total={list.length}
          {...this.props}
          isFetching={this.isFetching}
          toolbar={null}
          resource={'parking_rules'}
          filterFetcher={index}
          columns={
            <React.Fragment>
              <th disableSort style={{ width: '15%' }}>
                Status
              </th>
              <th disableSort style={{ width: '30%' }}>
                Rule's name
              </th>
              <th disableSort style={{ width: '30%' }}>
                <TooltipInfo
                  className="mr-1"
                  text="Optional. Lists all assignable officers from parking lot assigned agency."
                  target="agency"
                />
                Assigned Agency Officer
              </th>
            </React.Fragment>
          }
          renderRecords={renderRecords.bind(this)}
        />
        {this.renderSaveButton()}
      </React.Fragment>
    );
  }

  componentDidMount () {
    const { startFetching, agencyId } = this.props;
    Promise.all([
      startFetching(index()).then((result) =>
        this.setState({ list: result.data })
      ),
      startFetching(
        dropdownsSearch('agency_officers_list', { agency_id: agencyId })
      ).then((response) => this.setDropdowns('officers', response.data))
    ]).finally(() => this.setState({ isFetching: false }));
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    const { showModalRecipient, currentRule } = this.state;
    const { list } = this.state;
    const activeRules = list.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.status ? 1 : 0),
      0
    );
    return (
      <React.Fragment>
        <div className={`${styles.hint} bg-grey-light`}>
          <p className="general-text-2 py-3">
            Please select the parking rules that you want to be enforced. You
            can change this later
          </p>
          <p className="general-text-1">Activated: {activeRules} rules</p>
        </div>
        {this.renderForm()}
        <ModalRecipients
          updateRecipientsList={this.updateRecipientsList}
          recipientsList={currentRule.recipients}
          isOpen={showModalRecipient}
          toggleModal={this.toggleModal}
        />
      </React.Fragment>
    );
  }
}

Rules.propTypes = {
  startFetching: PropTypes.func.isRequired,
  backParkingRule: PropTypes.func.isRequired,
  backPath: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  isSaving: PropTypes.bool,
  agencyId: PropTypes.string
};

export default withFetching(withCurrentUser(Rules));
