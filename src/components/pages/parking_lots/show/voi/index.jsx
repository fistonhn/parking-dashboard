import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../shared/header';
import VOITable from './voi_table';
/* Actions */
import { SET_RECORD } from 'actions/parking_lots';
/* API */
import { show } from 'api/parking_lots';
/* Base */
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class VOI extends React.Component {
  static contextType = AlertMessagesContext

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  render () {
    if (this.isFetching()) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        <Header {...this.props} />
        <VOITable />
      </React.Fragment>
    );
  }
}

VOI.propTypes = {
  isResourceFetching: PropTypes.bool.isRequired
};

export default connectRecord(
  'parking_lot',
  SET_RECORD,
  resourceFetcher(show),
  withFetching(withCurrentUser(VOI))
);
