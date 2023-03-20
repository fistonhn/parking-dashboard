import React from 'react';
import { isEmpty } from 'underscore';
import { map } from 'underscore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const showMessages = messages => {
  if (isEmpty(messages)) return;

  return map(messages, (message, idx) => {
    return (
      <div className="text-center general-error">
        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mt-3"/>
        {message.text}
      </div>
    );
  }).flat();
};

const extractMessage = error => {
  const { errors } = error.response.data;

  if (errors) {
    const errorsContainer = [];

    Object.keys(errors).forEach(function (key) {
      errors[key].map(text => errorsContainer.push(text));
    });

    return errorsContainer.map(text => ({ text, color: 'danger' }));
  } else {
    return [{ text: error.response.data, color: 'danger' }];
  }
};

const setErrorsMessages = error => {
  if (typeof error === 'string') {
    return [{ text: error, color: 'danger' }];
  }

  switch (error.status) {
    case 404:
      return [{ text: error.statusText, color: 'danger' }];
    case 500:
      return [{ text: 'Unexpected error', color: 'danger' }];
    default:
      return extractMessage(error);
  }
};

const setSuccessMessage = message => [{ text: message, color: 'success' }];

export {
  showMessages,
  setErrorsMessages,
  setSuccessMessage
};
