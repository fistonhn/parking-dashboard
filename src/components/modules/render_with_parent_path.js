import React from 'react';

const renderWithParentPath = (Component, path) => {
  return props => <Component {...props} parentPath={path}/>;
};

export default renderWithParentPath;
