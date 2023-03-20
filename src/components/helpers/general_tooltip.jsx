import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const GeneralTooltip = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <React.Fragment>
      {props.children}
      <Tooltip placement={props.placement || 'top'} isOpen={tooltipOpen} target={props.target} toggle={toggle}>
        {props.text}
      </Tooltip>
    </React.Fragment>
  );
};

export default GeneralTooltip;
