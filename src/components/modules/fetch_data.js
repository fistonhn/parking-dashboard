import { bindActionCreators } from 'redux';
import { isEmpty } from 'underscore';
import { connect } from 'react-redux';
import { invoke } from 'actions';
import withResourceFetching from 'components/modules/with_resource_fetching';

const defaultProcessor = res => res.data;
const defaultDispatch = (action, actionType) => dispatch => (
  bindActionCreators({ [action]: invoke(actionType) }, dispatch)
);
const defaultFetchCondition = (wrapper, prop) => isEmpty(wrapper.props[prop]);

const fetchData = props => {
  const { Component, fetcher, action, actionType, prop } = props;
  const { processResponse = defaultProcessor, fetchCondition = defaultFetchCondition } = props;
  const { mapState, mapDispatch = defaultDispatch(action, actionType) } = props;

  const fetch = wrapper => {
    const shouldFetch = fetchCondition(wrapper, prop);

    fetcher(wrapper, shouldFetch, res => {
      try {
        wrapper.props[action](processResponse(res));
      } catch (exc) {
        console.error(exc.message);
      }
    });
  };

  return connect(
    mapState,
    mapDispatch
  )(withResourceFetching(Component, fetch));
};

export default fetchData;
