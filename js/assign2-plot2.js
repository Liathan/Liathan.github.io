// -------------------------------------------------------------------------
// Assignment 2: Histogram (first plot)
// We want to show the distribution of some measures of trees in Trento's 
// territory. We analyze: Height (m), Canopy Size (m2), and Diameter (cm)
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_2 = "#boxplot-tree-size";


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("../data/assign2-plot2.csv", function(data) {


    

  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width ])
    //.domain(["Aesculus hippocastanum", "Platanus x hispanica", "Celtis australis","Carpinus betulus","Tilia cordata"])
    .domain(["Tilia cordata"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([3,9])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x("Tilia cordata"))})
      .attr("x2", function(d){return(x("Tilia cordata"))})
      .attr("y1", function(d){return(y(-0.5))})
      .attr("y2", function(d){return(y(-0.5))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 100
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x("Tilia cordata")-boxWidth/2)})
        .attr("y", function(d){return(y(7))})
        .attr("height", function(d){return(y(d4)-y(7))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x("Tilia cordata")-boxWidth/2) })
      .attr("x2", function(d){return(x("Tilia cordata")+boxWidth/2) })
      .attr("y1", function(d){return(y(5))})
      .attr("y2", function(d){return(y(5))})
      .attr("stroke", "black")
      .style("width", 80)
})
