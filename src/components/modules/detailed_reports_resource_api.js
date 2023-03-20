import fetchApi from 'components/modules/fetch_api';
import { generatePath } from 'react-router';

const detailedReportResourceApi = resources => {
  const index = (params = {}) => {
    const { pieChart, individualLot, nestedParams = {} } = params;
    return fetchApi(
      generatePath(`dashboard/${resources}`, nestedParams),
      {
        method: 'GET',
        params: {
          pie_chart: {
            range: pieChart.range,
            parking_lot_ids: pieChart.parkingLotIds
          },
          individual_lot: {
            range: individualLot.range,
            parking_lot_ids: pieChart.parkingLotIds
          }
        }
      }
    );
  };

  return { index };
};
export default detailedReportResourceApi;
