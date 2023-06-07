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
var root = am5.Root.new("chartdiv");
let data = [];
// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([am5themes_Animated.new(root)]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
  })
);

chart.get("colors").set("step", 3);

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

// Generate random data
var date = new Date();
console.log(date.toLocaleString());
console.log(toTimestamp(date.toLocaleString()));
console.log(new Date(toTimestamp(date.toLocaleString())));
var value = 100;

// function generateData() {
//   value = Math.round(Math.random() * 10 - 5 + value);
//   am5.time.add(date, "second", 1);
//   return {
//     date: date.getTime(),
//     value: value,
//   };
// }

// function generateDatas(count) {
//   var data = [];
//   for (var i = 0; i < count; ++i) {
//     data.push(generateData());
//   }
//   return data;
// }

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    maxDeviation: 0.3,
    baseInterval: {
      timeUnit: "second",
      count: 1,
    },
    //gridIntervals: [{ timeUnit: "day", count: 1 }],
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {}),
  })
);
xAxis.get("periodChangeDateFormats")["second"] = "MMM";

var yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {}),
  })
);

var series = chart.series.push(
  am5xy.LineSeries.new(root, {
    connect: true,
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "voltage",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}",
    }),
  })
);

var drawingSeries = chart.series.push(
  am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "voltage",
    valueXField: "date",
  })
);

// Invisible bullet which will be dragged (to avoid some conflicting between
// drag position and bullet position which results flicker)
drawingSeries.bullets.push(function () {
  var bulletCircle = am5.Circle.new(root, {
    radius: 6,
    fillOpacity: 0,
    fill: drawingSeries.get("fill"),
    draggable: true,
    cursorOverStyle: "pointer",
  });
  bulletCircle.events.on("dragged", function (e) {
    handleDrag(e);
  });
  return am5.Bullet.new(root, {
    sprite: bulletCircle,
  });
});

// Actual bullet
drawingSeries.bullets.push(function () {
  var bulletCircle = am5.Circle.new(root, {
    radius: 5,
    fill: drawingSeries.get("fill"),
  });
  return am5.Bullet.new(root, {
    sprite: bulletCircle,
  });
});

// Drag handler
function handleDrag(e) {
  var point = chart.plotContainer.toLocal(e.point);
  var date = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
  var value = yAxis.positionToValue(yAxis.coordinateToPosition(point.y));

  var dataItem = e.target.dataItem;
  dataItem.set("valueX", date);
  dataItem.set("valueXWorking", date);
  dataItem.set("valueY", value);
  dataItem.set("valueYWorking", value);
}

// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set(
  "scrollbarX",
  am5.Scrollbar.new(root, {
    orientation: "horizontal",
  })
);

// Set data
// var data =

// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
series.appear(1000);
chart.appear(1000, 100);

// Interactivity
// chart.plotContainer.get("background").events.on("click", function (e) {
//   var point = chart.plotContainer.toLocal(e.point);
//   var date = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
//   var value = yAxis.positionToValue(yAxis.coordinateToPosition(point.y));
//   drawingSeries.data.push({
//     date: date,
//     voltage: value,
//   });

//   sortData();
// });

// Sort data so that if clicked between existing data items, the item would
// be added between
function sortData() {
  drawingSeries.dataItems.sort(function (a, b) {
    var atime = a.get("valueX");
    var btime = b.get("valueX");

    if (atime < btime) {
      return -1;
    } else if (atime == btime) {
      return 0;
    } else {
      return 1;
    }
  });
}

// Explanatory labels
chart.plotContainer.children.push(
  am5.Label.new(root, {
    x: 15,
    y: 15,
    text: "Data from some to some",
  })
);

document.getElementById("inputfile").addEventListener("change", function () {
  let fr = new FileReader();

  fr.onload = function () {
    data = [];
    linesArray = fr.result.split("\n");
    linesArray.forEach((element) => {
      let correctedLocalDate = `${element.split("|")[0].slice(3, 5)}/${element
        .split("|")[0]
        .slice(0, 2)}${element.split("|")[0].slice(5)}`;
      console.log(correctedLocalDate);
      let localDate = toTimestamp(`${correctedLocalDate} ${element.split("|")[1]}`);
      console.log(localDate);
      let value = Number(`${element.split("|")[2]}`);
      if (element.length) {
        data.push({
          date: localDate,
          voltage: isNaN(value) || value < 150 ? 0 : value,
        });
      }
    });

    series.data.setAll(data);
  };

  fr.readAsText(this.files[0]);
});

function toTimestamp(strDate) {
  const dt = Date.parse(strDate);
  return dt;
}

// dataOld = generateDatas(100);
// console.log(dataOld);
// series.data.setAll(dataOld);
