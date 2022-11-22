// -------------------------------------------------------------------------
// Assignment 2: BubbleChart (fifth plot)
// We want to show the canopy size with respect to a tree size, such as
// height, diameter, or leaf area, and the CO2 sequestratede of each top-6
// tree species in Trento's territory.
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_5 = "#bubblechart-canopysize"

// Set the dimensions and margins of the graph
const margin_5 = {top: 50, right: 20, bottom: 70, left: 70},
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
const tooltip_5 = d3.select(id_ref_5)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// SelectBox to choose the measure to show
var selectItem_bubblechart_measure = document.getElementById("selection-bubblechart-measure");

// The selected measure
var measureHeading_5 = '';

// The possible tree species
var tree_species_5 = [];

// The possible measures (Height, CanopySize, Diameter, Leaf Area)
var subgroups_5 = [];

// X axis label
var x_label_5 = ["Height (m)", "Diameter (cm)", "Leaf area (m\u00B2)"];

// Data
var data5 = [];

function draw5() {

    var data = data5;

    // Remove previous scatterplot and information (like x axis)
    svg_5.selectAll("text")
        .remove();
    svg_5.selectAll(".plot5-axisX")
        .remove();
    svg_5.selectAll("circle")
        .remove();
    svg_5.selectAll("rect")
        .remove();

    measureHeading_5 = selectItem_bubblechart_measure.value;

    // Create a tooltip
    const tooltip = d3.select(id_ref_5)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

    var max_X_5 = d3.max(data, (d) => +d[measureHeading_5]) // il più serve a convertire le stringhe in numeri. JS ....
    max_X_5 = Math.ceil(max_X_5+(5/100*max_X_5))
    var max_Y_5 = d3.max(data, (d) => +d["CO2"])
    max_Y_5 = Math.ceil(max_Y_5 + (5/100*max_Y_5))
    var max_Z_5 = d3.max(data, d => +d["Canopy_size"])
    max_Z_5 = Math.ceil(max_Z_5+(5/100*max_Z_5))

    //Title
    svg_5.append("text")
    .attr("x", ((width_5 - (margin_5.left - margin_5.right)) / 2))             
    .attr("y", 0 - (margin_5.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text(`Correlation between ${measureHeading_5.replace("_", " ").toLowerCase()} and CO\u2082`);

    var x = d3.scaleLinear()
        .domain([0, max_X_5])
        .range([0, width_5])
    svg_5.append("g")
        .attr("class", "plot5-axisX")
        .attr("transform", `translate(0, ${height_5})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "center")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");
    
    // X axis label
    svg_5.append("text")      // text label for the x axis
        .attr("x", (width_5 / 2))
        .attr("y", (height_5 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text(x_label_5[subgroups_5.indexOf(measureHeading_5)]);

    var y = d3.scaleLinear()
        .domain([0, max_Y_5])
        .range([height_5, 0])
    svg_5.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");
   
    // Y axis label
    svg_5.append("text")
        .attr("x", (-height_5 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("CO\u2082 (kg/yr)");

    const z = d3.scaleSqrt()
    .domain([0, max_Z_5])
    .range([0, 25])

    svg_5.append("g")
    .selectAll(".bubble")
    .data(data)
    .join("circle")
        .attr("class", d => `class${tree_species_5.indexOf(d.Species)}`)
        .attr("cx", (d) => x(d[measureHeading_5]))
        .attr("cy", d => y(d["CO2"]))
        .attr("r", d => z(0))
        .attr("stroke", "black")
        .attr("fill", d => color(d["Species"]))
        .attr("fill-opacity", 0.5);
    
    // Animations
    svg_5.selectAll("circle")
        .transition("loading")
        .duration(800)
        .attr("r", d => z(d["Canopy_size"]))
        .delay(function(d,i){return(i);});

    // Animation and filling of tooltip
    svg_5.selectAll("circle")

    // MouseOver
    .on("mouseover", function (event, d) {
        
        // Select all circles
        svg_5.selectAll("circle")
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 0)
            .attr("fill-opacity", 0.05);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species_5.indexOf(d.Species);
        svg_5.selectAll(`.class${idx_d}`)
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 1.0)
            .attr("fill-opacity", 1.0);

        tooltip.transition("appear-box")
            .duration(300)
            .style("opacity", .9)
            // Added to control the fact that the tooltip disappear if
            // we move between near boxes (horizontally)
            .delay(10);

        tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d.Species + "</b>" +
            "<br>" + "<b>Canopy size (m\u00B2): " + d.Canopy_size + "</b>" +
            "<br>" + `${x_label_5[subgroups_5.indexOf(measureHeading_5)]}: ` + d[measureHeading_5] + 
            "<br>" + "CO2 (kg/yr): " + d.CO2 + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })

    // MouseOut
    .on("mouseout", function (event, d) {

        // Select all circles
        svg_5.selectAll("circle")
            .transition("unselected")
            .duration(300)
            .attr("stroke-opacity", 0.5)
            .attr("fill-opacity", 0.5);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species_5.indexOf(d.Species);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .attr("stroke-opacity", 0.5)
        .attr("fill-opacity", 0.5); 

        tooltip.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
    });

    // For legend
    const boxSize = 40; // Size of each box
    const boxGap = 50; // Space between each box
    const howManyAcross = 10; // 10 boxes per line 

    // legend_5
    const legend_5 = svg_5.join("g")
    .selectAll(".legend_5")
    .data(tree_species_5);
    
    legend_5.join("rect")
    .attr("x", (width_5 - margin_5.right - boxGap))
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .attr("width", boxSize - 3)
    .attr("height", boxSize - 3)
    .attr("class", d => "class"+tree_species_5.indexOf(d))
    .attr("fill", function(d){ return color(d); })
    .attr("fill-opacity", 0.5);
    
    legend_5.join("text")
    .attr("x", (width_5 - margin_5.right - boxGap - 10))
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .append("tspan")
    .attr("dx", 0)
    .attr("dy", boxSize/2)
    .style("fill", d => color(d))
    .style("alignment-baseline", "middle")
    .style("text-anchor", "end")
    .style("font-size", "14px")
    .text((d) => d)
    .attr("class", d => "class"+tree_species_5.indexOf(d))
    .attr("fill-opacity", 0.5);

    // Animation with legend
    svg_5.selectAll("rect")

    // MouseOver
    .on("mouseover", function (event, d) {

        // Select all circles
        svg_5.selectAll("circle")
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 0)
            .attr("fill-opacity", 0.05);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 1.0)
            .attr("fill-opacity", 1.0);
    })

    // MouseOut
    .on("mouseout", function (event, d) {

        // Select all circles
        svg_5.selectAll("circle")
            .transition("unselected")
            .duration(300)
            .attr("stroke-opacity", 0.5)
            .attr("fill-opacity", 0.5);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .attr("stroke-opacity", 0.5)
        .attr("fill-opacity", 0.5); 
    }); 
};

// Parse the Data
d3.csv('../../data/assign2/assign2-plot5.csv').then(function(data) {

    // Save data in a shared variable
    data5 = data;

    // Recall the top-6 tree names, without "Others"
    tree_species_5 = color.domain().slice(0,6);
    
    // Extract subgroups (possible measures)
    subgroups_5 = data.columns.slice(1,4);

    // Load possible options for "measures" in the selectBox
    for(j = 0; j < subgroups_5.length; ++j)
    {
        opt = new Option(subgroups_5[j].replace("_", " "), subgroups_5[j]);
        selectItem_bubblechart_measure.appendChild(opt);
    };

    draw5();

});