
import { cloneDeep } from 'lodash';

function updateRecordWithModel (update, backPath, values) {
  const { reload, cancel, record } = this.props;
  const id = record.id;

  this.setState({ isSaving: true });
  update({ id, data: cloneDeep(values) })
    .then((res) => {
      updateSucceed.bind(this, backPath);
      this.context.addAlertMessages([{
        type: 'Success',
        text: `The ${res.data.name} permit type has been updated`
      }]);
      reload();
      cancel();
    })

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
    if (typeof this.transformErrorFunc === 'function') {
      this.setState({ errors: this.transformErrorFunc(error.response.data.errors) });
    } else {
      this.setState({ errors: error.response.data.errors });
    }
  }
}

export default updateRecordWithModel;
