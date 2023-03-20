import DetailedReports from 'actions/detailed_reports';

export default (
  state = {
    pieChartsData: {},
    individualReportsData: []
  }, action) => {
  switch (action.type) {
    case DetailedReports.SET_PIE_DETAILED_REPORT_DATA:
      return Object.assign({}, state, {
        pieChartsData: action.payload.pieCharts,
        individualReportsData: action.payload.individualParkingLots
      });
    case DetailedReports.RESET_PIE_DETAILED_REPORT_DATA:
      return Object.assign({}, state, {
        pieChartsData: {},
        individualReportsData: []
      });
    default:
      return state;
  }
}; ;
