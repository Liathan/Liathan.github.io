// -------------------------------------------------------------------------
// Assignment 1: BarChart (first plot)
// We want to show the aboundance of each tree species in Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_2 = "#boxplot1"

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 20, bottom: 70, left: 70},
    width_2 = 800 - margin_2.left - margin_2.right,
    height_2 = 600 - margin_2.top - margin_2.bottom;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
    .attr("width", width_2 + margin.left + margin.right)
    .attr("height", height_2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../data/assign2-plot2.csv").then(function(data) {

    

    // Add x axis
    const x = d3.scaleLinear()
        .domain([0, 65])
        .range([0, width_2]);
    svg_2.append("g")
        .attr("transform", "translate(0," + height_2 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px");
    

    const histogram = d3.histogram()
    .value(function(d) { return d.Height; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(n_bin)); // then the numbers of bins

    // And apply this function to data to get the bins
    const bins = histogram(data);


    // Y axis: scale and draw:
    const y = d3.scaleLinear()
    .range([height_2, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg_2.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px");


    // create a tooltip
    const tooltip = d3.select(id_ref_2)
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    // Show the hist
    svg_2.selectAll(id_ref_2)
        .data(bins)
        .join("rect")
         .attr("x", 1)
     .attr("transform", function(d) {return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
        .attr("height", function(d) { return height_2 - y(d.length); })
        .style("fill", "#69b3a2")




//             .attr("x", x(0))
//             .attr("y", function(d) { return y(d.Species); })
//             //.attr("width", function(d) { return Math.max(x(d.Count)-width_2, 0); })
//             .attr("width", function(d) { return x(0); })
//             .attr("height", y.bandwidth() )
//             .attr("fill", "#1c7c54")
//             .attr("opacity", 0.5);
    
//     / Title
    svg_2.append("text")
        .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
       .attr("y", 0 - (margin_2.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")  
        .text("Tree Hight Histogram");

    // X axis label
    svg_2.append("text")      // text label for the x axis
        .attr("x", (width_2 / 2))
        .attr("y", (height_2 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Height (m)");

    // Y axis label
    svg_2.append("text")      // text label for the y axis
        .attr("x", (-height_2 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("Tree Count");

//     // Animation
//     svg_2.selectAll("rect")
//         .transition("loading")
//         .duration(800)
//         .attr("x", function(d) { return x(0); })
//         .attr("width", function(d) { return x(d.Count); });
//         //.delay(function(d,i){return(i*100);})

//     // Animation and filling of tooltip
//     svg_2.selectAll("rect")

//         // MouseOver
//         .on("mouseover", function (event, d) {

//             d3.select(event.currentTarget)
//                 .transition("selected")
//                     .duration(300)
//                     .style("opacity", 1.0);

//             tooltip.transition("appear-box")
//                 .duration(300)
//                 .style("opacity", .9)
//                 // Added to control the fact that the tooltip disappear if
//                 // we move between near boxes (horizontally)
//                 .delay(1);

//             tooltip.html("<span class='tooltiptext'>" + "<b>Abundance: " + d.Count + 
//                          "</b><br>" + "Average canopy size: "+ d.AverageCanopySize + "</span>")
//                 .style("left", (event.pageX) + "px")
//                 .style("top", (event.pageY - 28) + "px");

//         })

//         // MouseOut
//         .on("mouseout", function (event, d) {
//             d3.select(event.currentTarget)
//                 .transition("unselected")
//                     .duration(300)
//                     .style("opacity", 0.5);

//             tooltip.transition("disappear-box")
//                 .duration(300)
//                 .style("opacity", 0);
//         });

});