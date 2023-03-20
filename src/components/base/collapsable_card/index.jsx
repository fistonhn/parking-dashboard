import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { ReactComponent as PlusIcon } from 'assets/plus_icon.svg';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import style from './card.module.sass';

const CollapsableCard = props => {
  const { className, header, defaultState = false, onAdd } = props;
  const [show, toggle] = useState(defaultState);

  const onAddClick = (e) => {
    e.stopPropagation();
    if (!show) {
      toggle(true);
    }
    onAdd();
  };

  return (
    <Card className={`${style.Card}${className ? ` ${className}` : ''}`}>
      <CardHeader className={`${style.CardHeader} shadow-sm`} onClick={() => toggle(!show)}>
        <span className="mr-1">{header}</span>
        <div className="d-flex align-items-center">
          {onAdd && (
            <div className={`${style.addButton}`} onClick={onAddClick}>
              <PlusIcon />
            </div>
          )}
          {show
            ? <ChevronUp width="16" height="16" className="svg-white" />
            : <ChevronDown width="16" height="16" className="svg-white" />
          }
        </div>
      </CardHeader>
      <Collapse isOpen={show}>
        <CardBody>
          {props.children}
        </CardBody>
      </Collapse>
    </Card>
  );
};

CollapsableCard.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string.isRequired,
  defaultState: PropTypes.bool,
  onAdd: PropTypes.func,
  children: PropTypes.any
};

export default CollapsableCard;
