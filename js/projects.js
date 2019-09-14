
d3.json('data/projects.json').then(function(data) {
  const cards = d3.select('#cards')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'col-sm-6 col-md-4 col-lg-3 mb-2 mx-4')
    .attr('onclick', d => 'window.open("' + d.url + '")' )
    .style('display', d => d.isPublic ? 'inherit' : 'none')
    .append('div')
    .attr('class', d => 'card card-' + d.category)
    .attr('style', 'width: 14em;');

  cards
    .append('img')
    .attr('class', 'card-img-top')
    .attr('src', d => d.cover)
    .attr('alt', d => d.title)

  const cardBodies = cards
    .append('div')
    .attr('class', 'card-body')

  cardBodies
    .append('h5')
    .attr('class', 'card-title')
    .text(d => d.title)

  cardBodies
    .append('div')
    .attr('class', 'card-text')
    .text(d => d.description)

});
