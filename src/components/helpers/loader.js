import React from 'react';
import { Spinner } from 'reactstrap';
import { LOADING_TEXT } from '../../lang/en';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center flex-column pb-2">
    <Spinner color="primary" size="lg" />
    <div className="mt-2 text-center">{LOADING_TEXT}</div>
  </div>
);

export default Loader;
