// -------------------------------------------------------------------------
// Assignment 2: Scatterplot (third plot)
// We want to show the CO2 (y axis) with respect to some measures of trees 
// in Trento's territory. 
// We analyze: Height (m), Diameter (cm), Canopy Size (m2), and Leaf area (m2).
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_3 = "#scatterplot";

// Set the dimensions and margins of the graph
const margin_3 = {top: 50, right: 20, bottom: 70, left: 70},
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom,
    boxSize = 40, //Size of each box
    boxGap = 50, // Space between each box
    howManyAcross = 10; // 10 boxes per line 


// append the svg_3 object to the body of the page
const svg_3 = d3.select(id_ref_3)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", '0 0 ' + (width_3 + margin_3.left + margin_3.right) +
        ' ' + (height_3 + margin_3.top + margin_3.bottom))
        // .attr("width", width_3 + margin_3.left + margin_3.right)
        // .attr("height", height_3 + margin_3.top + margin_3.bottom)
    .append("g")
        .attr("transform", `translate(${margin_3.left}, ${margin_3.top})`);

    // const color = d3.scaleOrdinal()
    //             .domain(["Tilia cordata", "Carpinus betulus", "Celtis australis", "Platanus x hispanica", "Tilia x europaea", "Aesculus hippocastanum"])
    //             .range(["#440154ff", "#21908dff", "#fde725ff" , "#009bff" , "#08e8de" , "#191970" ]);

// Read the data
d3.csv("../data/assign2-plot3.csv").then(function(data) {

    // Recall the top-5/6 tree names + "Others"
    subgroups_3 = color.domain()

    // X axis max value
    var max_X_value = d3.max(data, function(d) { return +d.Leaf_area; } );
    var x_max = (Math.ceil(max_X_value+(5/100*max_X_value))/5)*5;

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, x_max])
        .range([0, width_3]);
    svg_3.append("g")
        .attr("transform", `translate(0, ${height_3})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "center")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Y axis max value
    var max_Y_value = d3.max(data, function(d) { return +d.CO2; });
    var y_max = (Math.ceil(max_Y_value+(5/100*max_Y_value))/5)*5;

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, y_max])
        .range([height_3, 0]);
    svg_3.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Add dots
    svg_3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("class", d => `class${subgroups_3.indexOf(d.Species)}`)
        .attr("cx", function (d) { return x(d.Leaf_area); } )
        .attr("cy", function (d) { return y(d.CO2); } )
        .attr("r", 0)
        .attr("stroke", "black")
        .style("fill", function (d) { return color(d.Species) })
        .attr("opacity", 0.5);

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
        .attr("y", (height_3 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Leaf area");

    // Y axis label
    svg_3.append("text")
        .attr("x", (-height_3 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("CO2");

    // Animations
    svg_3.selectAll("circle")
        .transition("loading")
        .duration(800)
        .attr("r", 4);

    // legend_3
    var legend_3 = svg_3.join("g")
    .selectAll(".legend_3")
    .data(subgroups_3);
    
    legend_3.join("rect")
    .attr("x", (width_3 - margin_3.right - boxGap))
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .attr("width", boxSize - 3)
    .attr("height", boxSize - 3)
    .attr("class", d => "class"+subgroups_3.indexOf(d))
    .attr("fill", function(d){ return color(d); })
    .attr("opacity", 0.5);
    
    legend_3.join("text")
    .attr("x", (width_3 - margin_3.right - boxGap - 10))
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .append("tspan")
    .attr("dx", 0)
    .attr("dy", boxSize/2)
    .style("fill", d => color(d))
    .style("alignment-baseline", "middle")
    .style("text-anchor", "end")
    .style("font-size", "14px")
    .text((d) => d)
    .attr("class", d => "class"+subgroups_3.indexOf(d))
    .attr("opacity", 0.5)

    // Animation and filling of tooltip
    svg_3.selectAll("circle")

    // MouseOver
    .on("mouseover", function (event, d) {
        
        // Select all circles
        svg_3.selectAll("circle")
            .transition("selected")
            .duration(1)
            .style("opacity", 0.2);

        // Select all the circle with this specific class (tree species)
        idx_d = subgroups_3.indexOf(d.Species);
        svg_3.selectAll(`.class${idx_d}`)
            .transition("selected")
            .duration(1)
            .style("opacity", 1.0);

        tooltip.transition("appear-box")
            .duration(300)
            .style("opacity", .9)
            // Added to control the fact that the tooltip disappear if
            // we move between near boxes (horizontally)
            .delay(1);

        tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d.Species + "</b>" + 
            "<br>" + "Leaf area (m\u00B2): " + d.Leaf_area + 
            "<br>" + "CO2 (kg/yr): " + d.CO2 + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })

    // MouseOut
    .on("mouseout", function (event, d) {

        // Select all circles
        svg_3.selectAll("circle")
            .transition("selected")
            .duration(1)
            .style("opacity", 0.5);

        // Select all the circle with this specific class (tree species)
        idx_d = subgroups_3.indexOf(d.Species);
        svg_3.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5); 

        tooltip.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
    });

    
})

  