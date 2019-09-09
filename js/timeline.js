var parseDate = d3.timeParse('%d-%m-%Y');

var margin = {top: 20, right: 10, bottom: 10, left: 10};
var width = 720 - margin.left - margin.right; // Use the window's width
var height = 150 - margin.top - margin.bottom; // Use the window's height
var axisBottom = height - height / 5;
var strokeWidthIn = 12;
var strokeWidthOut = 10;
var lineOpacity = 0.85;

var svg = d3.select('#timeline-vis')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleBand().range([height / 1.5, margin.top]);
var fill = d3.scaleOrdinal().range([d3.rgb('#AC3BD4'),
                                   d3.rgb('#FF9840'),
                                   d3.rgb('#34C6CD'),
                                   d3.rgb('#F2FD3F')
                                  ]);

var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(1));

d3.json('data/timeline.json').then(function(data) {

  // Parsing dates
  data.forEach(function(d) {
    d.start_date = parseDate(d.start_date);
    d.end_date = d.end_date == null ? new Date() : parseDate(d.end_date) ;
  });


  x.domain([d3.min(data, (d) => d.start_date),
            d3.max(data, (d) => d.end_date)]);
  y.domain(data.map((d) => d.category));
  fill.domain(data.map((d) => d.category));

  // Add x axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + axisBottom + ')')
    .call(xAxis);

    // Tooltip
    var Tooltip = d3.select('#timeline-vis')
      .append('div')
      .style('opacity', 0)
      .style('font-size', '10px')
      .attr('class', 'tooltip')
      .style('background-color', 'floralwhite')
      .style('border-radius', '5px')
      .style('padding', '3px')

    // Three function that change the tooltip when user hover / move / leave a cell
   var mouseover = function(d) {
     Tooltip
       .style('opacity', 1)
     d3.select(this)
       .style('stroke-width', strokeWidthIn)
       .style('opacity', 1)
    d3.select('#hover-tip')
      .attr('class', 'invisible')
   }
   var mousemove = function(d) {
     Tooltip
       .html('<b>' + d.title + '</b><br>' + d.institution)
       .style('left', (x(d.end_date)/2) + 'px')
       .style('top', (y(d.category)) + 'px')
   }
   var mouseleave = function(d) {
     Tooltip
       .style('opacity', 0)
     d3.select(this)
       .style('stroke-width', strokeWidthOut)
       .style('opacity', lineOpacity)
   }

  // Add career lines
  svg.append('g')
    .attr('transform', 'translate(0,' + margin.top + ')')
    .selectAll('line')
    .data(data)
    .enter()
    .append('line')
    .style('stroke-width', strokeWidthOut)         // adjust line width
    .style('stroke-linecap', 'round')  // stroke-linecap type
    .style('opacity', lineOpacity)
    .attr('x1', (d) => x(d.start_date))
    .attr('y1', (d) => y(d.category))
    .attr('x2', (d) => x(d.end_date))
    .attr('y2', (d) => y(d.category))
    .attr('stroke', (d) => fill(d.category))
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  // Add degrees
  var degrees = svg.append('g')
    .attr('transform', 'translate(0, 0)')

  // Dots
  degrees
  .selectAll('circle')
  .data(data.filter((d) => d.category === 'Learning' && d.is_graduated))
  .enter()
  .append('circle')
  .attr('cx', (d) => x(d.end_date))
  .attr('cy', margin.top)
  .attr('r', 5)

  // Lines
  degrees
  .selectAll('line')
  .data(data.filter((d) => d.category === 'Learning' && d.is_graduated))
  .enter()
  .append('line')
  .style('stroke', 'black')
  .style('stroke-width', 2)
  .attr('x1', (d) => x(d.end_date))
  .attr('x2', (d) => x(d.end_date))
  .attr('y1', axisBottom)
  .attr('y2', margin.top)

  degrees
  .selectAll('text')
  .data(data.filter((d) => d.category === 'Learning' && d.is_graduated))
  .enter()
  .append('text')
  .attr('x', (d) => x(d.end_date)*0.9)
  .attr('y', margin.top-10)
  .text((d) => d.abbreviation)

});
