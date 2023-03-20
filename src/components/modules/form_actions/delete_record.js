function deleteRecord (destroy, recordId) {
  this.setState({ isDeleting: true });

  destroy({ id: recordId })
    .then(deleteSucceed.bind(this))
    .catch(deleteFailed.bind(this))
    .finally(() => {
      this.setState({ isDeleting: false });
    });
}

function deleteSucceed () {
  const { history, location, fetchData } = this.props;
  history.replace(`${location.pathname}${location.search}`, { shouldFetch: true });
  fetchData();
}

function deleteFailed (error) {
  const errors = error.response?.data?.errors || null;
  let messages = [];
  if (errors) {
    messages = Object.keys(errors).map(err => ({ type: 'Error', text: errors[err][0] }));
  }
  this.context.addAlertMessages(messages.length !== 0 ? messages : [{ type: 'Error', text: error.message }]);
}

export default deleteRecord;
