import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ReactComponent as Info } from 'assets/info_icon.svg';
import { Tooltip } from 'reactstrap';

const TooltipInfo = ({ width = '14', height = '14', ...props }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <React.Fragment>
      <Info className={props.className} width={width} height={height} id={props.target}/>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={props.target}
        toggle={toggle}
        modifiers={props.tooltipModifiers}
        autohide={false}
        style={props.styles}
      >
        {props.text}
      </Tooltip>
    </React.Fragment>
  );
};

TooltipInfo.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  target: PropTypes.string,
  tooltipModifiers: PropTypes.object,
  styles: PropTypes.object
};

export default TooltipInfo;
