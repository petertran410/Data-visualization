d3.csv(
  "https://tungth.github.io/data/vn-provinces-data.csv",
  rowConverter
).then((data) => {
  console.log(data);
  your_draw_chart_function(data);
});

function rowConverter(data) {
  return {
    population: parseInt(data.population),
    grdp: parseInt(data["GRDP-VND"]),
    area: parseInt(data.area),
    density: parseInt(data.density),
  };
}

function your_draw_chart_function(data) {
  console.log(data.length);

  var width = 600;
  var height = 300;
  var padding = 20;
  var yAxisPadding = 25;
  var labelPadding = 15;

  var maxPopulation = d3.max(data, (d) => d.population);
  var xScale = d3
    .scaleLinear()
    .domain([0, maxPopulation])
    .range([0 + yAxisPadding + labelPadding, width - padding]);

  var maxGrdp = d3.max(data, (d) => d.grdp);
  var yScale = d3
    .scaleLinear()
    .domain([0, maxGrdp])
    .range([height - padding - labelPadding, 0 + padding]);

  var svg = d3
    .select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.population))
    .attr("cy", (d) => yScale(d.grdp))
    .attr("r", (d) => Math.sqrt(d.area / (Math.PI * 30)))
    .attr(
      "fill",
      (d) => "rgb(40, 100, " + Math.round((d.density / 15) * 10) + ")"
    );

  var xAxis = d3.axisBottom(xScale).tickValues([0, 2000, 4000, 6000, 8000]);
  var yAxis = d3
    .axisLeft(yScale)
    .tickValues([0, 20, 40, 60, 80, 100, 120, 140]);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding - labelPadding) + ")")
    .call(xAxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height)
    .text("POPULATION")
    .attr("font-size", "15px")
    .style("font-weight", "bold");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (yAxisPadding + labelPadding) + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("GRDP - VND")
    .attr("font-size", "15px")
    .style("font-weight", "bold");
}
