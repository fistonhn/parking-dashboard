import axios from 'axios';
import qs from 'qs';

// Format nested params correctly
axios.interceptors.request.use(config => {
  if (config.headers.common) {
    config.headers.common['psad-tracker-id'] = localStorage?.PSAD_TRACKER_ID;
  }
  config.paramsSerializer = params => {
    // Qs is already included in the Axios package
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false
    });
  };
  return config;
});
