const NOT_FOUND = 'NOT_FOUND';
const INTERNAL = 'INTERNAL';
const CRITICAL = 'CRITICAL';
const CLEAR_ERRORS = 'CLEAR_ERRORS';

const notFound = payload => ({
  type: NOT_FOUND,
  payload
});

const internal = payload => ({
  type: INTERNAL,
  payload
});

const critical = payload => ({
  type: CRITICAL,
  payload
});

const clearErrors = {
  type: CLEAR_ERRORS
};

export { notFound, internal, critical, clearErrors, NOT_FOUND, INTERNAL, CLEAR_ERRORS, CRITICAL };
