let minVinput = document.querySelector('#minV');
let maxVinput = document.querySelector('#maxV');
minVinput.value = 205;
maxVinput.value = 253;

function DrawGraph(data) {
  am5.ready(function () {
    /**
     * ---------------------------------------
     * This demo was created using amCharts 5.
     *
     * For more information visit:
     * https://www.amcharts.com/
     *
     * Documentation is available at:
     * https://www.amcharts.com/docs/v5/
     * ---------------------------------------
     */

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new('chartdiv');

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      }),
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineX.set('forceHidden', true);
    cursor.lineY.set('forceHidden', true);

    // Generate random data
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    var value = 20;
    function generateData() {
      value = am5.math.round(Math.random() * 10 - 4.8 + value, 1);
      if (value < 0) {
        value = Math.random() * 10;
      }

      if (value > 100) {
        value = 100 - Math.random() * 10;
      }
      am5.time.add(date, 'day', 1);
      return {
        date: date.getTime(),
        value: value,
      };
    }

    function generateDatas(count) {
      var data = [];
      for (var i = 0; i < count; ++i) {
        data.push(generateData());
      }
      return data;
    }

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: {
          timeUnit: 'second',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
      }),
    );

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      }),
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      }),
    );

    series.fills.template.setAll({
      fillOpacity: 0,
      visible: true,
    });

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      }),
    );

    // Set data
    // var data = generateDatas(300);
    // var data;
    // console.log(data);
    // series.data.setAll(data);

    var rangeDate = new Date();
    am5.time.add(rangeDate, 'day', Math.round(series.dataItems.length / 2));
    var rangeTime = rangeDate.getTime();

    // add series range
    var seriesRangeDataItem = yAxis.makeDataItem({ value: maxVinput.value, endValue: 500 });
    var seriesRangeDataItemLow = yAxis.makeDataItem({ value: minVinput.value, endValue: 0 });
    var seriesRange = series.createAxisRange(seriesRangeDataItem);
    var seriesRangeLow = series.createAxisRange(seriesRangeDataItemLow);
    seriesRange.fills.template.setAll({
      visible: true,
      opacity: 1,
    });
    seriesRangeLow.fills.template.setAll({
      visible: true,
      opacity: 1,
    });

    // seriesRange.fills.template.set("fill", am5.color(0xff0000));
    seriesRange.strokes.template.set('stroke', am5.color(0xff0000));
    seriesRangeLow.fills.template.set('fill', am5.color(0xff0000));
    seriesRangeLow.strokes.template.set('stroke', am5.color(0xff0000));

    seriesRangeDataItem.get('grid').setAll({
      strokeOpacity: 1,
      visible: true,
      stroke: am5.color(0xff0000),
      strokeDasharray: [2, 2],
    });

    seriesRangeDataItem.get('label').setAll({
      location: 0,
      visible: true,
      text: 'Max V',
      inside: true,
      centerX: 0,
      centerY: am5.p100,
      fontWeight: 'bold',
    });
    seriesRangeDataItemLow.get('grid').setAll({
      strokeOpacity: 1,
      visible: true,
      stroke: am5.color(0xff0000),
      strokeDasharray: [1, 2],
    });

    seriesRangeDataItemLow.get('label').setAll({
      location: 0.002,
      visible: true,
      text: 'Min V',
      inside: true,
      centerX: 0,
      centerY: am5.p100,
      fontWeight: 'bold',
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
    series.data.setAll(data);
  });
}

document.getElementById('inputfile').addEventListener('change', function () {
  let fr = new FileReader();

  fr.onload = function () {
    data = [];
    linesArray = fr.result.split('\n');
    linesArray.forEach((element) => {
      let correctedLocalDate = `${element.split('|')[0].slice(3, 5)}/${element
        .split('|')[0]
        .slice(0, 2)}${element.split('|')[0].slice(5)}`;
      let localDate = toTimestamp(`${correctedLocalDate} ${element.split('|')[1]}`);
      let value = Number(`${element.split('|')[2]}`);
      if (element.length) {
        data.push({
          date: localDate,
          value: isNaN(value) || value < 150 ? 0 : value,
        });
      }
    });
    console.log(data);
    DrawGraph(data);
  };

  fr.readAsText(this.files[0]);
});
function toTimestamp(strDate) {
  const dt = Date.parse(strDate);
  return dt;
} // end am5.ready()
