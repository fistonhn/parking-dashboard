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
const withFetching = (Component) => {
  return class extends React.Component {

    componentWillUnmount () {
      this._isMounted = false;
    }

    componentDidMount () {
      this._isMounted = true;
    }

    startFetching = promise => {
      return new Promise((resolve, reject) => {
        promise
          .then((response) => {
            if(!this._isMounted) {
              return reject()
            }
            return resolve(response)
          })
          .catch(err => {
            return reject(err)
          })
      })
    };

    render () {
      return <Component
        {...this.props}
        startFetching={this.startFetching} />;
    }
  };
};

export default withFetching;
