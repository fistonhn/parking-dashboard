import React from 'react';

const TableRow = props => {
  const { record } = props;
  const { vehicle = {} } = record;

  return (
    <tr>
      <td>
        {vehicle.id}
      </td>
      <td>
        {vehicle.plate_number}
      </td>
      <td>
        {record.color}
      </td>
      <td>
        {record.vehicle_type}
      </td>
    </tr>
  );
};

export default TableRow;
