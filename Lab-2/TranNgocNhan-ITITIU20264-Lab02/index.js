function addEltToSVG(svg, name, attrs) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs === undefined) attrs = {};
    for (var key in attrs) {
        element.setAttributeNS(null, key, attrs[key]);
    }
    svg.appendChild(element);
}

function createHistogram(svgElement, str) {
    svgElement.innerHTML = '.';

    const bins = [
        { label: 'A-D', count: 0 },
        { label: 'E-H', count: 0 },
        { label: 'I-L', count: 0 },
        { label: 'M-P', count: 0 },
        { label: 'Q-U', count: 0 },
        { label: 'V-Z', count: 0 },
    ];

    for (let i = 0; i < str.length; i++) {
        const charCode = str.toUpperCase().charCodeAt(i);
        if (charCode >= 65 && charCode <= 68) {
            bins[0].count++;
        } else if (charCode >= 69 && charCode <= 72) {
            bins[1].count++;
        } else if (charCode >= 73 && charCode <= 76) {
            bins[2].count++;
        } else if (charCode >= 77 && charCode <= 80) {
            bins[3].count++;
        } else if (charCode >= 81 && charCode <= 85) {
            bins[4].count++;
        } else if (charCode >= 86 && charCode <= 90) {
            bins[5].count++;
        }
    }

    const maxCount = Math.max(...bins.map(bin => bin.count));
    const barHeight = 350;

    for (let i = 0; i < bins.length; i++) {
        const bin = bins[i];
        const x = i * 50;
        const y = barHeight * (1 - bin.count / maxCount);
        const width = 50;
        const height = barHeight * (bin.count / maxCount);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', 'blue');
        rect.setAttribute('stroke', 'black');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + width / 2);
        text.setAttribute('y', barHeight + 20);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'black');
        text.textContent = bin.label;

        svgElement.appendChild(rect);
        svgElement.appendChild(text);
    }
}

function createBarChart(svgElement,dataset) {
    svgElement.innerHTML = '.';

    function getColor(d) {
        const blueValue = 0 + (d * 5);
        return `rgb(0, 0, ${blueValue})`;
    }

    var svg = d3.select("#bar_chart"),
        width = svg.attr("width"),
        height = svg.attr("height");

    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return i * (width / dataset.length); })
        .attr("y", function (d) { return height - (d * 3); })
        .attr("width", width / dataset.length - 2)
        .attr("height", function (d) { return d * 3; })
        .style("fill", function (d) { return getColor(d); })


    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
            return i * (width / dataset.length) + (width / dataset.length - 2) / 2;
        })
        .attr("y", function (d) {
            return height - (d * 3) + 10;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("fill", "#ffffff")
}
function createHisto(svgElement, dataset) {
    svgElement.innerHTML = ".";

    function getColor(rate) {
        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, 1]); 
        return colorScale(rate);
    }
    
    var width = 500;
    var height = 400;
    var numberOfBins = 10;

    var binWidth = (d3.max(dataset) - d3.min(dataset)) /numberOfBins;

    var svg = d3.select("#histogram_2")
        .attr("width", width)
        .attr("height", height + 20)
        .attr("transform",
            "translate(" + 0 + "," + 0 + ")")
        .style("overflow", "initial");

    var histogram = d3.histogram()
        .domain([d3.min(dataset), d3.max(dataset)])
        .thresholds(d3.range(d3.min(dataset), d3.max(dataset) + binWidth, binWidth));

    var bins = histogram(dataset);

    var xScale = d3.scaleLinear()
        .domain([d3.min(dataset), d3.max(dataset)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, function (d) { return d.length; })])
        .range([height, 0]);

    var bars = svg.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.x0); })
        .attr("y", function (d) { return yScale(d.length); })
        .attr("width", function (d) { return xScale(d.x1) - xScale(d.x0) - 1.5; })
        .attr("height", function (d) { return height - yScale(d.length); })
        .style("fill", function (d) {
            const rate = d.length / dataset.length;
            return getColor(rate);
        });

        var xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

const dataset = Array.from({ length: 20 }, () => Math.floor(5 + Math.random() * 51));
createBarChart(document.querySelector("#bar_chart"),dataset);
createHisto(document.querySelector("#histogram_2"),dataset);
createHistogram(document.querySelector("#histogram"), "Tran Ngoc Nhan");



