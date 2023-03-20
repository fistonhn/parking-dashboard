import { isEmpty } from 'underscore';

function fetchListCondition (wrapper, prop) {
  if (isEmpty(wrapper.props[prop])) return true;
  const { location } = wrapper.props;
  return location.state?.shouldFetch || false;
}

export default fetchListCondition;
