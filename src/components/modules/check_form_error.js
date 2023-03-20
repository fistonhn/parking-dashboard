import { capitalize } from 'lodash';

function checkFormError (event, formValidation) {
  if (!event) return;
  const { errors } = this.state;
  const { name, value } = event.target || {};
  if (!formValidation[name]) return;
  const fieldValidations = formValidation[name].split(',');
  for (const fieldValidation of fieldValidations) {
    switch (fieldValidation) {
      case 'notEmpty':
        if (value) {
          const { [name]: v, ...newErrors } = errors;
          this.setState({ errors: newErrors });
          break;
        }
        this.setState({
          errors: {
            ...errors,
            [name]: [`${capitalize(name)} can't be blank`]
          }
        });
        break;
      default:
        break;
    }
  }
}

export default checkFormError;
