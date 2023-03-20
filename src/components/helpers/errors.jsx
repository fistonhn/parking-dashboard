import React from 'react';
import { isEmpty } from 'underscore';
import { Alert } from 'reactstrap';
import { map } from 'underscore';

const fromJson = errors => {
  if (isEmpty(errors)) return;

  return map(errors, (error, key) => {
    return map(error, (message, idx) => {
      return (<Alert time={Date.now()} key={`${key}-${idx}`} color="danger">
        {message}
      </Alert>);
    });
  }).flat();
};

export { fromJson };
