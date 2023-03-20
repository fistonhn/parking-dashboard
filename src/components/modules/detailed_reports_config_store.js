import moment from 'moment';

const DEFAULT_STORE = {
  rememberConfig: false,
  showAllDataTable: false,
  showIndividualLot: false,
  configs: {
    pie_chart: {
      range: {
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().startOf('end_of_month').format('YYYY-MM-DD')
      },
      parking_lot_ids: []
    },
    individual_lots: {
      range: {
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().startOf('end_of_month').format('YYYY-MM-DD')
      },
      parking_lot_ids: []
    }
  }
};

class DetailedReportConfigStore {
  // @param [String, Integer] currentUserId
  constructor (currentUserId) {
    this.storePrint = `reportsConfig-user-${currentUserId}`;
  }

  // @returns [Object] save filter configurations
  getConfig () {
    const data = localStorage.getItem(this.storePrint);

    if (data) {
      return JSON.parse(data);
    } else {
      return DEFAULT_STORE;
    }
  }

  // @param [object] config
  // It should be on the following format.
  // @example
  //  {
  //    parking_lot_ids: [],
  //    pie_chart: {
  //      range: {
  //        from: [<Date YYYY-MM-DD>],
  //        to: [<Date YYYY-MM-DD>]
  //      }
  //    },
  //    individual_format: {
  //      range: {
  //        from: [<Date YYYY-MM-DD>],
  //        to: [<Date YYYY-MM-DD>]
  //      }
  //    }
  //  }
  setConfig (config) {
    localStorage.setItem(
      this.storePrint,
      JSON.stringify(config)
    );
  }

  removeConfig () {
    localStorage.removeItem(this.storePrint);
  }
}

export default DetailedReportConfigStore;
