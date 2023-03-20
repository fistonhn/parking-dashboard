import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'informed';
import { InputGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import styles from './password.module.sass';

class Password extends React.Component {
  state = {
    type: 'password',
    touched: false
  }

  handleClick = () => this.setState(({ type }) => ({
    type: type === 'text' ? 'password' : 'text'
  }))

  render () {
    const { field, customAttr = {} } = this.props;
    const { type } = this.state;

    return (
      <InputGroup >
        <Text disabled={field.disabled} className="form-control position-relative" {...customAttr} field={field.name} type={type}/>
        <FontAwesomeIcon className={`position-absolute ${styles.eyePassword}`} onClick={this.handleClick} icon={type === 'text' ? faEye : faEyeSlash}/>
      </InputGroup>
    );
  }
}

Password.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    filled: PropTypes.bool.isRequired
  })
};

export default Password;
