import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './breadcrumb.module.sass';
import { ReactComponent as ArrowBackIcon } from 'assets/arrow_back_icon.svg';

function Breadcrumb ({
  title = '',
  backPath = '',
  customIdTitle = '',
  id = '',
  idPrefix = 'ID: ',
  hasHint = false
}) {
  return (
    <React.Fragment>
      <div className={styles.breadcrumb}>
        <div>
          {backPath &&
            <Link to={backPath}>
              <ArrowBackIcon />
            </Link>
          }
          {title &&
            <span className="general-text-1">
              {title}
            </span>
          }
        </div>
        {id &&
          <span className="general-text-1 float-right">
            {`${customIdTitle || idPrefix} ${id}`}
          </span>
        }
      </div>
      {hasHint &&
        <div className={`${styles.hint} bg-grey-light`}>
          <p className="general-text-2 m-0">
            Fields marked with an asterisk (*) are mandatory.
          </p>
        </div>
      }
    </React.Fragment>
  );
}

Breadcrumb.propTypes = {
  title: PropTypes.string,
  backPath: PropTypes.string,
  id: PropTypes.number,
  hasHint: PropTypes.bool,
  customIdTitle: PropTypes.string,
  idPrefix: PropTypes.string
};

export default Breadcrumb;
