import React, { useState } from 'react';
import { Collapse as CollapseBootstrap } from 'reactstrap';

const Collapse = (props) => {
  const [isOpen, setIsOpen] = useState(props.initialState);

  const toggleCollapsable = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      {props.toggler(toggleCollapsable)}
      <CollapseBootstrap isOpen={isOpen}>
        {props.children}
      </CollapseBootstrap>
    </React.Fragment>
  );
};

export default Collapse;
