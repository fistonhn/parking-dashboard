import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import env from '.env';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
/* Actions */
import { SET_RECORD } from 'actions/parking_sessions';
/* API */
import { show } from 'api/parking_sessions';
/* Base */
import { ShowForm } from 'components/base/forms';
/* Helpers */
import { displayUnixTimestamp } from 'components/helpers';
import { showFields } from 'components/helpers/fields/parking_sessions';
import PrintableContent from 'components/helpers/printable_content';
import Loader from 'components/helpers/loader';
/* Modules */
import connectRecord from 'components/modules/connect_record';
import resourceFetcher from 'components/modules/resource_fetcher';
/* Assets */
import { ReactComponent as ExportIcon } from 'assets/export_icon.svg';
import { ReactComponent as PrintIcon } from 'assets/print_icon.svg';

class Show extends React.Component {
  isFetching = () => {
    const { isResourceFetching } = this.props;
    return isResourceFetching;
  }

  values = () => {
    const { record } = this.props;

    return Object.assign({}, record, {
      created_at: displayUnixTimestamp(record.created_at),
      check_in: record.check_in && displayUnixTimestamp(record.check_in),
      check_out: record.check_out && displayUnixTimestamp(record.check_out),
      slot_id: record.slot ? record.slot.name : '',
      payment_method: record.payments.map(payment => payment.payment_method).join(',')
    });
  };

  print = () => {
    window.print();
  }

  exportFile = () => {
    const { match } = this.props;
    const query = qs.stringify({
      token: localStorage.TOKEN,
      parking_session_id: match.params.id,
      parking_lot_id: match.params.parking_lot_id
    });

    const url = `${env.backend_url}/dashboard/parking_sessions/report.xlsx?${query}`;
    window.open(url, '_blank');
    window.focus();
  }

  renderRecord () {
    const { record, backPath, match } = this.props;

    return (
      <React.Fragment>
        <h2 className="h2-title px-5 py-3">
          <Link to={backPath} className="mr-2" >
            <FontAwesomeIcon color="grey" className="mr-3" icon={faChevronLeft}/>
          </Link>
          Transaction #{record.id}
        </h2>
        <Card>
          <CardHeader className="bg-grey-dark text-white">Transaction's Details</CardHeader>
          <CardBody className="">
            <ShowForm
              fields={showFields}
              values={this.values()}
              backPath={backPath}
              editURL={match.url}
            />
            <Button onClick={this.exportFile} color="primary" className="px-5 py-2 mb-4 mr-2 float-left">
              <ExportIcon className="mr-2"/>
              Export
            </Button>
            <Button className="bg-grey-dark px-5 py-2 mb-4 float-left" onClick={this.print}>
              <PrintIcon className="mr-2"/>
              Print
            </Button>
          </CardBody>
        </Card>
        <PrintableContent>
          <ShowForm
            fields={showFields}
            values={this.values()}
            backPath={backPath}
            editURL={match.url}
          />
        </PrintableContent>
      </React.Fragment>
    );
  }

  render () {
    return this.isFetching() ? <Loader /> : this.renderRecord();
  }
}

Show.propTypes = {
  backPath: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  isResourceFetching: PropTypes.bool.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number,
    vehicle: PropTypes.object.isRequired,
    user_id: PropTypes.number,
    kiosk_id: PropTypes.number,
    created_at: PropTypes.number.isRequired,
    check_in: PropTypes.number,
    check_out: PropTypes.number,
    slot_id: PropTypes.string,
    fee_applied: PropTypes.number,
    total_price: PropTypes.number,
    paid: PropTypes.bool.isRequired,
    status: PropTypes.string,
    payment_method: PropTypes.arrayOf(PropTypes.object)
  })
};

export default connectRecord(
  'parking_session',
  SET_RECORD,
  resourceFetcher(show),
  Show
);
