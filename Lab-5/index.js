let width = 1500;
let height = 800;
let spacing = 100;

let info = d3
  .select("#info")
  .style("position", "absolute") // Positioning
  .style("background", "white")
  .style("padding", "10px") // Modify the padding
  .style("border", "2px solid black") // Modify the border
  .style("display", "none");

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${spacing / 2}, ${spacing / 2})`);

d3.csv(
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
).then(function (data) {
  let date = "3/20/20";
  let dataByDate = data.map(function (d) {
    return {
      country: d["Country/Region"],
      lat: parseFloat(d["Lat"]),
      long: parseFloat(d["Long"]),
      date: date,
      confirmed: parseInt(d[date]),
    };
  });
  console.log(dataByDate);
  draw(dataByDate);
});
function draw(data) {
  let minLat = d3.min(data, function (d) {
    return d.lat;
  });
  let maxLat = d3.max(data, function (d) {
    return d.lat;
  });
  let minLong = d3.min(data, function (d) {
    return d.long;
  });
  let maxLong = d3.max(data, function (d) {
    return d.long;
  });

  console.log(minLat, maxLat, minLong, maxLong);

  minLat = Math.ceil(minLat);
  maxLat = Math.ceil(maxLat);
  minLong = Math.ceil(minLong);
  maxLong = Math.ceil(maxLong);

  console.log(minLat, maxLat, minLong, maxLong);

  let xScale = d3
    .scaleLinear()
    .domain([minLong, maxLong])
    .range([0, width - spacing]);
  let yScale = d3
    .scaleLinear()
    .domain([minLat, maxLat])
    .range([height - spacing, 0]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // 1
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${height - spacing / 2})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(-height + spacing / 2)
        .tickFormat("")
        .tickSizeOuter(0)
        .tickSizeInner(-height + spacing / 2)
        .tickPadding(10)
        .tickFormat("")
    );

  // 2
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${spacing / 2}, 0)`)
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(-width + spacing / 2)
        .tickFormat("")
        .tickSizeOuter(0)
        .tickSizeInner(-width + spacing / 2)
        .tickPadding(10)
        .tickFormat("")
    );

  svg
    .append("g")
    .attr("id", "xAxis")
    .attr("transform", `translate(0, ${(height - spacing) / 2})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .filter(function (d) {
      return d === 0;
    })
    .attr("transform", "translate(-10,0)")
    .style("text-anchor", "end");

  svg
    .append("g")
    .attr("id", "yAxis")
    .attr("transform", `translate(${(width - spacing) / 2}, 0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .attr("transform", "translate(0,-3)")
    .filter(function (d) {
      return d === 0;
    })
    .remove();

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.long);
    })
    .attr("cy", function (d) {
      return yScale(d.lat);
    })
    .attr("r", 10) // Circle size
    .style("fill", "blue") // Color of circles
    .style("opacity", 0.7) // Opacity
    .on("mouseover", function (d) {
      info.style("display", "block");
      info
        .html(
          `Country: ${d.country}<br>Confirmed Cases: ${d.confirmed}<br>Latitude: ${d.lat}<br>Longitude: ${d.long}`
        )
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      info.style("display", "none");
    });
}
