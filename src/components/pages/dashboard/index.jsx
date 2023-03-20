import React, { Component } from 'react';
import Toolbar from './toolbar';
import DataCard from './data_card';
import { index } from 'api/parking_lots';
import { Row, Col } from 'reactstrap';
import styles from './dashboard.module.sass';
import moment from 'moment';

moment.updateLocale('en', { week: {
  dow: 1,
  doy: 4
} });

const defaultDateFilters = [
  {
    from: moment(),
    to: null,
    label: 'Today',
    text: `Today (${moment().format('L')})`,
    since: 'since yesterday'
  },
  {
    from: moment().startOf('week'),
    to: moment().endOf('week'),
    label: 'This week',
    text: `This week (${moment().startOf('week').format('MM/DD')}-${moment().endOf('week').format('MM/DD')})`,
    since: 'since last week'
  },
  {
    from: moment().startOf('month'),
    to: moment().endOf('month'),
    label: 'This month',
    text: `This month (${moment().startOf('month').format('MMM')})`,
    since: 'since last month'
  }
];

const allParkingLots = {
  label: 'All Parking Lots',
  value: 0
};

class Dashboard extends Component {
  state = {
    parkingLots: [],
    dateRange: {},
    types: [
      {
        name: 'vehicles_parked',
        reportType: 'vehicles_parked',
        display: true,
        reload: false,
        info: 'Historical number of vehicles that parked on the covered parking lots.',
        maxDate: moment().subtract(1, 'days'),
        searchName: 'vehicles perviosly parked',
        displayMore: true
      },
      {
        name: 'vehicles_currently_parked',
        reportType: 'vehicles_currently_parked',
        display: true,
        reload: false,
        info: 'Number of vehicles parked as of this time.',
        searchName: 'vehicles currently parked',
        displayMore: true
      },
      {
        name: 'violation_reports_opened',
        reportType: 'violations',
        display: true,
        reload: false,
        info: 'Number of Violation Reports that have not been reviewed yet from the covered parking lots.',
        datesToFilter: defaultDateFilters,
        displayMore: true,
        searchName: 'violation reports opened'
      },
      {
        name: 'violation_reports_rejected',
        reportType: 'violations',
        display: true,
        reload: false,
        info: 'Number of Violation reports that have been reviewed but were deemed invalid.',
        datesToFilter: defaultDateFilters,
        displayMore: true,
        searchName: 'violation reports rejected'
      },
      {
        name: 'voi_matches',
        reportType: 'voi_matches',
        display: true,
        reload: false,
        info: 'Number of vehicles in the Vehicle of Interest(VOI) that are detected inside covered parking lots.',
        datesToFilter: defaultDateFilters,
        displayMore: true,
        searchName: 'vehicle of  interest match'
      },
      {
        name: 'revenue',
        reportType: 'revenues',
        display: true,
        reload: false,
        info: 'Total amount of parking fees collected from the covered parking lots.',
        datesToFilter: defaultDateFilters,
        searchName: 'revenue earned',
        displayMore: true
      },
      {
        name: 'citation_tickets_opened',
        reportType: 'citation_tickets_opened',
        display: true,
        reload: false,
        info: 'Number of citation tickets that are not yet resolved/settled.',
        datesToFilter: defaultDateFilters,
        searchName: 'citation_tickets_opened',
        displayMore: true
      },
      {
        name: 'citation_tickets_canceled',
        reportType: 'citation_tickets_canceled',
        display: true,
        reload: false,
        info: 'Number of citation tickets that are cancelled.',
        datesToFilter: defaultDateFilters,
        searchName: 'citation_tickets_canceled',
        displayMore: true
      }
    ]
  }

  filter = (from, to) => {
    const { types } = this.state;
    this.setState({
      dateRange: {
        from,
        to
      },
      types: types.map(element => {
        return {
          ...element,
          name: element.name,
          display: element.display,
          reload: true
        };
      })
    });
  }

  resetFilter = (from, to) => {
    const { types } = this.state;
    this.setState({
      dateRange: {},
      types: types.map(element => {
        return {
          ...element,
          name: element.name,
          display: element.display,
          reset: true,
          reload: true
        };
      })
    });
  }

  refresh = () => {
    const { types } = this.state;
    this.setState({
      types: types.map(element => {
        return {
          ...element,
          name: element.name,
          reload: true,
          display: element.display
        };
      })
    });
  }

  stopRefreshing = () => {
    const { types } = this.state;
    this.setState({
      types: types.map(element => {
        return {
          ...element,
          dateRange: {},
          name: element.name,
          display: element.display,
          reload: false
        };
      })
    });
  }

  search = (value) => {
    const { types } = this.state;

    this.setState({
      types: types.map((type) => {
        var display = true;
        if (value) {
          const searchValue = value.split(' ').join('_').toLocaleLowerCase();
          display = type.searchName.includes(searchValue);
        }

        return {
          ...type,
          display
        };
      })
    });
  }

  componentWillUnmount () {
    document.querySelector('.frame-container').classList.remove(styles.frameContainer);
  }

  componentDidMount () {
    document.querySelector('.frame-container').classList.add(styles.frameContainer);

    index({ perPage: 50 })
      .then(res => {
        this.setState({
          parkingLots: [allParkingLots].concat(res.data.map((parking_lot) => ({ label: parking_lot.name, value: parking_lot.id })))
        });
      });
  }

  render () {
    const { types, dateRange, parkingLots } = this.state;
    return (
      <div className={styles.container}>
        <Row>
          <Col xs="12">
            <Toolbar dateRange={dateRange} filter={this.filter} resetFilter={this.resetFilter} search={this.search} refresh={this.refresh} />
          </Col>
          <Col xs="12">
            <Row className={styles.listDataCard}>
              {
                types.map((type, index) => (
                  <Col xs="6" xl="4" className={`${styles.dataCardContainer} ${type.display ? '' : 'd-none'}`} key={type.name} >
                    <DataCard
                      key={index}
                      parkingLots={parkingLots}
                      defaultParkingLot={allParkingLots}
                      type={type.name}
                      reportType={type.reportType}
                      reset={type.reset}
                      reload={type.reload}
                      display={type.display}
                      disable_date_range={type.disable_date_range}
                      stopRefreshing={this.stopRefreshing}
                      from={dateRange.from}
                      to={dateRange.to}
                      maxDate={type.maxDate}
                      info={type.info}
                      datesToFilter={type.datesToFilter}
                      displayMore={!!type.displayMore}
                    />
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
