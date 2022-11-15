// -------------------------------------------------------------------------
// Assignment 2: BubbleChart (first plot)
// We want to show the canopy size with respect to a tree size, such as
// height, diameter, or leaf area, and the CO2 sequestratede of each top-5
// tree species in Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_5 = "#bubblechart-canopysize"

// Set the dimensions and margins of the graph
const margin_5 = {top: 50, right: 40, bottom: 60, left: 40},
    width_5 = 1024 - margin_5.left - margin_5.right,
    height_5 = 768 - margin_5.top - margin_5.bottom;

// Append the svg_5 object to the page
const svg_5 = d3.select(id_ref_5)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_5 + margin_5.left + margin_5.right)
        //.attr("height", height_5 + margin_5.top + margin_5.bottom)
        .attr("viewBox", '0 0 ' + (width_5 + margin_5.left + margin_5.right) +
            ' ' + (height_5 + margin_5.top + margin_5.bottom))
        .append("g")
            .attr("transform", `translate(${margin_5.left}, ${margin_5.top})`);

// Create a tooltip
const tooltip_5 = d3.select(id_ref_1)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// Possible label for x axis depending on the selected measure
var x_label = ["Height (m)", "Canopy size (m\u00B2)", "Diameter (cm)", "Leaf area (m\u00B2)"];

var cose5;

// Parse the Data
d3.csv('../data/assign2-plot5.csv', function(data, i) {

    // Extract subgroups (tree measures)
    subgroups_5 = data;
    cose5 = subgroups_5;

});

//     // Load possible options for "measures" in the selectBox
//     for(j = 0; j < subgroups_1.length; ++j)
//     {
//         opt = new Option(subgroups_1[j].replace("_", " "), subgroups_1[j]);
//         selectItem_hist_measure.appendChild(opt);
//     };

//     // Take the selected item from the selectBox
//     measureHeading_1 = selectItem_hist_measure.value;

//     // Take the selected number of bins
//     n_bins_1 = selectItem_hist_n_bins.value;

//     // Extracting and preparing data for each measure plot
//     tmp_height = [];
//     tmp_canopy = [];
//     tmp_diameter = [];
//     tmp_leafarea = [];
//     for(k = 0; k < data.length; ++k)
//     {
//         tmp_height.push(data[k][subgroups_1[0]]);
//         tmp_canopy.push(data[k][subgroups_1[1]]);
//         tmp_diameter.push(data[k][subgroups_1[2]]);
//         tmp_leafarea.push(data[k][subgroups_1[3]]);
//     };

//     plotData_1[subgroups_1[0]] = tmp_height;
//     plotData_1[subgroups_1[1]] = tmp_canopy;
//     plotData_1[subgroups_1[2]] = tmp_diameter;
//     plotData_1[subgroups_1[3]] = tmp_leafarea;

//     // Max value on x axis
//     max_width_1 = ((Math.ceil(Math.max(...plotData_1[measureHeading_1])/5)*5)+5);

//   // ---------------------------//
//   //       AXIS  AND SCALE      //
//   // ---------------------------//

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 45000])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).ticks(3));

//   // Add X axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width)
//       .attr("y", height+50 )
//       .text("Gdp per Capita");

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([35, 90])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Add Y axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", 0)
//       .attr("y", -20 )
//       .text("Life expectancy")
//       .attr("text-anchor", "start")

//   // Add a scale for bubble size
//   var z = d3.scaleSqrt()
//     .domain([200000, 1310000000])
//     .range([ 2, 30]);

//   // Add a scale for bubble color
//   var myColor = d3.scaleOrdinal()
//     .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
//     .range(d3.schemeSet1);


//   // ---------------------------//
//   //      TOOLTIP               //
//   // ---------------------------//

//   // -1- Create a tooltip div that is hidden by default:
//   var tooltip = d3.select("#my_dataviz")
//     .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "black")
//       .style("border-radius", "5px")
//       .style("padding", "10px")
//       .style("color", "white")

//   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
//   var showTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//     tooltip
//       .style("opacity", 1)
//       .html("Country: " + d.country)
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var moveTooltip = function(d) {
//     tooltip
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var hideTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//       .style("opacity", 0)
//   }


//   // ---------------------------//
//   //       HIGHLIGHT GROUP      //
//   // ---------------------------//

//   // What to do when one group is hovered
//   var highlight = function(d){
//     // reduce opacity of all groups
//     d3.selectAll(".bubbles").style("opacity", .05)
//     // expect the one that is hovered
//     d3.selectAll("."+d).style("opacity", 1)
//   }

//   // And when it is not hovered anymore
//   var noHighlight = function(d){
//     d3.selectAll(".bubbles").style("opacity", 1)
//   }


//   // ---------------------------//
//   //       CIRCLES              //
//   // ---------------------------//

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("class", function(d) { return "bubbles " + d.continent })
//       .attr("cx", function (d) { return x(d.gdpPercap); } )
//       .attr("cy", function (d) { return y(d.lifeExp); } )
//       .attr("r", function (d) { return z(d.pop); } )
//       .style("fill", function (d) { return myColor(d.continent); } )
//     // -3- Trigger the functions for hover
//     .on("mouseover", showTooltip )
//     .on("mousemove", moveTooltip )
//     .on("mouseleave", hideTooltip )



//     // ---------------------------//
//     //       LEGEND              //
//     // ---------------------------//

//     // Add legend: circles
//     var valuesToShow = [10000000, 100000000, 1000000000]
//     var xCircle = 390
//     var xLabel = 440
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("circle")
//         .attr("cx", xCircle)
//         .attr("cy", function(d){ return height - 100 - z(d) } )
//         .attr("r", function(d){ return z(d) })
//         .style("fill", "none")
//         .attr("stroke", "black")

//     // Add legend: segments
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("line")
//         .attr('x1', function(d){ return xCircle + z(d) } )
//         .attr('x2', xLabel)
//         .attr('y1', function(d){ return height - 100 - z(d) } )
//         .attr('y2', function(d){ return height - 100 - z(d) } )
//         .attr('stroke', 'black')
//         .style('stroke-dasharray', ('2,2'))

//     // Add legend: labels
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("text")
//         .attr('x', xLabel)
//         .attr('y', function(d){ return height - 100 - z(d) } )
//         .text( function(d){ return d/1000000 } )
//         .style("font-size", 10)
//         .attr('alignment-baseline', 'middle')

//     // Legend title
//     svg.append("text")
//       .attr('x', xCircle)
//       .attr("y", height - 100 +30)
//       .text("Population (M)")
//       .attr("text-anchor", "middle")

//     // Add one dot in the legend for each name.
//     var size = 20
//     var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"]
//     svg.selectAll("myrect")
//       .data(allgroups)
//       .enter()
//       .append("circle")
//         .attr("cx", 390)
//         .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .attr("r", 7)
//         .style("fill", function(d){ return myColor(d)})
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)

//     // Add labels beside legend dots
//     svg.selectAll("mylabels")
//       .data(allgroups)
//       .enter()
//       .append("text")
//         .attr("x", 390 + size*.8)
//         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .style("fill", function(d){ return myColor(d)})
//         .text(function(d){ return d})
//         .attr("text-anchor", "left")
//         .style("alignment-baseline", "middle")
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//   })