import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import styles from './pie_chart.module.sass';
import Legend from './legend';
import colorPalette from 'config/color_palette';

const ReportsPieChart = ({ data, reportName }) => {
  if (!data.length) {
    return null;
  }
  const pieData = data.map((item, i) => ({
    ...item,
    color: colorPalette[i % colorPalette.length]
  }));
  return (
    <React.Fragment>
      <div className={styles.title}>
        <span className="general-text-1">{reportName}</span>
      </div>
      <div className={styles.pieChart}>
        <div />
        <div>
          <ResponsivePie
            data={pieData}
            colors={item => item.color}
            enableSlicesLabels={false}
            radialLabelsTextColor="#242E42"
            radialLabelsLinkColor="#E6E8F1"
            radialLabelsTextXOffset={4}
            radialLabelsLinkHorizontalLength={10}
            width={490}
            margin={{ top: 10, right: 0, bottom: 50, left: 0 }}
            theme={{
              tooltip: {
                container: {
                  fontSize: 10,
                  fontWeight: 300,
                  color: 'rgba(36, 46, 66, 0.9)'
                }
              }
            }}
          />
        </div>
        <div />
        <Legend
          data={data}
          colors={colorPalette}
        />
        <div />
      </div>
    </React.Fragment>
  );
};

ReportsPieChart.propTypes = {
  data: PropTypes.array.isRequired,
  reportName: PropTypes.string.isRequired
};

export default ReportsPieChart;
