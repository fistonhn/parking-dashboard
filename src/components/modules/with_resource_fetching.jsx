/* eslint-disable */

import React from 'react';
/*
 This HOC component was initially developed to prevent errors/warnings/memory leaks in case
 when component gets unmounted before ajax request that was started on `componentDidMount`
 cannot be finished before `componentWillUnmount`
 ==========================================================================================
 Examples of usage:
 1. fetchingComponent(Component, fetchData)
 2. connect()(fetchingComponent(Component, fetchData))
 3. withRouter(fetchingComponent(Component, fetchData))
 ==========================================================================================
 NOTE: `fetchData` will be always called in WrapperComponent's context, so, feel free to use
 `props`, `state` or whatever else related to WrapperComponent's context
 */
const withResourceFetching = (Component, fetchData) => {
  return class extends React.Component {
    state = {
      isResourceFetching: true
    };

    componentWillUnmount() {
      this._isMounted = false;
    }

    resourceFetchFinished = () => {
      if (this._isMounted) {
        this.setState({ isResourceFetching: false });
      }
    };

    componentDidMount() {
      this._isMounted = true;
      fetchData(this);
    }

    resourceFetchStarted = promise => {
      promise.finally(() => this.resourceFetchFinished())
      this.setState({ isResourceFetching: true });
    };

    render() {
      return <Component
        {...this.props}
        fetchData={() => fetchData(this)}
        isResourceFetching={this.state.isResourceFetching}
        resourceFetchFinished={this.resourceFetchFinished}
        resourceFetchStarted={this.resourceFetchStarted} />;
    }
  };
};

export default withResourceFetching;
