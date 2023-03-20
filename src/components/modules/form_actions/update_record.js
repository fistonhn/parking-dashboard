
import { cloneDeep } from 'lodash';

function updateRecord (update, backPath, values) {
  const { id } = this.props.match.params;
  this.setState({ isSaving: true });

  update({ id, data: cloneDeep(values) })
    .then(updateSucceed.bind(this, backPath))
    .catch(updateFailed.bind(this))
    .finally(() => {
      this.setState({ isSaving: false });
    });
}

function updateSucceed (backPath, res) {
  const { history, setRecord, setListElement, popListElement } = this.props;
  setListElement && setListElement(res.data);
  setRecord && setRecord(res.data);
  popListElement && res.data?.status === 'deleted' && popListElement(res.data);
  history.push(backPath);
}

function updateFailed (error) {
  if (error.response) {
    // this.context.addAlertMessages([{
    //   type: 'Error',
    //   text: 'Wrong data in marked fields. Please check them and correct.'
    // }]);
    if (typeof this.transformErrorFunc === 'function') {
      this.setState({ errors: this.transformErrorFunc(error.response.data.errors) });
    } else {
      this.setState({ errors: error.response.data.errors });
    }
  }
}

export default updateRecord;
