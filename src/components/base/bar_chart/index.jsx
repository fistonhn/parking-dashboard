import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styles from './bar_chart.module.sass';
import { displayMonthAndDay } from 'components/helpers';
import colorPalette from 'config/color_palette';

const BarChart = ({ data, keys, indexBy, xAxisTitle = '', yAxisTitle = '' }) => {
  if (!data.length) {
    return null;
  }
  const legends = keys.length > 1 ? [
    {
      dataFrom: 'keys',
      anchor: 'top-right',
      direction: 'column',
      justify: false,
      translateX: 90,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle'
    }
  ] : [];

  const chartMarginRight = keys.length > 1 ? 150 : 10;
  return (
    <div className={styles.barChart}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 10, right: chartMarginRight, bottom: 50, left: 60 }}
        padding={0.43}
        enableLabel={false}
        enableGridX={false}
        gridYValues={5}
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
          format: value => displayMonthAndDay(value),
          tickValues: 12,
          tickSize: 4,
          tickPadding: 4,
          tickRotation: 0,
          legend: xAxisTitle,
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        tooltip={({ indexValue, value }) => (
          <div className={styles.tooltip}>
            <span className="general-text-1">{displayMonthAndDay(indexValue)}&nbsp;-&nbsp;</span>
            <span className="general-text-1">{`${value} ${yAxisTitle}`}</span>
          </div>
        )}
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
          },
          tooltip: {
            container: {
              borderRadius: 2,
              padding: 10,
              boxShadow: '0px 1px 4px rgba(183, 189, 200, 0.34)'
            }
          }
        }}
        legends={legends}
      />
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  indexBy: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired
};

export default BarChart;
