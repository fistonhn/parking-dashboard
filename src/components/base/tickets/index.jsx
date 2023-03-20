import React from 'react';
import { displayUnixTimestamp } from 'components/helpers';
import { withRouter } from 'react-router-dom';

const Tickets = props => {
  const { parkingTicket, url, history } = props;
  return (
    <tr onClick={() => history.push(`${url}/${parkingTicket.id}`)}>
      <th scope="row">{parkingTicket.id}</th>
      <td>{parkingTicket.type}</td>
      <td>{parkingTicket.lot.name}</td>
      <td>{displayUnixTimestamp(parkingTicket.created_at)}</td>
      <td>{parkingTicket.officer ? parkingTicket.officer.email : 'Unassigned'}</td>
      <td>{parkingTicket.status}</td>
    </tr>
  );
};

export default withRouter(Tickets);
