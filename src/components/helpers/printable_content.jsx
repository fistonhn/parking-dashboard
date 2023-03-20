import React from 'react';
import ReactDOM from 'react-dom';

const pritableSection = document.getElementById('printable');

class PrintableContent extends React.Component {
  state = {
    el: document.createElement('div')
  }

  componentWillUnmount () {
    pritableSection.removeChild(this.state.el);
    document.getElementById('root').classList.remove('no-print');
  }

  componentDidMount () {
    pritableSection.appendChild(this.state.el);
    document.getElementById('root').classList.add('no-print');
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.state.el
    );
  }
}

export default PrintableContent;
