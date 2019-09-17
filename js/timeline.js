var parseDate = d3.timeParse('%d-%m-%Y');

var getIcon = function(data) {

  if (data.category === 'Learning')
    return data.finished ? '\uf19d' : '\uf19c';

  if (data.category === 'Researching')
    return data.subcategory === 'Internship' ? '\uf072' : '\uf0c3';

  if (data.category === 'Teaching')
    return data.subcategory === 'Teacher' ? '\uf0f2' : '\uf086';

  if (data.category === 'Practicing')
    return data.subcategory === 'Visualization' ? '\uf080' : '\uf0f2';
}

var getTextIcon = function(data) {

  if (data.category === 'Learning')
    return (data.finished ? '<i class="fa fa-graduation-cap"></i> ' : '<i class="fa fa-university"></i> ') + data.title;

  if (data.category === 'Researching')
    return (data.subcategory === 'Internship' ? '<i class="fa fa-plane"></i> ' : '<i class="fa fa-flask"></i> ') + data.title;

  if (data.category === 'Teaching')
    return (data.subcategory === 'Teacher' ? '<i class="fa fa-suitcase"></i> ' : '<i class="fa fa-comments"></i> ') + data.title;

  if (data.category === 'Practicing')
    return (data.subcategory === 'Visualization' ? '<i class="fa fa-bar-chart"></i> ' : '<i class="fa fa-suitcase"></i> ') + data.title;
}

var margin = {top: 20, right: 10, bottom: 10, left: 10};
var width = parseInt(d3.select('#timeline-vis').style('width'), 10) - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;
var axisBottom = height - height / 4;
var strokeWidthIn = 17;
var strokeWidthOut = 13;
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
    d.finished = d.end_date !== null;
    d.end_date = d.end_date == null ? new Date() : parseDate(d.end_date);
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
      .attr('id', 'tooltip');

    // Three function that change the tooltip when user hover / move / leave a cell
   var mouseover = function(d) {
     Tooltip
       .style('opacity', 1)
     d3.select(this)
       .style('stroke-width', strokeWidthIn)
       .style('opacity', 1)
    d3.select('#hover-tip')
      .attr('class', 'invisible');
   }
   var clampX = (pos0) => pos0 > 520 ? pos0 - 150 : pos0;
   var mousemove = function(d) {
     Tooltip
       .html('<b>' + getTextIcon(d) + '</b><br>' + d.institution)
       .style('left', (clampX(d3.mouse(this)[0]) - 100)+ 'px')
       .style('top', d3.mouse(this)[1] + 'px');
   }
   var mouseleave = function(d) {
     Tooltip
       .style('opacity', 0)
     d3.select(this)
       .style('stroke-width', strokeWidthOut)
       .style('opacity', lineOpacity);
   }

   // Create marks
  var marks = svg.append('g')
     .attr('transform', 'translate(0,' + margin.top + ')')

  // Add career lines
  marks
    .selectAll('line')
    .data(data)
    .enter()
    .append('line')
    .style('stroke', (d) => fill(d.category))
    .style('stroke-width', strokeWidthOut)         // adjust line width
    .style('stroke-linecap', 'round')  // stroke-linecap type
    .style('opacity', lineOpacity)
    .attr('x1', (d) => x(d.start_date))
    .attr('y1', (d) => y(d.category))
    .attr('x2', (d) => x(d.end_date))
    .attr('y2', (d) => y(d.category))
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);

  // Add career dots
  marks
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .style('stroke', (d) => fill(d.category))
    .style('stroke-width', 2)
    .style('fill', (d) => d.finished ? fill(d.category) : 'white')
    .attr('cx', (d) => x(d.end_date))
    .attr('cy', (d) => y(d.category))
    .attr('r', strokeWidthOut / 2.7)

  marks
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text((d) => getIcon(d))
    .style('font-family', 'FontAwesome')
    .style('font-size', '11px')
    .style('fill', 'white')
    .attr('x', (d) => x(d.start_date))
    .attr('y', (d) => y(d.category) + 5)

});
