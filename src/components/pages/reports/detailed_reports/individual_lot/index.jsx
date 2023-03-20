import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import BarChart from 'components/base/bar_chart';
import LineChart from 'components/base/line_chart';
import DataTable from 'components/base/data_table';
import CheckBox from 'components/base/check_box';
import styles from './individual_lot.module.sass';
import NoData from '../no_data/index';

const IndividualLot = ({ name, chartData, tableData, tableDataFields, showAllDataTable, printable, defaultDataTableRows }) => {
  const [showDataTable, setShowDataTable] = useState(showAllDataTable);

  useEffect(() => {
    setShowDataTable(showAllDataTable);
  }, [showAllDataTable]);

  let Chart = BarChart;
  let graphData = chartData.barChartData;
  const graphKeys = chartData.lineChartData.map(data => data.id);

  if (chartData.barChartData.length > 7) {
    Chart = LineChart;
    graphData = chartData.lineChartData;
  }

  return (
    <Row className="no-gutters">
      <Col>
        <div className={styles.individualRule} />
        <span className={`general-text-1 ${styles.individualTitle}`}>
          {name}
        </span>
        {
          !printable &&
          <CheckBox
            label="Include individual data of THIS parking lot"
            value={showDataTable}
            onChange={() => setShowDataTable(!showDataTable) }
          />
        }
        <Row className="no-gutters">
          <Col xs="12" lg="7" className={styles.individualChartWrapper}>
            {
              graphData.length
                ? <Chart
                  data={graphData}
                  keys={graphKeys}
                  indexBy="date"
                  xAxisTitle="Covered Date"
                  yAxisTitle="Parked Vehicles"
                />
                : <NoData text="No Chart Data" />
            }
          </Col>
          <Col xs="12" lg="5" className="d-lg-flex flex-column justify-content-center pl-lg-4 overflow-auto">
            {
              (showDataTable || printable)
                ? <DataTable
                  data={tableData}
                  defaultDisplayRow={defaultDataTableRows || (printable ? tableData.length : 6)}
                />
                : <div className={styles.individualNoDataTable}>
                  <span className="general-text-1">
                    If you want to show individual data for this parking lot, check it above the title.
                  </span>
                </div>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

IndividualLot.propTypes = {
  name: PropTypes.string.isRequired,
  chartData: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  showAllDataTable: PropTypes.bool,
  printable: PropTypes.bool,
  defaultDataTableRows: PropTypes.number
};

export default IndividualLot;
