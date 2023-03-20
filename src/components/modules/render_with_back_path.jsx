import React from 'react';

const renderWithBackPath = (Component, path) => {
  const correctBackPath = path.endsWith('/')
    ? path.slice(0, path.length - 1)
    : path;
  return (props) => <Component {...props} backPath={correctBackPath} />;
};

export default renderWithBackPath;
