import PropTypes from 'prop-types';

const AccessControl = (props) => {
  const { allowedRoles = [], currentRole } = props;

  if (!allowedRoles.includes(currentRole)) return null;

  return props.children;
};

AccessControl.propTypes = {
  allowedRoles: PropTypes.array,
  currentRole: PropTypes.string
};

export default AccessControl;
