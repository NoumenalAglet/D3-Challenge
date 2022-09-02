// Defining SVG size and margins
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20, 
  right: 40, 
  bottom: 180,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper and appending a group to hold chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Importing data from CSV file
d3.csv('assets/data/data.csv').then(function(censusData) {
  
  //Parse data
  censusData.forEach(function(data){
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
  });

  // Creating scales
  var xLinearScale = d3.scaleLinear()
  .domain([3, d3.max(censusData, d => d.healthcare)])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([6, d3.max(censusData, d => d.poverty)])
  .range([height, 0]);

  // Creating axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Adding axes
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Add y-axis
  chartGroup.append("g")
    .call(leftAxis);

  // Creating circle data points
  chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true);

  chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.poverty))
    .classed("stateText", true);
  
  // Creating and appending axes labels
  // Adding X axis label
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 50})`)
    .classed("aText", true)
    .text("Lacks Healthcare (%)");
  
  // Adding Y axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("In Poverty (%)");

})

