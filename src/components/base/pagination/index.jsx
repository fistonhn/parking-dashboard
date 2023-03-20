import React from 'react';
import PropTypes from 'prop-types';
import Paggy from 'react-js-pagination';
import { list as selectList } from 'selectors/list';
import styles from './pagination.module.sass';

class Pagination extends React.Component {
  state = {
    currentPageToOpen: null
  }

  updateQueryParams = (page) => {
    if (!this.props.shouldUpdateURLQuery) return;
    this.props.history.push({
      search: `?page=${page}`
    });
  }

  open = page => {
    const { startFetching, fetcher, perPage, startFetchingPagination, stopFetchingPagination, match } = this.props;
    this.setState({
      currentPageToOpen: page
    });
    startFetchingPagination();

    startFetching(fetcher({ page, perPage, ...match.params }))
      .then((res) => this.openSucceed(res, page))
      .catch(this.openFailed)
      .finally(() => stopFetchingPagination());
    this.updateQueryParams(page);
  };

  openSucceed = (res, page) => {
    const { currentPageToOpen } = this.state;
    if (currentPageToOpen === page) {
      this.props.setList(selectList(res));
    }
  };

  openFailed = error => {
    if (error) {
      console.error(error.message);
    }
  };

  render () {
    const { total, perPage, page, className } = this.props;

    if (total < perPage) return null;

    return (
      <Paggy
        activePage={page}
        itemsCountPerPage={perPage}
        totalItemsCount={total}
        pageRangeDisplayed={10}
        onChange={this.open}
        innerClass={`${styles.pagination} ${className || ''}`}
        itemClass={styles.paginationItem}
        linkClass={`general-text-1 ${styles.paginationLink}`}
        activeClass={styles.active}
        disabledClass={styles.disable}
        itemClassFirst={styles.itemFirst}
        itemClassLast={styles.itemLast}
        itemClassNext={styles.itemNext}
        itemClassPrev={styles.itemPrev}
      />
    );
  }
}

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  startFetching: PropTypes.func.isRequired,
  fetcher: PropTypes.func.isRequired,
  query: PropTypes.object,
  setList: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
  shouldUpdateURLQuery: PropTypes.bool
};

Pagination.defaultProps = {
  shouldUpdateURLQuery: true
};

export default Pagination;
