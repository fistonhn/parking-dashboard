import React from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'underscore';
import { cloneDeep } from 'lodash';
import TRSort from './tr_sort';
import { list as selectList } from 'selectors/list';
import Pagination from 'components/base/pagination';
import ModalFilter from 'components/helpers/modals/filter';
import Loader from 'components/helpers/loader';
import generateBadgesFilter from 'components/modules/badges_filter/generate';
import deleteBadgesFilter from 'components/modules/badges_filter/delete';
import { retrieveFilters } from 'components/modules/retrieve_filters';
import withFetching from 'components/modules/with_fetching';
import getRangeOfPage from 'components/modules/get_range_of_page';

import './table.sass';

export class IndexTable extends React.Component {
  state = {
    sortedAttr: {},
    filterQuery: {},
    isActionTableFetching: false,
    isSortingFetching: false
  }

  renderLoader = () => {
    return (
      <tr>
        <td colSpan="100">
          <Loader />
        </td>
      </tr>
    );
  }

  renderNoData = () => {
    return (
      <tr>
        <td colSpan="100" className="text-center">
          <span className="general-text-1">No Data</span>
        </td>
      </tr>
    );
  }

  renderRecords = () => {
    const { isFetching, renderRecords, total: totalRecords } = this.props;
    const { isActionTableFetching } = this.state;

    if (isFetching() || isActionTableFetching) {
      return this.renderLoader();
    }

    if (totalRecords === 0) {
      return this.renderNoData();
    }

    return renderRecords();
  };

  generateLocalStorageFilter = (values) => {
    const { resource } = this.props;
    const queryFilter = {};
    Object.keys(values).forEach(key => {
      queryFilter[key] = values[key];
    });
    localStorage.setItem(`FILTERS_${resource}`, JSON.stringify(queryFilter));
  }

  handleSortedClick = (attr) => this.setState({ sortedAttr: attr });

  setFilterQuery = (values) => this.setState({ filterQuery: values });

  toggleModal = () => this.setState((state) => ({ filterModalOpen: !state.filterModalOpen }));

  startFetchingActionTable = () => this.setState(() => ({ isActionTableFetching: true }));

  stopFetchingActionTable = () => this.setState(() => ({ isActionTableFetching: false }));

  paginationFetcher = (pagesQuery) => this.props.filterFetcher({ filters: this.state.filterQuery, query: this.setQuery(this.state.sortedAttr), ...pagesQuery })

  badgesDelete = (badgeInfo) => {
    const { filterQuery } = this.state;
    const { filterFields } = this.props;
    this.submitForm(deleteBadgesFilter(filterQuery, filterFields, badgeInfo));
  }

  badgesFilter = () => {
    const { filterQuery } = this.state;
    const { filterFields } = this.props;
    return generateBadgesFilter(filterQuery, filterFields);
  }

  submitForm = (values) => {
    const { filterFetcher, startFetching, setList, match } = this.props;
    const cloneValues = cloneDeep(values);
    this.setFilterQuery(cloneValues);
    this.generateLocalStorageFilter(cloneValues);

    this.startFetchingActionTable();
    startFetching(filterFetcher(Object.assign({ ...match.params }, { filters: cloneValues }, this.setQuery(this.state.sortedAttr))))
      .then((res) => {
        setList(selectList(res));
      })
      .catch(error => console.log(error))
      .finally(this.stopFetchingActionTable);
  }

  setQuery = (sortedAttr) => {
    const { paginationQuery } = this.props;
    return !isEmpty(sortedAttr)
      ? Object.assign({}, paginationQuery, { 'order[keyword]': sortedAttr.keyword, 'order[direction]': sortedAttr.asc ? 'asc' : 'desc' })
      : paginationQuery;
  }

  componentDidMount () {
    const { resource } = this.props;
    this.setFilterQuery(retrieveFilters(resource));
  }

  render () {
    const { sortedAttr, filterModalOpen, filterQuery } = this.state;
    const {
      toolbar,
      filterFields,
      columns,
      total: totalRecords,
      filterFetcher,
      className,
      page,
      perPage,
      entityName
    } = this.props;
    let toolbarWithProps = null;
    if (toolbar) {
      toolbarWithProps = React.cloneElement(toolbar, {
        fetcher: filterFetcher,
        onClickFilter: this.toggleModal,
        title: `${toolbar.props.title} (${totalRecords})`,
        filterFields,
        badgesFilter: this.badgesFilter(),
        badgesDelete: this.badgesDelete
      });
    }
    const query = this.setQuery(sortedAttr);
    const pageRange = getRangeOfPage(totalRecords, page, perPage).join(' - ');
    return (
      <React.Fragment>
        <ModalFilter
          isOpen={filterModalOpen}
          toggleModal={this.toggleModal}
          filterQuery={filterQuery}
          submitForm={this.submitForm}
          {...this.props}
        />
        {toolbarWithProps}
        <table className={`${className || ''} index-table general-text-1`} cellSpacing="0" cellPadding="0" >
          <thead>
            <TRSort
              {...this.props}
              startFetchingSorting={this.startFetchingActionTable}
              stopFetchingSorting={this.stopFetchingActionTable}
              filterQuery={filterQuery}
              handleClick={this.handleSortedClick}
              sortedAttr={sortedAttr}
              setQuery={this.setQuery}
            >
              {columns.props.children}
            </TRSort>
          </thead>
          <tbody>
            {this.renderRecords()}
          </tbody>
        </table>
        <div className="paginationWrapper mx-auto bg-white">
          {!!entityName && (
            <span className="general-text-3">
              {`Displaying ${pageRange} of ${totalRecords} ${entityName}`}
            </span>
          )}
          <Pagination
            {...this.props}
            className="m-0"
            query={query}
            stopFetchingPagination={this.stopFetchingActionTable}
            startFetchingPagination={this.startFetchingActionTable}
            fetcher={this.paginationFetcher}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withFetching(
  withRouter(IndexTable)
);
