// -------------------------------------------------------------------------
// Assignment 1: BarChart (first plot)
// We want to show the aboundance of each tree species in Trento's territory
//--------------------------------------------------------------------------



// Refer to the id div
const id_ref_2 = "boxplot-tree-size"

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 20, bottom: 70, left: 70},
    width_2 = 800 - margin_2.left - margin_2.right,
    height_2 = 600 - margin_2.top - margin_2.bottom;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
    .attr("width", width_2 + margin_2.left + margin_2.right)
    .attr("height", height_2 + margin_2.top + margin_2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_2.left + "," + margin_2.top + ")");

// Parse the Data
d3.csv("../data/assign2-plot2.csv").then(function(data) {




  
    
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.

   
    console.log(sumstat)

    // Show the X scale
    var x = d3.scaleBand()
    .range([ 0, width_2 ])
    .domain(["Tilia Cordata", "Carpinus Australis", "Celtis Australis"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg_2.append("g")
    .attr("transform", "translate(0," + height_2 + ")")
    .call(d3.axisBottom(x))


      // Show the Y scale
    var y = d3.scaleLinear()
    .domain([3,9])
    .range([height_2, 0])
    svg_2.append("g").call(d3.axisLeft(y))


    // create a tooltip
    // const tooltip = d3.select(id_ref_2)
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("font-size", "14px")
    //     .style("background-color", "white")
    //     .style("border", "solid")
    //     .style("border-width", "1px")
    //     .style("border-radius", "5px")
    //     .style("padding", "10px")
    //     .style("opacity", 0);

    // Show the hist
    svg_2.selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 100
  svg_2.selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

  // Show the median
  svg_2
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)
})


//             .attr("x", x(0))
//             .attr("y", function(d) { return y(d.Species); })
//             //.attr("width", function(d) { return Math.max(x(d.Count)-width_2, 0); })
//             .attr("width", function(d) { return x(0); })
//             .attr("height", y.bandwidth() )
//             .attr("fill", "#1c7c54")
//             .attr("opacity", 0.5);
    
//     / Title
    // svg_2.append("text")
    //     .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
    //    .attr("y", 0 - (margin_2.top / 2))
    //     .style("class", "h2")
    //     .style("font-size", "18px")
    //     .attr("text-anchor", "middle")  
    //     .style("text-decoration", "underline")  
    //     .text("Tree Hight Histogram");

    // // X axis label
    // svg_2.append("text")      // text label for the x axis
    //     .attr("x", (width_2 / 2))
    //     .attr("y", (height_2 + 50))
    //     .style("class", "h2")
    //     .style("font-size", "16px")
    //     .style("text-anchor", "middle")
    //     .text("Height (m)");

    // // Y axis label
    // svg_2.append("text")      // text label for the y axis
    //     .attr("x", (-height_2 / 2))
    //     .attr("y", -50)
    //     .style("text-anchor", "middle")
    //     .style("class", "h2")
    //     .style("font-size", "16px")
    //     .attr("transform", "rotate(-90)")
    //     .text("Tree Count");

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
//});