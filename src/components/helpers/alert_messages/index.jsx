import React from 'react';
import Toast from 'components/base/toast';

import './alert_messages.sass';

export const AlertMessagesContext = React.createContext();

export class AlertMessages extends React.Component {
  state = {
    alertMessages: []
  }

  addAlertMessages = (newMessages) => {
    newMessages.forEach((message, i) => {
      const transitionTimeMs = 3000 + (i * 1000);
      setTimeout(() => {
        this.setState((prevState) => {
          prevState.alertMessages.shift();
          return ({
            alertMessages: prevState.alertMessages
          });
        });
      }, transitionTimeMs);
    });
    this.setState({
      alertMessages: this.state.alertMessages.concat(newMessages)
    });
  }

  render () {
    return (
      <AlertMessagesContext.Provider value={{
        addAlertMessages: this.addAlertMessages
      }}>
        {
          this.props.children
        }
        <div className="toast-container">
          {
            this.state.alertMessages.map((alertMessage, i) => (
              <Toast key={i} {...alertMessage}/>
            ))
          }
        </div>
      </AlertMessagesContext.Provider>
    );
  }
}
