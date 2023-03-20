import { cloneDeep } from 'lodash';

function saveRecord (create, backPath, values) {
  this.setState({ isSaving: true });
  return new Promise((resolve, reject) => {
    create({ data: cloneDeep(values) })
      .then((response) => {
        this.setState({ status: response?.status });
        createSucceed.call(this, backPath, response);
        resolve();
      })
      .catch((response) => {
        handleFailed.call(this, response);
        reject();
      })
      .finally(() => this.setState({ isSaving: false }));
  });
};

function createSucceed (backPath, res) {
  const { history, setRecord } = this.props;
  setRecord(res.data);
  if (backPath) {
    history.push(backPath, { shouldFetch: true });
  }
};

function handleFailed (error) {
  if (error.response) {
    // this.context.addAlertMessages([{
    //   type: 'Error',
    //   text: 'Wrong data in marked fields. Please check them and correct.'
    // }])
    if (typeof this.transformErrorFunc === 'function') {
      this.setState({ errors: this.transformErrorFunc(error.response.data.errors) });
    } else {
      this.setState({ errors: error.response.data.errors });
    }
  }
};

export default saveRecord;
