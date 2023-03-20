const DetailedReportsResponseParser = (resp) => {
  const pieCharts = {};
  const individualParkingLots = [];
  const { pie_chart_data, parking_lots } = resp;

  /*
    parses data for the pie chart
  */
  for (const [pieChartGroup, pieChartGroupValues] of Object.entries(pie_chart_data)) {
    const pieGroup = [];
    for (const [parkingLotName, parkingLotCount] of Object.entries(pieChartGroupValues)) {
      pieGroup.push({
        id: parkingLotName,
        label: parkingLotName,
        value: parkingLotCount
      });
    }

    pieCharts[pieChartGroup] = pieGroup;
  }

  /*
    parses data for the individual parking lot
  */
  // eslint-disable-next-line no-unused-vars
  for (const [_key, { bar_chart_data, table_data, name }] of Object.entries(parking_lots || [])) {
    const individualParkingLot = {
      barChartData: [],
      lineChartData: [],
      tableData: table_data,
      name
    };

    for (const [chartGroup, chartGroupValues] of Object.entries(bar_chart_data)) {
      const byChartGroup = individualParkingLot.lineChartData.find(chartData => chartData.id === chartGroup) || { id: chartGroup, data: [] };

      for (const [date, count] of Object.entries(chartGroupValues)) {
        const byDateGroup = individualParkingLot.barChartData.find(chartData => chartData.date === date);

        if (byDateGroup) {
          byDateGroup[chartGroup] = count;
        } else {
          individualParkingLot.barChartData.push({
            date,
            [chartGroup]: count
          });
        }

        byChartGroup.data.push({
          x: date,
          y: count
        });
      }

      individualParkingLot.lineChartData.push(byChartGroup);
    }

    individualParkingLots.push(individualParkingLot);
  }

  return {
    pieCharts,
    individualParkingLots
  };
};

export default DetailedReportsResponseParser;
