import PropTypes from 'prop-types';
import doesUserHasPermission from './does_user_has_permission';

const PermissibleRender = ({
  children,
  renderOtherwise,
  userPermissions,
  requiredPermission
}) => {
  if (doesUserHasPermission(userPermissions, requiredPermission)) {
    return children;
  } else if (renderOtherwise) {
    return renderOtherwise;
  }
  return null;
};

PermissibleRender.propTypes = {
  userPermissions: PropTypes.array.isRequired,
  requiredPermission: PropTypes.object,
  children: PropTypes.element.isRequired,
  renderOtherwise: PropTypes.element
};

export default PermissibleRender;
