var dataset = [];
var numOfBars = 20;
var height = 700;
var width = 1000;

function rowConverter(data) {
  return {
    province: data.province,
    GRDP: parseInt(data["GRDP-VND"]),
  };
}

d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter)
  .then(function (data) {
    dataset = data.slice(0, numOfBars);
    draw();
  })
  .catch(function (error) {
    console.log(error);
  });

document.getElementById("Sort").addEventListener("click", function () {
  var sortBy = document.getElementById("sort").value;

  if (sortBy === "name") {
    sortByName();
  } else if (sortBy === "grdp") {
    sortByGRDP();
  }
});

function draw() {
  var xAxisPadding = 35;
  var yAxisPadding = 80;

  d3.select("svg").remove();

  var svg = d3
    .select("div")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  var maxGrdp = d3.max(dataset, function (d) {
    return d.GRDP;
  });

  var xScale = d3
    .scaleLinear()
    .domain([0, maxGrdp])
    .range([0, width - yAxisPadding]);

  var yScale = d3
    .scaleBand()
    .domain(
      dataset.map(function (d) {
        return d.province;
      })
    )
    .range([0, height - xAxisPadding])
    .paddingInner(0.05);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", yAxisPadding)
    .attr("y", function (d, i) {
      return (i * (height - xAxisPadding)) / numOfBars;
    })
    .attr("width", function (d) {
      return xScale(d.GRDP);
    })
    .attr("height", yScale.bandwidth())
    .attr("fill", "blue");

  svg
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
      return d.GRDP;
    })
    .attr("x", function (d) {
      return xScale(d.GRDP) + 10;
    })
    .attr("y", function (d, i) {
      return (i * (height - xAxisPadding)) / numOfBars + yScale.bandwidth() / 2;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "times new roman")
    .attr("font-size", "12px")
    .attr("fill", "White");

  var xAxis = d3
    .axisBottom(xScale)
    .tickValues([0, 20, 40, 60, 80, 100, 120, 140]);

  var yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + yAxisPadding + "," + (height - xAxisPadding) + ")"
    )
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + yAxisPadding + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height)
    .text("GRDP-VND")
    .attr("font-family", "times new roman")
    .attr("font-size", "15px");
}

function sortByName() {
  dataset.sort(function (a, b) {
    return a.province.localeCompare(b.province);
  });
  draw();
}

function sortByGRDP() {
  dataset.sort(function (a, b) {
    return b.GRDP - a.GRDP;
  });
  draw();
}
