import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
/* Modules */
import withCurrentUser from 'components/modules/with_current_user';
import PermissibleRender from 'components/modules/permissible_render';
import Button from 'components/base/button';
import { ReactComponent as FilterIcon } from 'assets/filter_icon.svg';
import { ReactComponent as RefreshIcon } from 'assets/refresh_icon.svg';

import styles from './basic_list_toolbar.module.sass';

class BasicListToolbar extends React.Component {
  newRecord = () => {
    const { match, history } = this.props;
    history.push(`${match.url}/new`);
  };

  render () {
    const {
      label,
      title,
      onClickFilter,
      createRequiredPermission,
      currentUserPermissions,
      goBackPath,
      extraButtons = () => { },
      showFilters,
      isRefresh,
      refresh
    } = this.props;

    return (
      <Row className={`${styles.toolbar} no-gutters`}>
        <Col className="d-flex align-items-center">
          {goBackPath &&
            <Link to={goBackPath} className="" >
              <FontAwesomeIcon size="sm" color="grey" icon={faChevronLeft} />
            </Link>
          }
          <span className={`${styles.title} general-text-1`}>
            {title}
          </span>
        </Col>
        <Col className="col-auto d-flex align-items-center">
          { isRefresh &&
            <Button
              onClick={refresh}
              status="primary-outline"
              className={styles.btnRefresh}
              icon={<RefreshIcon />}
            >
             Refresh
            </Button>
          }
          {extraButtons()}
          {showFilters &&
            <Button
              onClick={onClickFilter}
              status="secondary"
              className={styles.btnFilter}
              icon={<FilterIcon />}
              size="md"
            />
          }
          {label && (
            <PermissibleRender
              userPermissions={currentUserPermissions}
              requiredPermission={createRequiredPermission}
            >
              <Button
                className={styles.btnCreate}
                onClick={this.newRecord}
                size="md"
              >
                {label}
              </Button>
            </PermissibleRender>
          )}
        </Col>
      </Row>
    );
  }
}

BasicListToolbar.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onClickFilter: PropTypes.func,
  setList: PropTypes.func.isRequired,
  label: PropTypes.string,
  title: PropTypes.string,
  createRequiredPermission: PropTypes.object,
  currentUserPermissions: PropTypes.array,
  showFilters: PropTypes.bool,
  goBackPath: PropTypes.func,
  extraButtons: PropTypes.func,
  isRefresh: PropTypes.bool,
  refresh: PropTypes.func
};

export default withCurrentUser(BasicListToolbar);
