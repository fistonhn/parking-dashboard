import fetchApi from 'components/modules/fetch_api';
import printJS from 'print-js';

const index = (params = {}) => {
  const { configs, resource } = params;
  return fetchApi(`dashboard/reports/detailed/${resource}`, {
    method: 'GET', params: configs
  });
};

const download = (params = {}) => {
  const { resource, filters } = params;
  const encodedFilters = btoa(JSON.stringify(filters));

  return fetchApi(`dashboard/pdf_pages/download`, {
    method: 'GET',
    params: {
      page_url: encodeURIComponent(`dashboard/reports/detailed/${resource}?frame=headless&filters=${encodedFilters}`)
    }
  }, false, 'blob');
};

const printPDF = (blob) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const newBlob = new Blob([blob], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const url = window.URL.createObjectURL(newBlob);

  printJS({ printable: url, type: 'pdf', showModal: true });
};

const showPDF = (blob) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const newBlob = new Blob([blob], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = 'file.pdf';
  link.click();
  setTimeout(function () {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 100);
};

export default { index, download, showPDF, printPDF };
