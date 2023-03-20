import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as OpenIcon } from 'assets/report_icons/open_icon.svg';
import { ReactComponent as PrintIcon } from 'assets/report_icons/print_icon.svg';
/* Actions */
import { SET_LIST } from 'actions/reports';
/* API */
import { filterFetcher } from 'api/reports';
/* Base */
import BasicListToolbar from 'components/base/basic_list_toolbar';
import IndexTable from 'components/base/table';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { filterFields } from 'components/helpers/fields/reports';
import GeneralTooltip from 'components/helpers/general_tooltip';
/* Modules */
import resourceFetcher from 'components/modules/resource_fetcher';
import connectList from 'components/modules/connect_list';
import withFetching from 'components/modules/with_fetching';
import withCurrentUser from 'components/modules/with_current_user';

class Index extends React.Component {
  state = {
    isDropdownFetching: true
  }

  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  renderRecords = () => {
    const { list } = this.props;

    return list.map((record, idx) => {
      return (
        <tr key={idx}>
          <td>{record.id}</td>
          <td>{record.name}</td>
          <td>{displayUnixTimestamp(record.created_at)}</td>
          <td>{record.type_name}</td>
          <td>
            <GeneralTooltip target='openIcon' text='Open'>
              <OpenIcon className="m-2" id='openIcon'/>
            </GeneralTooltip>
            <GeneralTooltip target='printIcon' text='Print'>
              <PrintIcon id="printIcon"/>
            </GeneralTooltip>
          </td>
        </tr>
      );
    });
  };

  render () {
    return (
      <IndexTable
        {...this.props}
        isFetching={this.isFetching}
        toolbar={<BasicListToolbar showFilters={true} {...this.props} title="System Reports" />}
        filterFields={filterFields}
        filterFetcher={filterFetcher}
        resource={resource}
        columns={
          <React.Fragment>
            <th attr="id">Report ID</th>
            <th attr="name">Report name</th>
            <th attr="created_at">Date created</th>
            <th attr="type_name">Report Type</th>
            <th style={{ paddingLeft: '12px' }} disableSort>Actions</th>
          </React.Fragment>
        }
        renderRecords={this.renderRecords}
      />
    );
  }
}

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

const resource = 'report';

export default connectList(
  resource,
  SET_LIST,
  resourceFetcher(filterFetcher, resource),
  withFetching(
    withCurrentUser(Index)
  )
);
