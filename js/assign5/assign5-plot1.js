
const margin = { top: 20, right: 100, bottom: 80, left: 20 },
width = 1024 - margin.left - margin.right,
height = 768 - margin.top - margin.bottom;


    
// Scale factor on both dimensions (width and height)
const scaleFactor = 0.9;

// Append the svg_1 object to the page
const svg = d3.select("#sankey")
    .append("svg")
    //.attr("width", width_1 + margin_1.left + margin_1.right)
    //.attr("height", height_1 + margin_1.top + margin_1.bottom)
    .attr("viewBox", '0 0 ' + (width + margin.left + margin.right) +
        ' ' + (height + margin.top + margin.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor)*width/2 + margin.left},
                                  ${(1-scaleFactor)*height/2 + margin.top})`);

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function(d) { return formatNumber(d); },
    color_5 = d3.scaleOrdinal(d3.schemeCategory10);
  




// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);
    

var path = sankey.links();

// load the data
d3.json("../../data/assign5/assign5-plot1.json").then(function(sankeydata) {

  graph = sankey(sankeydata);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return d.width; });  

// add the link titles
  link.append("title")
        .text(function(d) {
    		    return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node");

// add the rectangles for the nodes
  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
		      return d.color_5 = color_5(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { 
		  return d3.rgb(d.color_5).darker(2); })
    .append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");


  

});