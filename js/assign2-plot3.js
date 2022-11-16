// -------------------------------------------------------------------------
// Assignment 2: Histogram (first plot)
// We want to show the distribution of some measures of trees in Trento's 
// territory. We analyze: Height (m), Canopy Size (m2), and Diameter (cm)
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_3 = "#scatterplot";

// Set the dimensions and margins of the graph
const margin_3 = {top: 50, right: 20, bottom: 70, left: 70},
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom;


// append the svg_3 object to the body of the page
const svg_3 = d3.select("#scatterplot")
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", '0 0 ' + (width_3 + margin_3.left + margin_3.right) +
        ' ' + (height_3 + margin_3.top + margin_3.bottom))
        // .attr("width", width_3 + margin_3.left + margin_3.right)
        // .attr("height", height_3 + margin_3.top + margin_3.bottom)
    .append("g")
        .attr("transform", `translate(${margin_3.left}, ${margin_3.top})`);

    const color_2 = d3.scaleOrdinal()
                .domain(["Tilia cordata", "Carpinus betulus", "Celtis australis", "Platanus x hispanica", "Tilia x europaea", "Aesculus hippocastanum"])
                .range(["#440154ff", "#21908dff", "#fde725ff" , "#009bff" , "#08e8de" , "#191970" ]);

//Read the data
d3.csv("../data/assign2-plot3.csv").then(function(data) {

    var max_X = d3.max(data, function(d) { return +d.Leaf_area;} );

    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, max_X])
    .range([ 0, width_3 ]);
    svg_3.append("g")
    .attr("transform", `translate(0, ${height_3})`)
    .call(d3.axisBottom(x));

    var max_Y = d3.max(data, function(d) { return +d.CO2;} );

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, max_Y])
    .range([ height_3, 0]);
    svg_3.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    svg_3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", function (d) { return x(d.Leaf_area); } )
        .attr("cy", function (d) { return y(d.CO2); } )
        .attr("r", 1.5)
        .style("fill", function (d) { return color_2(d.Species) })

    //Title
    svg_3.append("text")
        .attr("x", ((width_3 - (margin_3.left - margin_3.right)) / 2))             
        .attr("y", 0 - (margin_3.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")  
        .text("Correlation between Leaf Area and CO2");

    // X axis label
    svg_3.append("text")      // text label for the x axis
        .attr("x", (width_3 / 2))
        .attr("y", (height_3 + margin_3.bottom))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("CO2");

    // Y axis label
    svg_3.append("text")
        .attr("x", (-height_3 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("Count");

})

  