import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'underscore';
import Loader from 'components/helpers/loader';

const withCurrentUser = (Component, CustomLoader = null) => {
  const HOC = class extends React.Component {
    state = {
      currentUser: null,
      currentUserPermissions: []
    }

    componentWillUnmount () {
      this.setState({
        currentUser: null,
        currentUserPermissions: []
      });
    }

    componentWillReceiveProps (nextProps, nextContext) {
      if (!isEmpty(nextProps.currentUser)) {
        this.setState({
          currentUser: nextProps.currentUser,
          currentUserPermissions: nextProps.currentUser.role.permissions
        });
      }
    }

    componentDidMount () {
      this.setState({
        currentUser: this.props.currentUser,
        currentUserPermissions: this.props.currentUser ? this.props.currentUser.role.permissions : []
      });
    }

    render () {
      const { currentUser, currentUserPermissions, ...other_props } = this.props;
      return this.state.currentUser
        ? <Component {...this.state} {...other_props}/>
        : CustomLoader ? <CustomLoader/> : this.props.hideLoader ? null : <Loader/>;
    }
  };

  return connect(
    mapState,
    null
  )(HOC);
};

const mapState = state => {
  const { data = null } = state.user;
  return { currentUser: data };
};

export default withCurrentUser;
