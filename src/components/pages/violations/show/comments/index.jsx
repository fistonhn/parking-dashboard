import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
/* Actions */
import { SET_LIST } from 'actions/comments';
/* API */
import { filterFetcherViolation } from 'api/comments';
import { search as dropdownsSearch } from 'api/dropdowns';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { AlertMessagesContext } from 'components/helpers/alert_messages';
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/comments';
/* Modules */
import connectList from 'components/modules/connect_list';
import resourceFetcher from 'components/modules/resource_fetcher';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';
/* Assets */
import { ReactComponent as PlusIcon } from 'assets/plus_icon.svg';
import styles from './comments.module.sass';
/* Pages */
import CreateModal from './create_modal';

class Index extends React.Component {
  static contextType = AlertMessagesContext;

  state = {
    isDropdownFetching: true,
    dropdowns: {
      officers: []
    },
    isCreateModalOpen: false
  }

  createForm = React.createRef()

  isFetching = () => {
    const { isResourceFetching } = this.props;
    const { isDropdownFetching } = this.state;
    return isResourceFetching || isDropdownFetching;
  }

  renderRecords = () => {
    const { list } = this.props;
    return list.map((record, idx) => (
      <tr key={idx}>
        <td>{displayUnixTimestamp(record.created_at)}</td>
        <td>{record.user?.name || ''}</td>
        <td>{record.user?.email || ''}</td>
        <td className="py-2">
          {(record.content || '').split('\n').map((line, i) =>
            <React.Fragment key={i}>{line}<br/></React.Fragment>
          )}
        </td>
      </tr>
    ));
  };

  setDropdowns = (key, data) => this.setState({ dropdowns: { ...this.state.dropdowns, [key]: data } })

  componentDidMount () {
    const { currentUser, startFetching, agencyId } = this.props;
    startFetching(dropdownsSearch('agency_officers_list', { agency_id: agencyId }))
      .then(response => this.setDropdowns('officers', response.data))
      .finally(() => this.setState({ isDropdownFetching: false }));
  }

  render () {
    const { fetchData } = this.props;
    const { isCreateModalOpen, dropdowns } = this.state;
    const { officers } = dropdowns;
    return (
      <React.Fragment>
        <IndexTable
          {...this.props}
          isFetching={this.isFetching}
          toolbar={
            <BasicListToolbar
              {...this.props}
              showFilters={true}
              title="Comments"
              extraButtons={() => (
                <div
                  className={styles.addButton}
                  onClick={() => this.setState({ isCreateModalOpen: true })}
                >
                  <PlusIcon />
                </div>
              )}
            />
          }
          filterFields={filterFields(officers)}
          filterFetcher={filterFetcherViolation}
          resource={resource}
          shouldUpdateURLQuery={false}
          columns={
            <React.Fragment>
              <th disableSort>Date and Time</th>
              <th disableSort>User Name</th>
              <th disableSort>User Email</th>
              <th disableSort>Message</th>
            </React.Fragment>
          }
          renderRecords={this.renderRecords}
          entityName="comments"
        />
        <CreateModal
          isOpen={isCreateModalOpen}
          setIsOpen={isCreateModalOpen => this.setState({ isCreateModalOpen })}
          fetchList={fetchData}
        />
      </React.Fragment>
    );
  }
}

Index.propTypes = {
  isResourceFetching: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  startFetching: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

const resource = 'comment';

export default withRouter(connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcherViolation, resource, true),
  withFetching(withCurrentUser(Index)),
  { fetchCondition: () => true }
));
