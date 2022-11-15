// -------------------------------------------------------------------------
// Assignment 2: Boxplot (second plot)
// We want to show the distribution (via boxplot) of some measures of trees 
// in Trento's territory. 
// We analyze: Height (m), Canopy Size (m2), Diameter (cm), and Leaf Area (m2).
//--------------------------------------------------------------------------


// Refer to the id dive
const id_ref_2 = "#boxplot-tree-size"

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 20, bottom: 70, left: 70},
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_2 + margin_2.left + margin_2.right)
        //.attr("height", height_2 + margin_2.top + margin_2.bottom)
        .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
            ' ' + (height_2 + margin_2.top + margin_2.bottom))
        .append("g")
            .attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);

// SelectBox to choose the measure to show
var selectItem_boxplot_measure = document.getElementById("selection-boxplot-measure");

// The selected measure
var measureHeading_2 = '';

// The possible measures (Height, CanopySize, Diameter, Leaf Area)
var subgroups_2 = [];

// Y axis
var y = [];

var cose=0;

// Read the data and compute summary statistics for each specie
d3.csv("../data/assign2-plot2.csv").then(function(data) {

    // Y axis max value
    max_data = Math.max(...Array.from(d3.map(data, d => d.Height)))

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    //var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    //  .key(function(d) { return d.Species;})
    //  .rollup(function(d) {
    var sumstat = Array.from(d3.group(data, d => d.Species))
        .map(function(d) {
            q1 = d3.quantile(d[1].map(function(g) { return g.Height;}).sort(d3.ascending),.25)
            median = d3.quantile(d[1].map(function(g) { return g.Height;}).sort(d3.ascending),.5)
            q3 = d3.quantile(d[1].map(function(g) { return g.Height;}).sort(d3.ascending),.75)
            interQuantileRange = q3 - q1
            //tmp_min = q1 - 1.5 * interQuantileRange
            //min = (tmp_min > 0) ? tmp_min : 0
            min = Math.max(0, q1 - 1.5 * interQuantileRange)
            //tmp_max = q3 + 1.5 * interQuantileRange
            //max = (max_data > tmp_max) ? tmp_max : max_data
            max = Math.min(max_data, q3 + 1.5 * interQuantileRange)
            return ({key: d[0], q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        });

    cose = sumstat;

    // X axis label
    x_label = [...new Set(d3.map(data, d => d.Species))];
    
    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width_2 ])
        .domain(x_label)
        .paddingInner(1)
        .paddingOuter(.5)
    svg_2.append("g")
        .attr("transform", "translate(0," + height_2 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            //.attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "center")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Y axis max value
    y_max = (Math.ceil(max_data+(5/100*max_data))/5)*5
    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, y_max])
        .range([height_2, 0])
    svg_2.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Show the main vertical line
    svg_2.selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("x1", function(d){return(x(d.key))})
            .attr("x2", function(d){return(x(d.key))})
            .attr("y1", function(d){return(y(d.min))})
            .attr("y2", function(d){return(y(d.max))})
            .attr("stroke", "black")
            .style("width", 40);

    // rectangle for the main box
    var boxWidth = 100;
    
    svg_2.selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.q3))})
            .attr("height", function(d){return(y(d.q1)-y(d.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

    // Show the median
    svg_2.selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
            .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
            .attr("y1", function(d){return(y(d.median))})
            .attr("y2", function(d){return(y(d.median))})
            .attr("stroke", "black")
            .style("width", 80)

    // Add individual points with jitter
    var jitterWidth = 50
    svg_2.selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
        .attr("cx", function(d){return(x(d.Species) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("cy", function(d){return(y(d.Height))})
        .attr("r", 4)
        .style("fill", "white")
        .attr("stroke", "black")


});