var parseDate = d3.timeParse("%d-%m-%Y");

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var width = 720 - margin.left - margin.right; // Use the window's width
var height = 150 - margin.top - margin.bottom; // Use the window's height

var svg = d3.select("#timeline-vis")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleBand().range([height / 1.3, 0]);
var fill = d3.scaleOrdinal().range([d3.rgb("#AC3BD4"),
                                   d3.rgb("#FF9840"),
                                   d3.rgb("#34C6CD"),
                                   d3.rgb("#F2FD3F")
                                  ]);

var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(1));

d3.json("data/timeline.json").then(function(data) {

  // Parsing dates
  data.forEach(function(d) {
    d.start_date = parseDate(d.start_date);
    d.end_date = d.end_date == null ? new Date() : parseDate(d.start_date) ;
  });


  x.domain([d3.min(data, (d) => d.start_date),
            d3.max(data, (d) => d.end_date)]);
  y.domain(data.map((d) => d.category));
  fill.domain(data.map((d) => d.category));

  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - height / 5) + ")")
        .call(xAxis);

  svg.append("g")
  .attr("transform", "translate(0," + margin.top + ")")
  .selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .attr("stroke-width", 15)         // adjust line width
  .attr("stroke-linecap", "round")  // stroke-linecap type
  .attr("x1", (d) => x(d.start_date))
  .attr("y1", (d) => y(d.category))
  .attr("x2", (d) => x(d.end_date))
  .attr("y2", (d) => y(d.category))
  .attr('stroke', (d) => fill(d.category));
});
