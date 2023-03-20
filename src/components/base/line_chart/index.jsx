import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import styles from './line_chart.module.sass';
import { displayMonthAndDay } from 'components/helpers';
import colorPalette from 'config/color_palette';

const LineChart = ({ data, xAxisTitle = '', yAxisTitle = '' }) => {
  if (!data.length) {
    return null;
  }
  const legends = data.length > 1 ? [
    {
      anchor: 'top-right',
      direction: 'column',
      justify: false,
      translateX: 90,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle'
    }
  ] : [];

  const chartMarginRight = data.length > 1 ? 150 : 10;
  return (
    <div className={styles.lineChart}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: chartMarginRight, bottom: 50, left: 60 }}
        xScale={{ type: 'time', format: '%Y-%m-%d' }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear' }}
        enableGridX={false}
        gridYValues={5}
        enablePoints={false}
        colors={colorPalette}
        axisLeft={{
          tickValues: 5,
          tickSize: 4,
          tickPadding: 10,
          tickRotation: 0,
          legend: yAxisTitle,
          legendOffset: -46,
          legendPosition: 'middle'
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: 5,
          tickSize: 8,
          tickPadding: 0,
          tickRotation: 0,
          legend: xAxisTitle,
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        tooltip={({ point: { data: { x, y } } }) => (
          <div className={styles.tooltip}>
            <span className="general-text-1">{displayMonthAndDay(x)}&nbsp;-&nbsp;</span>
            <span className="general-text-1">{`${y} ${yAxisTitle}`}</span>
          </div>
        )}
        useMesh={true}
        theme={{
          grid: {
            line: {
              stroke: '#EFF1F6',
              strokeWidth: 1
            }
          },
          axis: {
            legend: {
              text: {
                fill: 'rgba(36, 46, 66, 0.9)',
                fontSize: 10
              }
            },
            ticks: {
              line: {
                stroke: 'rgba(73, 82, 89, 0.9)',
                strokeWidth: 1
              },
              text: {
                fontSize: 10,
                fill: '#495259',
                fontWeight: 300,
                opacity: 0.9
              }
            }
          }
        }}
        legends={legends}
      />
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string
};

export default LineChart;
