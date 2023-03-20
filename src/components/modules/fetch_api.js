import env from '.env';
import axios from 'axios';
import withApiCatch from './with_api_catch';

const fetchApi = (endpoint, data, critical = false, responseType = null) => {
  const options = {
    url: `${env.backend_url}/${endpoint}`,
    headers: {
      'Content-Type': data.contentType ? data.contentType : 'application/json',
      Authorization: localStorage.TOKEN
    }
  };

  if (responseType) {
    options.responseType = responseType;
  }

  return withApiCatch(
    axios(Object.assign(options, data)
    ),
    critical
  );
};

export default fetchApi;
