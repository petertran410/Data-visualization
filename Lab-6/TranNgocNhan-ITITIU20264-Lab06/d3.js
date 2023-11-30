const height = 600;
const width = 800;
const padding = 50;

var rowConverter = (d) => {
  return {
    area: d["Country/Region"] + " " + d["Province/State"],
    lat: parseFloat(d.Lat),
    long: parseFloat(d.Long),
    total: parseInt(d["4/5/20"]),
  };
};

var scatterPlot = () => {
  d3.csv(
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    rowConverter
  ).then((data) => {
    data = data.filter((d) => !isNaN(d.lat) && !isNaN(d.long) && d.total > 0);
    let svg = d3
      .select(".scatterplot")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
    let xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, function (d) {
          return d.lat;
        }),
        d3.max(data, function (d) {
          return d.lat;
        }),
      ])
      .range([padding, width - padding]);
    let yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, function (d) {
          return d.long;
        }),
        d3.max(data, function (d) {
          return d.long;
        }),
      ])
      .range([height - padding, padding]);
    let opacScale = d3
      .scaleLog()
      .domain([
        d3.min(data, function (d) {
          return d.total;
        }),
        d3.max(data, function (d) {
          return d.total;
        }),
      ])
      .range([0.1, 1]);
    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.lat);
      })
      .attr("cy", function (d) {
        return yScale(d.long);
      })
      .attr("r", 5)
      .attr("fill", "green")
      .attr("fill-opacity", function (d) {
        return opacScale(d.total);
      })
      .on("mouseover", function (event, d) {
        var xPosition = parseFloat(d3.select(this).attr("cx")) + 5;
        var yPosition = parseFloat(d3.select(this).attr("cy")) + 5;
        d3.select("#tooltips")
          .style("left", xPosition + "px")
          .style("top", yPosition + "px")
          .append("p", d.area)
          .attr("id", "area")
          .text(d.area);
        d3.select("#tooltips")
          .append("p", d.total)
          .attr("id", "value")
          .text(`Total: ${d.total} case(s)`);
        d3.select("#tooltips")
          .append("p", d.lat)
          .attr("id", "value")
          .text("Latitude: " + d.lat);
        d3.select("#tooltips")
          .append("p", d.long)
          .attr("id", "value")
          .text("Longitude: " + d.long);
        d3.select(this).attr("fill", "blue");
        d3.select("#tooltips").classed("hidden", false);
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .attr("fill", "orange")
          .attr("fill-opacity", function (d) {
            return opacScale(d.total);
          });
        d3.selectAll("p").remove();
        d3.select("#tooltips").classed("hidden", true);
      });
    //Brushing
    svg.call(
      d3
        .brush()
        .extent([
          [padding, padding],
          [width - padding, height - padding],
        ])
        .on("start brush", updateChart)
    );

    function updateChart({ selection }) {
      scatter.classed("selected", function (d) {
        return isBrushed(selection, xScale(d.lat), yScale(d.long));
      });
    }
    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    let xAxis = d3.axisBottom().scale(xScale);
    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);
    svg
      .append("text")
      .text("Latitude")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - padding * 0.2)
      .attr("fill", "black")
      .attr("font-size", 14);

    let yAxis = d3.axisLeft().scale(yScale);
    svg
      .append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
    svg
      .append("text")
      .text("Longitude")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", padding / 2)
      .attr("font-size", 14)
      .attr("fill", "black")
      .attr("transform", "rotate(-90)");
  });
};
