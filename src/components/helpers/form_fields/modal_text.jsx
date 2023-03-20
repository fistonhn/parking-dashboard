import React, { useState } from 'react';

const ModalText = (props) => {
  const { field } = props;
  const [isOpen, setIsOpen] = useState(false);
  return <field.ComponentModal isOpen={isOpen} setIsOpen={setIsOpen} field={field}/>;
};

export default ModalText;
