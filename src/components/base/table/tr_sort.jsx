import React from 'react';
import { withRouter } from 'react-router-dom';
import { list as selectList } from 'selectors/list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import withFetching from 'components/modules/with_fetching';

const TRSort = (props) => {
  const {
    filterFetcher,
    startFetching,
    setList,
    handleClick,
    sortedAttr,
    setQuery,
    filterQuery,
    startFetchingSorting,
    stopFetchingSorting,
    match,
    page
  } = props;

  const onClickSort = (th) => {
    if (!th.props.disableSort) {
      const newSortedAttr = {
        keyword: th.props.attr,
        asc: th.props.attr === sortedAttr.keyword ? !sortedAttr.asc : true
      };
      startFetchingSorting();
      startFetching(
        filterFetcher({ page, filters: filterQuery, query: setQuery(newSortedAttr), ...match.params })
          .then((res) => {
            setList(selectList(res));
          })
      )
        .finally(stopFetchingSorting);
      handleClick(newSortedAttr);
    }
  };

  return (
    <tr>
      {
        props.children.map((th, index) => (
          <React.Fragment key={th.props.attr || index}>
            <th style={{ ...th.props.style, width: '45%', minWidth: '210px' }}>
              <span className={th.props.disableSort ? 'non-sortable' : 'sortable'} onClick={() => onClickSort(th)}>
                {th.props.children}
                {!th.props.disableSort && <FontAwesomeIcon icon={arrowPosition(th.props, sortedAttr)}/>}
              </span>
            </th>
          </React.Fragment>
        ))
      }
    </tr>
  );
};

const arrowPosition = (th, sortedAttr) => {
  if (th.attr === sortedAttr.keyword) {
    return sortedAttr.asc ? faSortDown : faSortUp;
  } else {
    return faMinus;
  }
};

export default
withRouter(
  withFetching(
    TRSort
  )
);
